import { app } from "./express"; // Certifique-se de que o app está exportando corretamente
import dotenv from "dotenv";
import productRoute from "./routes/product.route";
import sequelize from "../../database/sequelize";

dotenv.config();
const port: number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
}); 