import express from 'express';
import {
    getSnapToken,
    handleMidtransWebhook,
    getAllTransactions,
    updateTransactionStatus
} from '../controllers/paymentController.js';

const router = express.Router();
router.post('/snap-token', getSnapToken);
router.post('/midtrans-webhook', handleMidtransWebhook);
router.get('/transactions', getAllTransactions);
router.post('/update-transaction-status/:order_id', updateTransactionStatus);

export default router;
