import { Sequelize } from "sequelize-typescript";
import StoreCatalogProductModel from "./product.model";
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory";

export class StoreCatalogSequelizeFactory {
  static async getInstance(): Promise<Sequelize> {
    const sequelize = await SharedSequelizeFactory.getInstance();
    
    if (!sequelize.models.StoreCatalogProductModel) {
      sequelize.addModels([StoreCatalogProductModel]);
      await sequelize.sync();
    }
    
    return sequelize;
  }
} 