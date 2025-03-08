import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import { StoreCatalogSequelizeFactory } from "../repository/sequelize.factory";

export default class StoreCatalogFacadeFactory {
  static async create() {
    const sequelize = await StoreCatalogSequelizeFactory.getInstance();
    const productRepository = new ProductRepository();
    const findUseCase = new FindProductUseCase(productRepository);
    const findAllUseCase = new FindAllProductsUseCase(productRepository);

    const facade = new StoreCatalogFacade({
      findUseCase: findUseCase,
      findAllUseCase: findAllUseCase,
    });

    return facade;
  }
}
