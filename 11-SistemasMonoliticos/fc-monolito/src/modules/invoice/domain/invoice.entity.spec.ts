import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "./address.value-object";
import Invoice from "./invoice.entity";
import InvoiceItems from "./invoice-items.entity";

describe("Invoice Entity", () => {
  it("should create an invoice", () => {
    const address = new Address(
      "Street 1",
      "123",
      "Complement",
      "City",
      "State",
      "12345-678"
    );

    const items = [
      new InvoiceItems(new Id("1"), "Item 1", 100),
      new InvoiceItems(new Id("2"), "Item 2", 200),
    ];

    const invoice = new Invoice(
      new Id("123"),
      "Invoice 1",
      "Document 1",
      address,
      items
    );

    expect(invoice.id.id).toBe("123");
    expect(invoice.name).toBe("Invoice 1");
    expect(invoice.document).toBe("Document 1");
    expect(invoice.address).toBe(address);
    expect(invoice.items).toHaveLength(2);
    expect(invoice.total).toBe(300);
  });
}); 