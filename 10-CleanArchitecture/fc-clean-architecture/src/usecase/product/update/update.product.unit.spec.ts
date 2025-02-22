import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const MockRepository = () => {
  return {
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  };
};

describe("Unit Test update product use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Updated Product",
      price: 150,
    };

    await usecase.execute(input);

    expect(productRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
        name: "Updated Product",
        price: 150,
      })
    );
  });
}); 