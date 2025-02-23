import request from "supertest";
import { setupApp } from "./express";
import { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductAdmSequelizeFactory } from "../modules/product-adm/repository/sequelize.factory";
import { StoreCatalogSequelizeFactory } from "../modules/store-catalog/repository/sequelize.factory";
import { ClientAdmSequelizeFactory } from "../modules/client-adm/repository/sequelize.factory";
import { InvoiceSequelizeFactory } from "../modules/invoice/repository/sequelize.factory";
import { CheckoutSequelizeFactory } from "../modules/checkout/repository/sequelize.factory";
import { PaymentSequelizeFactory } from "../modules/payment/repository/sequelize.factory";

describe("E2E API Tests", () => {
  let app: Express;
  let server: any;
  let sequelize: Sequelize;

  beforeAll(async () => {
    console.log('Setting up test environment...');
    const setup = await setupApp();
    app = setup.app;
    sequelize = setup.sequelize; // Guardando a referência da instância compartilhada
    server = app.listen(0);
    console.log('Test environment ready');
  });

  afterAll(async () => {
    console.log('Cleaning up test environment...');
    
    try {
      // Aguardar todas as operações pendentes terminarem
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fechar apenas a conexão compartilhada
      if (sequelize) {
        await sequelize.close();
        console.log('Database connection closed');
      }

      // Fechar o servidor
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('Server closed');
          resolve();
        });
      });
      
      console.log('Cleanup complete');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  it("should create a product", async () => {
    console.log('Starting create product test...');
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
    console.log('Create product test completed');
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
    console.log('\n=== Starting Create Order Test ===');
    
    // Criar o produto
    console.log('Creating product...');
    const productResponse = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
      });

    console.log('Product created:', productResponse.body);

    // Criar o cliente
    console.log('Creating client...');
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

    console.log('Client created:', clientResponse.body);

    // Criar o pedido
    const orderData = {
      clientId: clientResponse.body.id,
      products: [
        {
          productId: productResponse.body.id,
          quantity: 1,
          amount: 100,
        },
      ],
    };

    console.log('Creating order with data:', orderData);
    
    const response = await request(app)
      .post("/checkout")
      .send(orderData);
    
    console.log('Order creation response:', response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("invoiceId");
    expect(response.body.status).toBe("approved");
    
    console.log('=== Create Order Test Completed ===\n');
  });
}); 