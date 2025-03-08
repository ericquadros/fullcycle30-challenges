import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import { PaymentSequelizeFactory } from "../repository/sequelize.factory";

export default class PaymentFacadeFactory {
  static async create() {
    const sequelize = await PaymentSequelizeFactory.getInstance();
    const repository = new TransactionRepository();
    const usecase = new ProcessPaymentUseCase(repository);
    const facade = new PaymentFacade(usecase);
    return facade;
  }
}
