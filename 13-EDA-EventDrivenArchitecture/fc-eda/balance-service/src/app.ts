import express, { Express } from 'express';
import { Kafka, Consumer, KafkaMessage } from 'kafkajs';
import balanceRoutes from './routes/balance';
import balanceController from './controllers/BalanceController';
import sequelize from './config/database';

const app: Express = express();
const port: number = Number(process.env.PORT) || 3003;

app.use(express.json());
app.use(balanceRoutes);

interface TransactionEvent {
  account_id: string;
  new_amount: number;
}

// Kafka Consumer Setup
const kafka = new Kafka({
  clientId: 'balance-service',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:29092']
});

const consumer: Consumer = kafka.consumer({ groupId: 'balance-group' });

const runConsumer = async (): Promise<void> => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'wallet-transactions', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }: { message: KafkaMessage }): Promise<void> => {
        try {
          const data: TransactionEvent = JSON.parse(message.value?.toString() || '');
          await balanceController.updateBalance(data.account_id, data.new_amount);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

// Error handling for consumer
const handleConsumerError = async (): Promise<void> => {
  try {
    await runConsumer();
  } catch (error) {
    console.error('Failed to run consumer:', error);
    // Retry after 5 seconds
    setTimeout(handleConsumerError, 5000);
  }
};

// Graceful shutdown
const shutdown = async (): Promise<void> => {
  try {
    await consumer.disconnect();
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
    console.log('Database synced successfully');

    // Start Kafka consumer
    await handleConsumerError();

    // Start server
    app.listen(port, () => {
      console.log(`Balance service listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Start the application
initialize();
