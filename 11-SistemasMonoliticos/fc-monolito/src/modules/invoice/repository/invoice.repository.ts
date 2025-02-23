import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<Invoice> {
    try {
      console.log('Generating invoice with data:', {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map(item => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
      });

      const invoiceCreated = await InvoiceModel.create(
        {
          id: invoice.id.id,
          name: invoice.name,
          document: invoice.document,
          street: invoice.address.street,
          number: invoice.address.number,
          complement: invoice.address.complement,
          city: invoice.address.city,
          state: invoice.address.state,
          zipCode: invoice.address.zipCode,
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
          items: invoice.items.map((item) => ({
            id: item.id.id,
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })),
        },
        {
          include: [{ model: InvoiceItemModel }],
        }
      );

      console.log('Invoice generated successfully:', invoiceCreated.toJSON());

      return new Invoice({
        id: new Id(invoiceCreated.id),
        name: invoiceCreated.name,
        document: invoiceCreated.document,
        address: {
          street: invoiceCreated.street,
          number: invoiceCreated.number,
          complement: invoiceCreated.complement,
          city: invoiceCreated.city,
          state: invoiceCreated.state,
          zipCode: invoiceCreated.zipCode,
        },
        items: invoiceCreated.items.map((item) => ({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })),
        createdAt: invoiceCreated.createdAt,
        updatedAt: invoiceCreated.updatedAt,
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }
} 