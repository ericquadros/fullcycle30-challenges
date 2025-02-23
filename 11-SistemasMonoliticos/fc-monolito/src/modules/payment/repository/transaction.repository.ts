import Transaction from "../domain/transaction";
import PaymentGateway from "../gateway/payment.gateway";
import TransactionModel from "./transaction.model";
import { PaymentSequelizeFactory } from "./sequelize.factory";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class TransactionRepository implements PaymentGateway {
  async save(input: Transaction): Promise<Transaction> {
    try {
      console.log('Saving transaction with data:', {
        id: input.id.id,
        orderId: input.orderId,
        amount: input.amount,
        status: input.status,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      });

      const transaction = await TransactionModel.create({
        id: input.id.id,
        orderId: input.orderId,
        amount: input.amount,
        status: input.status,
        createdAt: input.createdAt || new Date(),
        updatedAt: input.updatedAt || new Date(),
      });

      console.log('Transaction saved successfully:', transaction.toJSON());

      return new Transaction({
        id: transaction.id,
        orderId: transaction.orderId,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }
}
