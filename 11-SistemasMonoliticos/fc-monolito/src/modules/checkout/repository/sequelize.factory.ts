import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import OrderItemModel from "./order-item.model";

export class CheckoutSequelizeFactory {
  private static instance: Sequelize;

  static async getInstance(): Promise<Sequelize> {
    if (!this.instance) {
      this.instance = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });

      this.instance.addModels([OrderModel, OrderItemModel]);
      await this.instance.sync();
    }

    return this.instance;
  }
} 