import express, { Express, Request, Response } from "express";
import ProductFacadeFactory from "../modules/product-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../modules/invoice/factory/invoice.factory";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import { CheckoutFacadeFactory } from "../modules/checkout/factory/checkout.factory";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { OrderModel } from "../modules/checkout/repository/order.model";
import OrderItemModel from "../modules/checkout/repository/order-item.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";

export const setupApp = async (): Promise<{ app: Express; sequelize: Sequelize }> => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
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

  const app = express();
  app.use(express.json());

  // Product endpoint
  app.post("/products", async (req: Request, res: Response) => {
    try {
      const productFacade = ProductFacadeFactory.create();
      const output = await productFacade.addProduct(req.body);
      res.status(201).json(output);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Client endpoint
  app.post("/clients", async (req: Request, res: Response) => {
    try {
      const clientFacade = ClientAdmFacadeFactory.create();
      const output = await clientFacade.add(req.body);
      res.status(201).json(output);
    } catch (err) {
      console.error("Error creating client:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Checkout endpoint
  app.post("/checkout", async (req: Request, res: Response) => {
    try {
      const checkoutFacade = CheckoutFacadeFactory.create();
      const output = await checkoutFacade.placeOrder(req.body);
      res.status(201).json(output);
    } catch (err) {
      console.error("Error when creating an order:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Invoice endpoint
  app.get("/invoice/:id", async (req: Request, res: Response) => {
    try {
      const invoiceFacade = InvoiceFacadeFactory.create();
      const output = await invoiceFacade.find({ id: req.params.id });
      res.status(200).json(output);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });

  return { app, sequelize };
}; 