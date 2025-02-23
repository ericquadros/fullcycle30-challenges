import express, { Express, Request, Response } from "express";
import ProductFacadeFactory from "../modules/product-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../modules/invoice/factory/invoice.factory";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import { CheckoutFacadeFactory } from "../modules/checkout/factory/checkout.factory";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { ProductModel as ProductAdmModel } from "../modules/product-adm/repository/product.model";
import ProductCatalogModel from "../modules/store-catalog/repository/product.model";


import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { OrderModel } from "../modules/checkout/repository/order.model";
import OrderItemModel from "../modules/checkout/repository/order-item.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";

export const setupApp = async (): Promise<{ app: Express; sequelize: Sequelize }> => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: true, // Ativo temporariamente
  });

  await sequelize.authenticate();
  console.log('Database connected');

  sequelize.addModels([
    ProductModel,
    // ProductCatalogModel,
    ClientModel,
    InvoiceModel,
    InvoiceItemModel,
    OrderModel,
    OrderItemModel,
  ]);
  await sequelize.sync();
  console.log('Database synced');

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

//   app.post("/checkout", async (req: Request, res: Response) => {
//     try {
//         console.log('Dados recebidos no checkout:', req.body);

//         // Validação básica
//         if (!req.body.clientId) {
//           return res.status(400).json({ error: "ClientId is required" });
//         }
//         if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
//           return res.status(400).json({ error: "Products array is required and cannot be empty" });
//         }
        
//         const checkoutFacade = CheckoutFacadeFactory.create();
//         const output = await checkoutFacade.placeOrder(req.body);
//         console.log('Resultado do checkout:', output);

//         res.status(201).json(output);
//     } catch (err) {
//         console.error("Erro detalhado no checkout:", {
//             message: (err as Error).message,
//             stack: (err as Error).stack,
//             data: req.body
//         });
//         res.status(500).json({ 
//             error: (err as Error).message,
//             stack: (err as Error).stack 
//         });
//     }
// });

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