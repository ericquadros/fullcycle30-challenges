import { Router } from 'express'; 
import balanceController from '../controllers/BalanceController';

const router = Router();

router.get('/balances/:account_id', balanceController.getBalance);

export default router; 