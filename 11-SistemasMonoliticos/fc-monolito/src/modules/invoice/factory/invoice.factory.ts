import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate-invoice.usecase";

export default class InvoiceFactory {
  static create() {
    const repository = new InvoiceRepository();
    const findUseCase = new FindInvoiceUseCase(repository);
    const generateUseCase = new GenerateInvoiceUseCase(repository);
    const facade = new InvoiceFacade({
      findUseCase: findUseCase,
      generateUseCase: generateUseCase,
    });
    return facade;
  }
} 