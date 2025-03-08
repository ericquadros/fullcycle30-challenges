import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory";

export class ClientAdmSequelizeFactory {
  static async getInstance(): Promise<Sequelize> {
    const sequelize = await SharedSequelizeFactory.getInstance();
    
    if (!sequelize.models.ClientModel) {
      sequelize.addModels([ClientModel]);
      await sequelize.sync();
    }
    
    return sequelize;
  }
} 