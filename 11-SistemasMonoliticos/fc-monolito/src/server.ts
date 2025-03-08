import { setupApp } from "./api/express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./modules/product-adm/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";
import { InvoiceModel } from "./modules/invoice/repository/invoice.model";
import { OrderModel } from "./modules/checkout/repository/order.model";
import OrderItemModel from "./modules/checkout/repository/order-item.model";
import InvoiceItemModel from "./modules/invoice/repository/invoice-item.model";

const port = 3000;

async function bootstrap() {
  try {
    const { app } = await setupApp();
    
    app.listen(port, () => {
      console.log(`Server rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Failed to setup application:", error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});