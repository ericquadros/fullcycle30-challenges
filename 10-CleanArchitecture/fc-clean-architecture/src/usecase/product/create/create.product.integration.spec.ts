import { Sequelize } from "sequelize-typescript";

import { CreateProductUseCase } from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

describe("Create product use case integration test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Product 1",
      price: 100,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });

    const productModel = await ProductModel.findOne({ where: { id: "123" } });
    expect(productModel.toJSON()).toStrictEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });
  });
}); 