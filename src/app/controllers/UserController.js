import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // Validação dos dados de entrada
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    })

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails' })
    } // Verificando se os dados são validos

    const userExists = await User.findOne({ where: { email: req.body.email } }); // Verificado se o usuario existe

    if(userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);


    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ), // Ele so vai executar o required do password se o oldPassword for passado no meu req.body
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    })

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails' })
    } // Verificando se os dados são validos

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if(email !== user.email) {
      const userExists = await User.findOne({ where: { email } }); // Verificado se o usuario existe

      if(userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    } // Iso ira verificar somente se ele mandar o oldPassword

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
