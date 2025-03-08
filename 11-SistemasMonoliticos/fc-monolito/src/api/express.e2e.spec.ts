import request from "supertest";
import { setupApp } from "./express";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from '../modules/product-adm/repository/product.model';
import { ClientModel } from '../modules/client-adm/repository/client.model';
import { InvoiceModel } from '../modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../modules/invoice/repository/invoice-item.model';
import { OrderModel } from '../modules/checkout/repository/order.model';
import OrderItemModel from '../modules/checkout/repository/order-item.model';
import TransactionModel from '../modules/payment/repository/transaction.model';

describe("E2E API Tests", () => {
  let app: Express;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const setup = await setupApp();
    app = setup.app;
    sequelize = setup.sequelize;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
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

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should create an order", async () => {
    // Criar um cliente primeiro
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
        zipCode: "12345-678"
      });

    expect(clientResponse.status).toBe(201);
    const clientId = clientResponse.body.id;

    // Criar um produto
    const productResponse = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10
      });

    expect(productResponse.status).toBe(201);
    const productId = productResponse.body.id;

    // Criar o pedido
    const orderResponse = await request(app)
      .post("/checkout")
      .send({
        clientId: clientId,
        products: [
          {
            productId: productId,
            quantity: 1
          }
        ]
      });

    expect(orderResponse.status).toBe(201);
    expect(orderResponse.body).toHaveProperty("id");
    expect(orderResponse.body).toHaveProperty("invoiceId");
    expect(orderResponse.body.status).toBe("approved");
    expect(orderResponse.body.total).toBe(100);
    expect(orderResponse.body.products).toHaveLength(1);
    expect(orderResponse.body.products[0].productId).toBe(productId);
    expect(orderResponse.body.products[0].quantity).toBe(1);
  });
}); 