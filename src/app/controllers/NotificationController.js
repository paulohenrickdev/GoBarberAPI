import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if(!checkIsProvider) {
      return res.status(401).json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: 'desc' }).limit(20);

    res.json(notifications);
  }

  async update(req, res) { // Essa rota passa o read para true
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, // Pegando o ID que vem dos parametros
      { read: true }, // Passando a view pra true
      { new: true } // padrao
    );

    return res.json(notification);
  }
}

export default new NotificationController();