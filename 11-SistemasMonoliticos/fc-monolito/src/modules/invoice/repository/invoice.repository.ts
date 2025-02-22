import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice-items.entity";
import InvoiceGateway from "../gateway/invoice.gateway";

export default class InvoiceRepository implements InvoiceGateway {
  private invoices: Invoice[] = [];

  async find(id: string): Promise<Invoice> {
    const invoice = this.invoices.find((invoice) => invoice.id.id === id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }
    return invoice;
  }

  async generate(invoice: Invoice): Promise<Invoice> {
    this.invoices.push(invoice);
    return invoice;
  }
} 