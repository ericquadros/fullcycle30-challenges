import express, { Express } from 'express';
import balanceRoutes from './routes/balance';
import sequelize from './config/sequelize';
import kafkaConsumer from './services/KafkaConsumer';

const app: Express = express();
const port: number = Number(process.env.PORT) || 3003;

app.use(express.json());
app.use(balanceRoutes);

// App respond shutdown correctly
const shutdown = async (): Promise<void> => {
  try {
    await kafkaConsumer.shutdown();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Initialize database and start server
const initialize = async (): Promise<void> => {
  try {
    // Sync database
    await sequelize.sync();
    console.log('✅ Database synced successfully');

    // Start Kafka consumer with retry mechanism
    const startKafkaConsumer = async () => {
      try {
        await kafkaConsumer.start();
        console.log('✅ Kafka consumer started');
      } catch (error) {
        console.error('Failed to start Kafka consumer:', error);
        // Retry after 5 seconds
        setTimeout(startKafkaConsumer, 5000);
      }
    };
    await startKafkaConsumer();

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Balance service listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
};

// Start the application
initialize();
