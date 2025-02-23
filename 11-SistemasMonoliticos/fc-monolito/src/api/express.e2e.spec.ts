import request from "supertest";
import { app } from "./express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { OrderModel } from "../modules/checkout/repository/order.model";
import OrderItemModel from "../modules/checkout/repository/order-item.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";

describe("E2E API Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
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

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("invoiceId");
    expect(response.body.status).toBe("approved");
  });
}); 