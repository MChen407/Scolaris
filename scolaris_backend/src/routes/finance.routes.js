import express from 'express';
import { 
    getAllPayments, 
    createPayment, 
    updatePayment, 
    getPaymentById,
    deletePayment,
    getPaymentHistory,
    getFinanceStats,
    createTeacherPayment,
    getTeacherPayments,
    getTeacherPaymentHistory,
    getTeacherStats,
    getFeeTypes
} from '../controllers/finance.controller.js';

const router = express.Router();

router.get('/payments', getAllPayments);
router.post('/payments', createPayment);
router.get('/payments/history/:studentId', getPaymentHistory);
router.get('/payments/:id', getPaymentById);
router.put('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);
router.get('/stats', getFinanceStats);
router.get('/fee-types', getFeeTypes);
// router.post('/fee-types', createFeeType);
router.post('/teacher-payments', createTeacherPayment);
router.get('/teacher-payments', getTeacherPayments);
router.get('/teacher-payments/history/:teacherId', getTeacherPaymentHistory);
router.get('/teacher-stats', getTeacherStats);

export default router;