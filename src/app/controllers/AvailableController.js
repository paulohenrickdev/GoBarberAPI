import  { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController{
  async index(req, res) {
    const { date } = req.query;

    if(!date) {
      return res.status(400).json({ error: 'Invalid Date' });
    }

    const seachDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId, // providerId que vem da URL
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(seachDate), endOfDay(seachDate)],
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    const avaiable = schedule.map(time => {
      const [hour, minut] = time.split(':'); // Tudo que vier antes do 2 ponto é hour e tudo que vier depois é minut
      const value = setSeconds(setMinutes(setHours(seachDate, hour), minut), 0) // Está retoirnando 2020-06-08 08:00:00

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) && // Verificar se o horario já passou da minha hora atual
          !appointments.find(a =>
            format(a.date, 'HH:mm') === time), // Verificando se o horario já está vago
      };
    });



    return res.json(avaiable);
  }
}

export default new AvailableController();
