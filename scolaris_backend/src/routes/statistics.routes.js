import express from 'express';
import { 
    getGeneralStats,
    getStudentsByClass,
    getAveragesBySubject,
    getClassPerformance,
    getTop3StudentsByClass
} from '../controllers/statistics.controller.js';

const router = express.Router();

router.get('/general', getGeneralStats);
router.get('/students-by-class', getStudentsByClass);
router.get('/averages-by-subject', getAveragesBySubject);
router.get('/class-performance', getClassPerformance);
router.get('/top3-by-class', getTop3StudentsByClass);

export default router;