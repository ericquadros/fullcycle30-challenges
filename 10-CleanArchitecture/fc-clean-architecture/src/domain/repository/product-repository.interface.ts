import Product from "../product/entity/product";

export interface ProductRepositoryInterface {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  find(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
} 