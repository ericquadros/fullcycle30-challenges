import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../product/repository/sequelize/product.model";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import { app, sequelize } from "../express";

describe("E2E Test for Product Listing", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });


  it("should list all products", async () => {
    // const productRepository = new ProductRepository();
    // const product1 = new Product("123", "Product 1", 100);
    // const product2 = new Product("456", "Product 2", 200);
    // await productRepository.create(product1);
    // await productRepository.create(product2);

    // const products = await productRepository.findAll();
    // console.log(products);

    const response = await request(app).get("/products").send();

    expect(response.status).toBe(200);


    // expect(response.body).toEqual([
    //   { id: "123", name: "Product 1", price: 100 },
    //   { id: "456", name: "Product 2", price: 200 },
    // ]);
  });
}); 