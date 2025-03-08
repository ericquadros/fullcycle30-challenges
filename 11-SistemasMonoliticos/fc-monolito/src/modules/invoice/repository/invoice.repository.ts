import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoice-items.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Address from "../domain/address.value-object";
import { Sequelize } from "sequelize-typescript";

export default class InvoiceRepository implements InvoiceGateway {
  constructor(private _sequelize: Sequelize) {}

  async generate(invoice: Invoice): Promise<Invoice> {
    try {
      const now = new Date();
      const invoiceData = {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        createdAt: now,
        updatedAt: now,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          createdAt: now,
          updatedAt: now,
        })),
      };

      const invoiceCreated = await this._sequelize.models.InvoiceModel.create(
        invoiceData,
        {
          include: [{ model: this._sequelize.models.InvoiceItemModel }],
        }
      );

      const createdInvoice = invoiceCreated.toJSON();
      return new Invoice({
        id: new Id(createdInvoice.id),
        name: createdInvoice.name,
        document: createdInvoice.document,
        address: new Address(
          createdInvoice.street,
          createdInvoice.number,
          createdInvoice.complement,
          createdInvoice.city,
          createdInvoice.state,
          createdInvoice.zipCode
        ),
        items: createdInvoice.items.map((item: any) => new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: createdInvoice.createdAt,
        updatedAt: createdInvoice.updatedAt,
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  async find(id: string): Promise<Invoice> {
    try {
      const invoice = await this._sequelize.models.InvoiceModel.findOne({
        where: { id },
        include: [this._sequelize.models.InvoiceItemModel],
      });

      if (!invoice) {
        throw new Error(`Invoice with id ${id} not found`);
      }

      const foundInvoice = invoice.toJSON();
      return new Invoice({
        id: new Id(foundInvoice.id),
        name: foundInvoice.name,
        document: foundInvoice.document,
        address: new Address(
          foundInvoice.street,
          foundInvoice.number,
          foundInvoice.complement,
          foundInvoice.city,
          foundInvoice.state,
          foundInvoice.zipCode
        ),
        items: foundInvoice.items.map((item: any) => new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: foundInvoice.createdAt,
        updatedAt: foundInvoice.updatedAt,
      });
    } catch (error) {
      console.error('Error finding invoice:', error);
      throw error;
    }
  }
} 