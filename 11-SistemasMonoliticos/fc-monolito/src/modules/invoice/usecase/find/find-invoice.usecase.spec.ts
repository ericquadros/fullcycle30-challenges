import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice-items.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice(
  new Id("1"),
  "Invoice 1",
  "Document 1",
  new Address("Street 1", "123", "Complement", "City", "State", "12345-678"),
  [
    new InvoiceItems(new Id("1"), "Item 1", 100),
    new InvoiceItems(new Id("2"), "Item 2", 200),
  ]
);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  };
};

describe("Find Invoice UseCase", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const result = await usecase.execute({ id: "1" });

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("Document 1");
    expect(result.address.street).toBe("Street 1");
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(300);
  });
}); 