import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Transaction, { TransactionStatus } from "../../domain/transaction";
import PaymentGateway from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDto,
  ProcessPaymentOutputDto,
} from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
  constructor(private transactionRepository: PaymentGateway) {}

  async execute(
    input: ProcessPaymentInputDto
  ): Promise<ProcessPaymentOutputDto> {
    console.log('Processing payment with input:', input);

    // TODO: implementar regras de negócio reais para aprovação
    // Hoje está simulando regra de aprovação: aprova se amount > 0
    const transaction = new Transaction({
      amount: input.amount,
      orderId: input.orderId,
      status: input.amount > 0 ? TransactionStatus.APPROVED : TransactionStatus.DECLINED
    });

    console.log('Created transaction:', {
      id: transaction.id.id,
      orderId: transaction.orderId,
      amount: transaction.amount,
      status: transaction.status,
    });

    const persistedTransaction = await this.transactionRepository.save(transaction);

    console.log('Payment processed. Result:', {
      transactionId: persistedTransaction.id.id,
      orderId: persistedTransaction.orderId,
      amount: persistedTransaction.amount,
      status: persistedTransaction.status,
    });

    return {
      transactionId: persistedTransaction.id.id,
      orderId: persistedTransaction.orderId,
      amount: persistedTransaction.amount,
      status: persistedTransaction.status,
      createdAt: persistedTransaction.createdAt,
      updatedAt: persistedTransaction.updatedAt,
    };
  }
}
