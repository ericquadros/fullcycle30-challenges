import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";

export class ClientAdmSequelizeFactory {
  private static instance: Sequelize;

  static async getInstance(): Promise<Sequelize> {
    if (!this.instance) {
      this.instance = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });

      this.instance.addModels([ClientModel]);
      await this.instance.sync();
    }

    return this.instance;
  }
} 