import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate-invoice.usecase";
import { InvoiceSequelizeFactory } from "../repository/sequelize.factory";

export default class InvoiceFacadeFactory {
  static async create() {
    const sequelize = await InvoiceSequelizeFactory.getInstance();
    const repository = new InvoiceRepository(sequelize);
    const findUseCase = new FindInvoiceUseCase(repository);
    const generateUseCase = new GenerateInvoiceUseCase(repository);
    
    const facade = new InvoiceFacade({
      findUseCase: findUseCase,
      generateUseCase: generateUseCase,
    });

    return facade;
  }
} 