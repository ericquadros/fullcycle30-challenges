import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../factory/facade.factory";
import ProductModel from "../repository/product.model";

describe("StoreCatalogFacade test", () => {
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

  it("should find a product", async () => {
    const facade = await StoreCatalogFacadeFactory.create();
    
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    });

    const result = await facade.find({ id: "1" });

    expect(result.id).toBe("1");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Description 1");
    expect(result.purchasePrice).toBe(100);
  });

  it("should find all products", async () => {
    const facade = await StoreCatalogFacadeFactory.create();
    
    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 100,
      stock: 10,
    });
    
    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description 2",
      purchasePrice: 200,
      stock: 20,
    });

    const result = await facade.findAll();

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("1");
    expect(result.products[0].name).toBe("Product 1");
    expect(result.products[0].description).toBe("Description 1");
    expect(result.products[0].purchasePrice).toBe(100);
    expect(result.products[1].id).toBe("2");
    expect(result.products[1].name).toBe("Product 2");
    expect(result.products[1].description).toBe("Description 2");
    expect(result.products[1].purchasePrice).toBe(200);
  });
});
