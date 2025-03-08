import { Sequelize } from "sequelize-typescript";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUseCase from "../usecase/find/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate-invoice.usecase";
import InvoiceRepository from "../repository/invoice.repository";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import { InvoiceSequelizeFactory } from "../repository/sequelize.factory";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import InvoiceItems from "../domain/invoice-items.entity";

const input = {
  id: "1",
  name: "Invoice 1",
  document: "Document 1",
  street: "Street 1",
  number: "123",
  complement: "Complement",
  city: "City",
  state: "State",
  zipCode: "12345-678",
  items: [
    { id: "1", name: "Item 1", price: 100 },
    { id: "2", name: "Item 2", price: 200 },
  ],
};

describe("Invoice Facade", () => {
  let sequelize: Sequelize;
  let facade: InvoiceFacade;
  let repository: InvoiceRepository;
  let generateUseCase: GenerateInvoiceUseCase;
  let findUseCase: FindInvoiceUseCase;

  beforeEach(async () => {
    sequelize = await InvoiceSequelizeFactory.getInstance();
    await sequelize.sync({ force: true });

    repository = new InvoiceRepository(sequelize);
    generateUseCase = new GenerateInvoiceUseCase(repository);
    findUseCase = new FindInvoiceUseCase(repository);

    facade = new InvoiceFacade({
      generateUseCase,
      findUseCase,
    });
  });

  afterEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should generate an invoice", async () => {
    const result = await facade.generate(input);

    expect(result).toBeDefined();
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.street);
    expect(result.address.number).toBe(input.number);
    expect(result.address.complement).toBe(input.complement);
    expect(result.address.city).toBe(input.city);
    expect(result.address.state).toBe(input.state);
    expect(result.address.zipCode).toBe(input.zipCode);    
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);

    const storedInvoice = await InvoiceModel.findOne({
      where: { id: input.id },
      include: [InvoiceItemModel],
    });

    expect(storedInvoice).toBeDefined();
    expect(storedInvoice.id).toBe(input.id);
    expect(storedInvoice.name).toBe(input.name);
    expect(storedInvoice.document).toBe(input.document);
    expect(storedInvoice.street).toBe(input.street);
    expect(storedInvoice.number).toBe(input.number);
    expect(storedInvoice.complement).toBe(input.complement);
    expect(storedInvoice.city).toBe(input.city);
    expect(storedInvoice.state).toBe(input.state);
    expect(storedInvoice.zipCode).toBe(input.zipCode);
    expect(storedInvoice.items).toHaveLength(2);
  });

  it("should find an invoice", async () => {
    // Primeiro cria uma invoice
    await facade.generate(input);

    // Depois busca
    const result = await facade.find({ id: "1" });

    console.log(result);


    expect(result).toBeDefined();    
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.street);
    expect(result.address.number).toBe(input.number);
    expect(result.address.complement).toBe(input.complement);
    expect(result.address.city).toBe(input.city);
    expect(result.address.state).toBe(input.state);
    expect(result.address.zipCode).toBe(input.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
  });
}); 