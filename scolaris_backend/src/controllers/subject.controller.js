import { Subject, Classe, Teacher, Grade } from "../models/index.model.js";

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            include: [
                { model: Classe, as: 'Classes' }
                // { model: Teacher, as: 'Teachers' },
                // { model: Grade, as: 'Grades' }
            ]
        });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByPk(id, {
            include: [
                { model: Classe, as: 'Classes' }
                // { model: Teacher, as: 'Teachers' },
                // { model: Grade, as: 'Grades' }
            ]
        });
        if (!subject) return res.status(404).json({ error: "Matière non trouvée" });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createSubject = async (req, res) => {
    try {
        const { name, coefficient, category, classIds = [] } = req.body;
        const subject = await Subject.create({ name, coefficient, category });
        
        if (classIds.length > 0) {
            await subject.setClasses(classIds);
        }
        
        const subjectWithRelations = await Subject.findByPk(subject.id, {
            include: [{ model: Classe, as: 'Classes' }]
        });
        
        res.status(201).json(subjectWithRelations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, coefficient, category, classIds } = req.body;
        const subject = await Subject.findByPk(id);
        if (!subject) return res.status(404).json({ error: "Matière non trouvée" });
        
        await subject.update({ name, coefficient, category });
        
        if (classIds !== undefined) {
            await subject.setClasses(classIds);
        }
        
        // if (teacherIds !== undefined) {
        //     await subject.setTeachers(teacherIds);
        // }
        
        const subjectWithRelations = await Subject.findByPk(id, {
            include: [
                { model: Classe, as: 'Classes' }
                // { model: Teacher, as: 'Teachers' }
            ]
        });
        
        res.json(subjectWithRelations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await Subject.findByPk(id);
        if (!subject) return res.status(404).json({ error: "Matière non trouvée" });
        await subject.destroy();
        res.json({ message: "Matière supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}