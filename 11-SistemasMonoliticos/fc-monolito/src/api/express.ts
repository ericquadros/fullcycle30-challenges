import express, { Express, Request, Response } from "express";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../modules/invoice/factory/invoice.factory";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import { CheckoutFacadeFactory } from "../modules/checkout/factory/checkout.factory";

export const app: Express = express();

app.use(express.json());

// Product endpoint
app.post("/products", async (req: Request, res: Response) => {
  try {
    const productFacade = ProductAdmFacadeFactory.create();
    const output = await productFacade.addProduct(req.body);
    res.status(201).json(output);
  } catch (err) {
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