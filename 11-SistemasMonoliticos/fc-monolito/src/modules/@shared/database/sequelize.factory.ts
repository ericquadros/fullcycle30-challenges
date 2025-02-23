import { Sequelize } from "sequelize-typescript";

export class SharedSequelizeFactory {
  private static instance: Sequelize;

  static async getInstance(): Promise<Sequelize> {
    if (!this.instance) {
      this.instance = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
    }
    return this.instance;
  }
} 