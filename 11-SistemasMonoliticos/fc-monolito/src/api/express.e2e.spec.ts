import request from "supertest";
import { setupApp } from "./express";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { OrderModel } from "../modules/checkout/repository/order.model";
import OrderItemModel from "../modules/checkout/repository/order-item.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";

describe("E2E API Tests", () => {
  let app: Express;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const setup = await setupApp();
    app = setup.app;
    sequelize = setup.sequelize;
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
      });

    if (response.status !== 201) {
      console.error("Response error:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Product 1");
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "Client 1",
        email: "client@example.com",
        document: "123456789",
        street: "Street 1",
        number: "123",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "12345-678",
      });

    if (response.status !== 201) {
      console.error("Response error:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should create an order", async () => {
    // Primeiro cria um produto
    const productResponse = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
      });

    console.log('productResponse.status: ', productResponse.status);

    // Depois cria um cliente
    const clientResponse = await request(app)
      .post("/clients")
      .send({
        name: "Client 1",
        email: "client@example.com",
        document: "123456789",
        street: "Street 1",
        number: "123",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "12345-678",
      });

    console.log('clientResponse.status: ', clientResponse.status);

    // Finalmente cria o pedido
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: clientResponse.body.id,
        products: [
          {
            productId: productResponse.body.id,
            quantity: 1,
          },
        ],
      });
    
    if (response.status !== 201) {
      console.error("Response error:", response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("invoiceId");
    expect(response.body.status).toBe("approved");
  });
}); 