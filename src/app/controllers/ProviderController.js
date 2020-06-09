import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'], // Pegando somente as informações que eu quero do meu banco
      include: [{
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url']
      }],
    }); // Pegando todos os usuarios que tem provider = true

    return res.json(providers);
  }
}

export default new ProviderController();
