import express from 'express';
import {
    getAllGrades,
    getGradesByStudent,
    getGradesByClass,
    createGrade,
    updateGrade,
    deleteGrade,
    getBulletinData,
    getStudentAverages
} from '../controllers/grades.controller.js';

const router = express.Router();

router.get('/', getAllGrades);
router.get('/student/:studentId', getGradesByStudent);
router.get('/class/:classId', getGradesByClass);
router.get('/bulletin/:studentId/:period', getBulletinData);
router.get('/averages/:studentId', getStudentAverages);
router.post('/', createGrade);
router.put('/:id', updateGrade);
router.delete('/:id', deleteGrade);

export default router;