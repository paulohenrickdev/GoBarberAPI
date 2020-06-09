import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Campo que nunca vai existir na base de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8) // Criptografando a minha senha e passando o hash da minha criptografia que sera de 8
      }
    }); // Antes de qualquer usuario ser salvo no banco de dados, esse codigo ira ser executado

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // Fazrndo a referencia do id do arquivo dentro da tabela de usuario
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash) // Verificando se as senhas batem
  }
}

export default User;
