import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.factory";

describe("Invoice Facade", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
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

    const invoice = await facade.generate(input);

    expect(invoice.name).toBe(input.name);
    expect(invoice.document).toBe(input.document);
    expect(invoice.street).toBe(input.street);
    expect(invoice.items).toHaveLength(2);
    expect(invoice.total).toBe(300);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const generateInput = {
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

    const invoice = await facade.generate(generateInput);
    const result = await facade.find({ id: invoice.id });

    expect(result.name).toBe(generateInput.name);
    expect(result.document).toBe(generateInput.document);
    expect(result.address.street).toBe(generateInput.street);
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
  });
}); 