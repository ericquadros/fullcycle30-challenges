import express, { Express } from 'express';
import { customerRoutes } from './routes/customer.routes';
import initializeApp from '../config/initialize-app';

export class App {
  private app: Express;

  constructor() {
    // Criar aplicação Express
    this.app = express();
    
    // Inicializar configurações da aplicação (incluindo event handlers)
    initializeApp();
    
    // Configurar middleware
    this.middleware();
    
    // Configurar rotas
    this.routes();
  }

  private middleware(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use('/customers', customerRoutes);
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  public getApp(): Express {
    return this.app;
  }
} 