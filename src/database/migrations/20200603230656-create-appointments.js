

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // Todo avatar_id da tabela usuarios vai ser um id contido na tabela files
        onUpdate: 'CASCADE', // Caso seja alterado, irá alterar aqui na tabela
        onDelete: 'SET NULL', // Caso seja excluido ira ter o valor null
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }, // Todo avatar_id da tabela usuarios vai ser um id contido na tabela files
        onUpdate: 'CASCADE', // Caso seja alterado, irá alterar aqui na tabela
        onDelete: 'SET NULL', // Caso seja excluido ira ter o valor null
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('appointments');
  }
};
