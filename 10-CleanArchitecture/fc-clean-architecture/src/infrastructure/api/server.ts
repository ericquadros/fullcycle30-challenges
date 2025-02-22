import { app } from "./express"; // Certifique-se de que o app está exportando corretamente
import dotenv from "dotenv";
import productRoute from "./routes/product.route";
import sequelize from "../../database/sequelize";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

// Usando as rotas de produtos
// app.use("/", productRoute); // Isso significa que as rotas de produtos estarão acessíveis em /api/products

// // Sincronizando o banco de dados
// sequelize.sync()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is listening on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database:", error);
//   });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
}); 