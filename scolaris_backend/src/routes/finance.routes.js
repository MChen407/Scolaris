import express from 'express';
import { 
    getAllPayments, 
    createPayment, 
    updatePayment, 
    getPaymentById,
    deletePayment,
    getPaymentHistory,
    getFinanceStats,
    getAllFeeTypes,
    createFeeType
} from '../controllers/finance.controller.js';

const router = express.Router();

router.get('/payments', getAllPayments);
router.post('/payments', createPayment);
router.get('/payments/history/:studentId', getPaymentHistory);
router.get('/payments/:id', getPaymentById);
router.put('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);
router.get('/stats', getFinanceStats);
router.get('/fee-types', getAllFeeTypes);
router.post('/fee-types', createFeeType);

export default router;