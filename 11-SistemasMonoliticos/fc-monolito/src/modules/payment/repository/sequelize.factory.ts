import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory";

export class PaymentSequelizeFactory {
  static async getInstance(): Promise<Sequelize> {
    const sequelize = await SharedSequelizeFactory.getInstance();
    
    if (!sequelize.models.TransactionModel) {
      sequelize.addModels([TransactionModel]);
      await sequelize.sync();
    }
    
    return sequelize;
  }
} 