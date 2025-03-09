import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert('balances', [
    {
      account_id: 'test-account-1',
      amount: 1000.00,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      account_id: 'test-account-2',
      amount: 2000.00,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('balances', {});
}


