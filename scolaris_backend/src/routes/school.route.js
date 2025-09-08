import express from 'express';
import { getSchoolInfo, updateSchoolInfo } from '../controllers/school.controller.js';

const router = express.Router();

router.get('/', getSchoolInfo);
router.put('/', updateSchoolInfo);

export default router;