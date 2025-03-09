import { Router } from 'express'; 
import balanceController from '../controllers/BalanceController';

const router = Router();

// List all balances
router.get('/balances', balanceController.listBalances);

// Get balance for specific account
router.get('/balances/:account_id', balanceController.getBalance);

export default router; 