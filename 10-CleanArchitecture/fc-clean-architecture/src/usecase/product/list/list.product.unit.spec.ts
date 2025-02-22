import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("123", "Product 1", 100);
const product2 = new Product("456", "Product 2", 200);

const MockRepository = () => {
  return {
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit Test list product use case", () => {
  it("should list all products", async () => {
    const productRepository = MockRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute();

    expect(output.products).toEqual([
      { id: "123", name: "Product 1", price: 100 },
      { id: "456", name: "Product 2", price: 200 },
    ]);
  });
}); 