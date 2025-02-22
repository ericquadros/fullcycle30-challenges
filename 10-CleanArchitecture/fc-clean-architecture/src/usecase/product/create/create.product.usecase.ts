import Product from "../../../domain/product/entity/product";
import { ProductRepositoryInterface } from "../../../domain/repository/product-repository.interface";

export class CreateProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: CreateProductInputDto): Promise<CreateProductOutputDto> {
    const product = new Product(input.id, input.name, input.price);
    await this.productRepository.create(product);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}

export interface CreateProductInputDto {
  id: string;
  name: string;
  price: number;
}

export interface CreateProductOutputDto {
  id: string;
  name: string;
  price: number;
} 