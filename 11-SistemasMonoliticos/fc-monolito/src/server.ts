import express, { Request, Response } from "express";
import FindAllProductsUsecase from "./modules/store-catalog/usecase/find-all-products/find-all-products.usecase";
import FindProductByIdUsecase from "./modules/store-catalog/usecase/find-product/find-product.usecase";
import ProductRepository from "./modules/store-catalog/repository/product.repository";

const app = express();
const port = 3000;

app.use(express.json());

// Instanciando o repository e os usecases
const productRepository = new ProductRepository();
const findAllProductsUsecase = new FindAllProductsUsecase(productRepository);
const findProductByIdUsecase = new FindProductByIdUsecase(productRepository);

// Rota para buscar todos os produtos
app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await findAllProductsUsecase.execute();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Rota para buscar produto por ID
app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await findProductByIdUsecase.execute({ id });
    
    if (!result) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
}); 