import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`
          } // Metodo get é como eu quero formatar esse valor (como ele vai ser retornado)
        }
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
