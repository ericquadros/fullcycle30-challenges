import { CreateProductUseCase } from "./create.product.usecase";

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
  };
};

describe("Create product use case unit test", () => {
  it("should create a product", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Product 1",
      price: 100,
    };

    const output = await createProductUseCase.execute(input);

    expect(output).toEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });
  });

  it("should throw error when name is missing", async () => {
    const productRepository = MockRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "",
      price: 100,
    };

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });
}); 