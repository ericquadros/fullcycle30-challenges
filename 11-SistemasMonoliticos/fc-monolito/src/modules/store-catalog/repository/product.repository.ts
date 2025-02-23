import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import StoreCatalogProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await StoreCatalogProductModel.findAll();

    return products.map(
      (product) =>
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          purchasePrice: product.purchasePrice,
        })
    );
  }

  async find(id: string): Promise<Product> {
    try {
      console.log('StoreCatalog - Searching for product with id:', id);
      
      const product = await StoreCatalogProductModel.findOne({
        where: { id },
      });

      if (!product) {
        console.log('StoreCatalog - Product not found');
        throw new Error(`Product with id ${id} not found`);
      }

      console.log('StoreCatalog - Product found:', product.toJSON());

      return new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
      });
    } catch (error) {
      console.error('StoreCatalog - Error finding product:', error);
      throw error;
    }
  }
}
