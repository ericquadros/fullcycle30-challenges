'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if there are any existing balances, to avoid duplicate data and errorss
    const existingBalances = await queryInterface.sequelize.query(
      'SELECT COUNT(1) as count FROM balances;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // If there are any balances, skip seeding
    if (existingBalances[0].count > 0) {
      console.log('💡 Balances table already has data, skipping seeds');
      return;
    }

    console.log('🌱 Inserting initial balances...');
    await queryInterface.bulkInsert('balances', [
      {
        account_id: '8f4b2c9d-5a3e-4c1f-9d6b-8e7f2a1b3c4d',
        amount: 1236.70,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        account_id: '7a1b3c4d-9e8f-4a2b-8c7d-6e5f4d3a2b1c',
        amount: 2197.20,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
    console.log('✅ Initial balances inserted successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('balances', {});
  }
}; 