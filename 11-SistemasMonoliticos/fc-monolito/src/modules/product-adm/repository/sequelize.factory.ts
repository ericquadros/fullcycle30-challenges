import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import { SharedSequelizeFactory } from "../../@shared/database/sequelize.factory";

export class ProductAdmSequelizeFactory {
  static async getInstance(): Promise<Sequelize> {
    const sequelize = await SharedSequelizeFactory.getInstance();
    
    if (!sequelize.models.ProductModel) {
      sequelize.addModels([ProductModel]);
      await sequelize.sync();
    }
    
    return sequelize;
  }
} 