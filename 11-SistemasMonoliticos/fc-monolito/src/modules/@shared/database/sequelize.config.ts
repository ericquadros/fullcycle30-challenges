import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { InvoiceModel } from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";

export const setupSequelize = (options: SequelizeOptions | Sequelize = {}) => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = options instanceof Sequelize ? options : new Sequelize({
      ...options,
      dialect: options.dialect || "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  return {
    get sequelize() {
      return sequelize;
    },
  };
};

export const createSequelize = async () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });

  return setupSequelize(sequelize);
}; 