import { Request, Response } from 'express';
import Balance from '../models/Balance';

interface IBalance {
  account_id: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class BalanceController {
  async getBalance(req: Request, res: Response): Promise<Response> {
    try {
      const { account_id } = req.params;
      const balance = await Balance.findOne({ 
        where: { account_id } 
      });
      
      if (!balance) {
        return res.status(404).json({ error: 'Balance not found' });
      }

      return res.json(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  }

  async listBalances(req: Request, res: Response): Promise<Response> {
    try {
      const balances = await Balance.findAll({
        order: [['account_id', 'ASC']]
      });
      
      return res.json(balances);
    } catch (error) {
      console.error('Error listing balances:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  }

  async updateBalance(accountId: string, amount: number): Promise<IBalance> {
    try {
      const [balance] = await Balance.upsert({
        account_id: accountId,
        amount: amount
      });
      
      return balance;
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }
}

export default new BalanceController(); 