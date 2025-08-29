import express from 'express';
import { 
    getClassSubjectCoefficients, 
    updateClassSubjectCoefficient, 
    deleteClassSubjectCoefficient,
    getSubjectsWithCoefficients
} from '../controllers/classSubjectCoefficient.controller.js';

const router = express.Router();

router.get('/class/:classId', getClassSubjectCoefficients);
router.get('/subjects/class/:classId', getSubjectsWithCoefficients);
router.post('/', updateClassSubjectCoefficient);
router.delete('/class/:classId/subject/:subjectId', deleteClassSubjectCoefficient);

export default router;