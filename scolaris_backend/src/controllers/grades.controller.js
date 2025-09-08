import { Grade, Student, Subject, Classe, StudentAverage, ClassSubjectCoefficient } from "../models/index.model.js";

export const getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.findAll({
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: Subject, attributes: ['name', 'coefficient'] },
                { model: Classe, attributes: ['name'] }
            ]
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGradesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { period } = req.query;
        
        const whereClause = { studentId };
        if (period) whereClause.period = period;
        
        const grades = await Grade.findAll({
            where: whereClause,
            include: [
                { model: Subject, attributes: ['name', 'coefficient'] },
                { model: Classe, attributes: ['name'] }
            ]
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGradesByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { subjectId, period } = req.query;
        
        const whereClause = { classId };
        if (subjectId) whereClause.subjectId = subjectId;
        if (period) whereClause.period = period;
        
        const grades = await Grade.findAll({
            where: whereClause,
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: Subject, attributes: ['name', 'coefficient'] }
            ]
        });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createGrade = async (req, res) => {
    try {
        const { studentId, subjectId, classId, period, grade, type, index } = req.body;
        
        const newGrade = await Grade.create({
            studentId,
            subjectId,
            classId,
            period,
            grade,
            maxGrade: 20,
            date: new Date().toISOString().split('T')[0],
            type,
            index
        });
        
        const gradeWithRelations = await Grade.findByPk(newGrade.id, {
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: Subject, attributes: ['name', 'coefficient'] },
                { model: Classe, attributes: ['name'] }
            ]
        });
        
        res.status(201).json(gradeWithRelations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const { grade, type, period } = req.body;
        
        const gradeRecord = await Grade.findByPk(id);
        if (!gradeRecord) return res.status(404).json({ error: "Note non trouvée" });
        
        await gradeRecord.update({ grade, type, period });
        
        const updatedGrade = await Grade.findByPk(id, {
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: Subject, attributes: ['name', 'coefficient'] },
                { model: Classe, attributes: ['name'] }
            ]
        });
        
        res.json(updatedGrade);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        const grade = await Grade.findByPk(id);
        if (!grade) return res.status(404).json({ error: "Note non trouvée" });
        
        await grade.destroy();
        res.json({ message: "Note supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBulletinData = async (req, res) => {
    try {
        const { studentId, period } = req.params;
        
        // Récupérer l'étudiant et sa classe
        const student = await Student.findByPk(studentId, {
            include: [{ model: Classe }]
        });
        
        if (!student) {
            return res.status(404).json({ error: "Étudiant non trouvé" });
        }
        
        const grades = await Grade.findAll({
            where: { studentId, period },
            include: [
                { model: Subject, attributes: ['name', 'category'] },
                { model: Classe }
            ]
        });
        
        if (grades.length === 0) {
            return res.json([]);
        }
        
        // Récupérer les coefficients pour cette classe
        let coefficientsMap = {};
        try {
            const classSubjectCoeffs = await ClassSubjectCoefficient.findAll({
                where: { classId: student.classId },
                include: [{ model: Subject }]
            });
            
            classSubjectCoeffs.forEach(csc => {
                coefficientsMap[csc.subjectId] = csc.coefficient;
            });
        } catch (error) {
            console.log('Coefficients non configurés, utilisation de coefficient 1 par défaut');
        }
        
        // Grouper par matière et calculer les moyennes
        const subjectGrades = {};
        grades.forEach(grade => {
            const subjectId = grade.subjectId;
            if (!subjectGrades[subjectId]) {
                subjectGrades[subjectId] = {
                    subject: grade.Subject,
                    coefficient: coefficientsMap[subjectId] || 1,
                    interros: [],
                    devoirs: []
                };
            }
            
            if (grade.type === 'Interro') {
                subjectGrades[subjectId].interros.push(parseFloat(grade.grade));
            } else if (grade.type === 'Devoir') {
                subjectGrades[subjectId].devoirs.push(parseFloat(grade.grade));
            }
        });
        
        // Calculer les moyennes
        const bulletinData = Object.values(subjectGrades).map(subject => {
            const interroAvg = subject.interros.length > 0 
                ? subject.interros.reduce((a, b) => a + b, 0) / subject.interros.length 
                : null;
            
            let subjectAvg = null;
            if (interroAvg !== null && subject.devoirs.length >= 2) {
                const devoirAvg = subject.devoirs.reduce((a, b) => a + b, 0) / subject.devoirs.length;
                subjectAvg = (interroAvg + devoirAvg) / 2;
            } else if (interroAvg !== null && subject.devoirs.length === 1) {
                subjectAvg = (interroAvg + subject.devoirs[0]) / 2;
            } else if (interroAvg !== null) {
                subjectAvg = interroAvg;
            } else if (subject.devoirs.length > 0) {
                subjectAvg = subject.devoirs.reduce((a, b) => a + b, 0) / subject.devoirs.length;
            }
            
            return {
                subjectName: subject.subject.name,
                coefficient: subject.coefficient,
                category: subject.subject.category || 'Général',
                interros: subject.interros,
                devoirs: subject.devoirs,
                interroAvg: interroAvg ? parseFloat(interroAvg.toFixed(2)) : null,
                subjectAvg: subjectAvg ? parseFloat(subjectAvg.toFixed(2)) : null
            };
        });
        
        // Calculer la moyenne générale
        let totalPoints = 0;
        let totalCoefficients = 0;
        
        bulletinData.forEach(subject => {
            if (subject.subjectAvg !== null) {
                totalPoints += subject.subjectAvg * subject.coefficient;
                totalCoefficients += subject.coefficient;
            }
        });
        
        const generalAverage = totalCoefficients > 0 ? parseFloat((totalPoints / totalCoefficients).toFixed(2)) : 0;
        
        // Sauvegarder la moyenne dans StudentAverages
        try {
            await StudentAverage.upsert({
                studentId: parseInt(studentId),
                period,
                generalAverage,
                totalPoints,
                totalCoefficients
            });
        } catch (error) {
            console.log('Erreur sauvegarde moyenne:', error.message);
        }
        
        res.json(bulletinData);
    } catch (error) {
        console.error('Erreur getBulletinData:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getStudentAverages = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const averages = await StudentAverage.findAll({
            where: { studentId },
            order: [['period', 'ASC']]
        });
        
        res.json(averages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};