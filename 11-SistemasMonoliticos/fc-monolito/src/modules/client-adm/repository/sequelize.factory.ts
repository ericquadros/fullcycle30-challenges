import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory";

export class ClientAdmSequelizeFactory {
  static async getInstance(): Promise<Sequelize> {
    const sequelize = await SharedSequelizeFactory.getInstance();
    
    if (!sequelize.models.ClientModel) {
      await sequelize.addModels([ClientModel]);
      await sequelize.sync();
      console.log("Factory - Models:", Object.keys(sequelize.models));
      console.log("Factory - Tables:", await sequelize.getQueryInterface().showAllTables());
    }
    
    return sequelize;
  }
} 