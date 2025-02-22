import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import Product from "../../../domain/product/entity/product";
import { InputUpdateProductDTO } from "./update.product.dto";

export default class UpdateProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputUpdateProductDTO): Promise<void> {
    const product = new Product(input.id, input.name, input.price);
    await this.productRepository.update(product);
  }
} 