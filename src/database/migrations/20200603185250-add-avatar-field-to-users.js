

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // Todo avatar_id da tabela usuarios vai ser um id contido na tabela files
        onUpdate: 'CASCADE', // Caso seja alterado, irá alterar aqui na tabela
        onDelete: 'SET NULL', // Caso seja excluido ira ter o valor null
        allowNull: true,
      },
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
