import { app } from "./api/express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./modules/product-adm/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";
import { InvoiceModel } from "./modules/invoice/repository/invoice.model";
import { OrderModel } from "./modules/checkout/repository/order.model";
import OrderItemModel from "./modules/checkout/repository/order-item.model";
import InvoiceItemModel from "./modules/invoice/repository/invoice-item.model";

const port = 3000;

async function bootstrap() {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });

  sequelize.addModels([
    ProductModel,
    ClientModel,
    InvoiceModel,
    InvoiceItemModel,
    OrderModel,
    OrderItemModel,
  ]);
  await sequelize.sync();

  app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});