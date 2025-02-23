import { setupApp } from "./api/express";

const port = 3000;

async function startServer() {
  try {
    const app = await setupApp();
    
    app.listen(port, () => {
      console.log(`Server rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
    process.exit(1);
  }
}

startServer();