import { Sequelize } from "sequelize-typescript";

export class SharedSequelizeFactory {
  private static instance: Sequelize;

  static async getInstance(): Promise<Sequelize> {
    if (!this.instance) {
      await this.createInstance();
    }
    return this.instance;
  }

  static async createInstance(): Promise<Sequelize> {
    this.instance = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    return this.instance;
  }

  static async resetInstance(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
    }
  }
} 