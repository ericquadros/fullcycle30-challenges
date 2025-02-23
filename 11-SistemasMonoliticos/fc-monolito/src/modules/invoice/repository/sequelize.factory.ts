import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";

export class InvoiceSequelizeFactory {
  private static instance: Sequelize;

  static async getInstance(): Promise<Sequelize> {
    if (!this.instance) {
      this.instance = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });

      this.instance.addModels([InvoiceModel, InvoiceItemModel]);
      await this.instance.sync();
    }

    return this.instance;
  }
} 