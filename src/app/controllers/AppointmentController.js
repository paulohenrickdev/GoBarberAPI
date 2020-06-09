import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query; // Pegando a pagina que vem do req.query

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20, // Limitando a 20 oque a pagina response
      attributes: ['id', 'date', 'past', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path' ,'url'],
            }
          ]
        },
      ]
    });

    return res.json(appointment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails' })
    }

    const { provider_id, date } = req.body;

    // Verificar se ele é um provedor de serviços
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true } // Procurando um provider com o mesmo id e verificando se ele está como true na tabela
    });

    if(!isProvider) {
      return res.status(401).json({ error: 'You can only create appointments with providers' })
    }

    const hourStart = startOfHour(parseISO(date)); // O parseISO transfere a data para um objeto Js e o startOfHour se a hora for 19:30 ele transforma para 19:00 (sempre pega o inicio da hora)

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' })
    } // Se a hora que ele esta tentando cadastrar já estiver passado

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    })

    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date is not available' })
    } // Se ele encontrar quer dizer que o horario nao está vago

    // Verificar se ele nao está marcando com ele mesmo
    if(req.userId === provider_id) {
      return res.status(401).json({ error: 'Voce nao pode marcar para voce mesmo' })
    }


    const appointment = await Appointment.create({
      user_id: req.userId, // Esse userId é retornado quando o usuario loga na aplicação feito anteriormente
      provider_id,
      date,
    }); // Criando o agendamento

    // Depois de criado o agendamento, é hora de notificar o prestador de serviço
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' H:mm'h'", // dia 22 de junho ás 8:40
      { locale: pt }
    )

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    })

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ]
    }); // Pegando o ID a ser deletado e pegando o nome e email do prestador(lembrando que possui o relacionamento...)

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({ error: "You don't have permission to cancel this appointment." });
    } // Verificando se o usuario logado é o usuario dono do agendamento

    const dateWithSub = subHours(appointment.date, 2); // Com isso eu removo 2 horas do horario do agendamento

    if(isBefore(dateWithSub, new Date())) {
      return res.status(401).json({ error: 'You can only cancel appointments 2 hours in advance' });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    res.json(appointment);
  }
}

export default new AppointmentController();
