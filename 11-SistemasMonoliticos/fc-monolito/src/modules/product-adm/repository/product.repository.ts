import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { ProductModel } from "./product.model";
import { ProductAdmSequelizeFactory } from "./sequelize.factory";

export default class ProductRepository implements ProductGateway {
  private async getModel(): Promise<typeof ProductModel> {
    const sequelize = await ProductAdmSequelizeFactory.getInstance();
    return ProductModel;
  }

  async add(product: Product): Promise<void> {
    const ProductModel = await this.getModel();
    try {
      console.log('ProductAdm - Creating product with data:', {
        id: product.id.id,
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        stock: product.stock,
      });

      await ProductModel.create({
        id: product.id.id,
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        stock: product.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('ProductAdm - Product created successfully with id:', product.id.id);
    } catch (error) {
      console.error('ProductAdm - Error creating product:', error);
      throw error;
    }
  }

  async find(id: string): Promise<Product> {
    const ProductModel = await this.getModel();
    const product = await ProductModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }
}
