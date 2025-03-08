import { Sequelize } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory";

export class InvoiceSequelizeFactory {
  static async getInstance(): Promise<Sequelize> {
    const sequelize = await SharedSequelizeFactory.getInstance();
    
    if (!sequelize.models.InvoiceModel) {
      sequelize.addModels([InvoiceModel, InvoiceItemModel]);
      await sequelize.sync();
    }
    
    return sequelize;
  }
} 