import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { OutputListProductDTO } from "./list.product.dto";

export default class ListProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<OutputListProductDTO> {
    const products = await this.productRepository.findAll();
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    };
  }
} 