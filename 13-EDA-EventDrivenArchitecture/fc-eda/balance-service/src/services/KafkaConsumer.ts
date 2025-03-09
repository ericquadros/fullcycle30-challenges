import { Kafka, Consumer, KafkaMessage } from 'kafkajs';
import BalanceController from '../controllers/BalanceController';

interface TransactionCreatedEvent {
  Name: string;
  Payload: {
    id: string;
    account_id_from: string;
    account_id_to: string;
    amount: number;
  };
}

interface BalanceUpdatedEvent {
  Name: string;
  Payload: {
    account_id_from: string;
    account_id_to: string;
    balance_account_id_from: number;
    balance_account_id_to: number;
  };
}

export class KafkaConsumerService {
  private consumer: Consumer;
  private balanceController: typeof BalanceController;

  constructor(brokers: string[] = [process.env.KAFKA_BROKERS || 'kafka:29092']) {
    const kafka = new Kafka({
      clientId: 'balance-service',
      brokers
    });

    this.consumer = kafka.consumer({ groupId: 'balance-group' });
    this.balanceController = BalanceController;
  }

  private async handleTransactionCreated(event: TransactionCreatedEvent): Promise<void> {
    console.log('📥 Received TransactionCreated event:', event);
    try {
      // Log transaction details
      console.log(`💰 Transaction ${event.Payload.id}:`);
      console.log(`   From: ${event.Payload.account_id_from}`);
      console.log(`   To: ${event.Payload.account_id_to}`);
      console.log(`   Amount: ${event.Payload.amount}`);
      
      // We might want to store transaction history in the future
    } catch (error) {
      console.error('❌ Error processing TransactionCreated event:', error);
    }
  }

  private async handleBalanceUpdated(event: BalanceUpdatedEvent): Promise<void> {
    console.log('📥 Received BalanceUpdated event:', event);
    try {
      // Update balance for account_from
      await this.balanceController.handleBalanceUpdated(
        event.Payload.account_id_from,
        event.Payload.balance_account_id_from
      );

      // Update balance for account_to
      await this.balanceController.handleBalanceUpdated(
        event.Payload.account_id_to,
        event.Payload.balance_account_id_to
      );
    } catch (error) {
      console.error('❌ Error processing BalanceUpdated event:', error);
    }
  }

  private async processMessage(topic: string, message: KafkaMessage): Promise<void> {
    try {
      const eventData = JSON.parse(message.value?.toString() || '');
      console.log(`📬 Processing message from topic: ${topic}`);

      switch (topic) {
        case 'transactions':
          await this.handleTransactionCreated(eventData as TransactionCreatedEvent);
          break;
        case 'balances':
          await this.handleBalanceUpdated(eventData as BalanceUpdatedEvent);
          break;
        default:
          console.warn(`⚠️ Unhandled topic: ${topic}`);
      }
    } catch (error) {
      console.error(`❌ Error processing message from ${topic}:`, error);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('✅ Connected to Kafka');
      
      await this.consumer.subscribe({ topics: ['transactions', 'balances'], fromBeginning: true });
      console.log('✅ Subscribed to topics: transactions, balances');

      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          await this.processMessage(topic, message);
        },
      });
    } catch (error) {
      console.error('❌ Error in Kafka consumer:', error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log('✅ Disconnected from Kafka');
    } catch (error) {
      console.error('❌ Error disconnecting from Kafka:', error);
      throw error;
    }
  }
}

export default new KafkaConsumerService();
