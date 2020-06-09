import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize'
import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    }); // Buscando se o usuario logado é um prestado de serviço

    if(!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' }); // Se nao for, erro ...
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)], // Com isso ele olha tudo que está de 2020-06-04 de 00:00:00 até 23:59:59
        },
      },
      order: ['date']
    })

    return res.json(appointments);
  }
}

export default new ScheduleController();
