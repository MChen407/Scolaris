import { ClassSubjectCoefficient, Classe, Subject } from "../models/index.model.js";

export const getClassSubjectCoefficients = async (req, res) => {
    try {
        const { classId } = req.params;
        const coefficients = await ClassSubjectCoefficient.findAll({
            where: { classId },
            include: [
                { model: Subject, attributes: ['id', 'name'] }
            ]
        });
        res.json(coefficients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateClassSubjectCoefficient = async (req, res) => {
    try {
        const { classId, subjectId, coefficient } = req.body;
        
        const [record, created] = await ClassSubjectCoefficient.upsert({
            classId,
            subjectId,
            coefficient
        });
        
        res.json(record);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteClassSubjectCoefficient = async (req, res) => {
    try {
        const { classId, subjectId } = req.params;
        
        await ClassSubjectCoefficient.destroy({
            where: { classId, subjectId }
        });
        
        res.json({ message: "Coefficient supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubjectsWithCoefficients = async (req, res) => {
    try {
        const { classId } = req.params;
        
        const subjects = await Subject.findAll({
            include: [{
                model: ClassSubjectCoefficient,
                where: { classId },
                required: false
            }]
        });
        
        const subjectsWithCoeffs = subjects.map(subject => {
            const coeff = subject.ClassSubjectCoefficients?.[0];
            return {
                id: subject.id,
                name: subject.name,
                category: subject.category,
                coefficient: coeff ? coeff.coefficient : 0,
                isActive: coeff && coeff.coefficient > 0
            };
        }).filter(s => s.isActive);
        
        res.json(subjectsWithCoeffs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};