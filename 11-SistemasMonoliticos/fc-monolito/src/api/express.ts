import express, { Express, Request, Response } from "express";
import ProductFacadeFactory from "../modules/product-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../modules/invoice/factory/invoice.factory";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import { CheckoutFacadeFactory } from "../modules/checkout/factory/checkout.factory";
import StoreCatalogFacadeFactory from "../modules/store-catalog/factory/facade.factory";
import { Sequelize } from "sequelize-typescript";
import { ProductAdmSequelizeFactory } from "../modules/product-adm/repository/sequelize.factory";
import { StoreCatalogSequelizeFactory } from "../modules/store-catalog/repository/sequelize.factory";
import { ClientAdmSequelizeFactory } from "../modules/client-adm/repository/sequelize.factory";
import { InvoiceSequelizeFactory } from "../modules/invoice/repository/sequelize.factory";
import { CheckoutSequelizeFactory } from "../modules/checkout/repository/sequelize.factory";
import { PaymentSequelizeFactory } from "../modules/payment/repository/sequelize.factory";
import { SharedSequelizeFactory } from "../modules/@shared/database/sequelize.factory";

export const setupApp = async (): Promise<{ app: Express; sequelize: Sequelize }> => {
  const app = express();
  app.use(express.json());

  try {
    console.log('Initializing database connections...');
    
    // Inicialize todas as factories dos módulos
    // Aqui a ideia foi de criar uma instancia de sequelize para cada módulo
    // Para evitar problemas de utilização com o mesmo banco de dados e facilitar o desacoplamento
    await Promise.all([
      ProductAdmSequelizeFactory.getInstance(),
      StoreCatalogSequelizeFactory.getInstance(),
      ClientAdmSequelizeFactory.getInstance(),
      InvoiceSequelizeFactory.getInstance(),
      CheckoutSequelizeFactory.getInstance(),
      PaymentSequelizeFactory.getInstance(),
    ]);

    console.log('All database connections established');

    // Setup routes
    await setupRoutes(app);

    // Retorne a instância compartilhada do Sequelize
    const sequelize = await SharedSequelizeFactory.getInstance();
    return { app, sequelize };
    
  } catch (error) {
    console.error('Error during setup:', error);
    throw error;
  }
};

async function setupRoutes(app: Express) {
  // Product endpoints
  app.post("/products", async (req: Request, res: Response) => {
    try {
      const productFacade = await ProductAdmFacadeFactory.create();
      const output = await productFacade.addProduct(req.body);
      res.status(201).json(output);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/products", async (req: Request, res: Response) => {
    try {
      const storeCatalogFacade = await StoreCatalogFacadeFactory.create();
      const output = await storeCatalogFacade.findAll();
      res.status(200).json(output);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.get("/products/:id", async (req: Request, res: Response) => {
    try {
      const storeCatalogFacade = await StoreCatalogFacadeFactory.create();
      const output = await storeCatalogFacade.find({ id: req.params.id });
      res.status(200).json(output);
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(404).json({ error: (err as Error).message });
    }
  });

  // Client endpoint
  app.post("/clients", async (req: Request, res: Response) => {
    try {
      const clientFacade = await ClientAdmFacadeFactory.create();
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
      const checkoutFacade = await CheckoutFacadeFactory.create();
      const output = await checkoutFacade.placeOrder(req.body);
      res.status(201).json(output);
    } catch (err) {
      console.error("Error when creating an order:", err);
      if ((err as Error).message.includes("Client not found") || 
          (err as Error).message.includes("Product not found")) {
        res.status(404).json({ error: (err as Error).message });
      } else if ((err as Error).message.includes("All address fields are required")) {
        res.status(400).json({ error: (err as Error).message });
      } else {
        res.status(500).json({ error: (err as Error).message });
      }
    }
  });

  // Invoice endpoint
  app.get("/invoice/:id", async (req: Request, res: Response) => {
    try {
      const invoiceFacade = await InvoiceFacadeFactory.create();
      const output = await invoiceFacade.find({ id: req.params.id });
      res.status(200).json(output);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  });
} 
