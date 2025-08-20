import { Classe, Student, Subject, Teacher } from "../models/index.model.js";

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Classe.findAll({
            include: [
                { model: Student, as: 'Students' },
                { model: Subject, as: 'Subjects' }
                // { model: Teacher, as: 'Teachers' }
            ]
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getClasseById = async (req, res) => {
    try {
        const { id } = req.params;
        const classe = await Classe.findByPk(id, {
            include: [
                { model: Student, as: 'Students' },
                { model: Subject, as: 'Subjects' }
                // { model: Teacher, as: 'Teachers' }
            ]
        });
        if (!classe) return res.status(404).json({ error: "Classe non trouvée" });
        res.json(classe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createClasse = async (req, res) => {
    try {
        const { name, level, section, capacity, subjectIds = [] } = req.body;
        const classe = await Classe.create({ name, level, section, capacity });
        
        if (subjectIds.length > 0) {
            await classe.setSubjects(subjectIds);
        }
        
        const classeWithRelations = await Classe.findByPk(classe.id, {
            include: [{ model: Subject, as: 'Subjects' }]
        });
        
        res.status(201).json(classeWithRelations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateClasse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level, section, capacity, subjectIds } = req.body;
        const classe = await Classe.findByPk(id);
        if (!classe) return res.status(404).json({ error: "Classe non trouvée" });
        
        await classe.update({ name, level, section, capacity });
        
        if (subjectIds !== undefined) {
            await classe.setSubjects(subjectIds);
        }
        
        // if (teacherIds !== undefined) {
        //     await classe.setTeachers(teacherIds);
        // }
        
        const classeWithRelations = await Classe.findByPk(id, {
            include: [
                { model: Subject, as: 'Subjects' }
                // { model: Teacher, as: 'Teachers' }
            ]
        });
        
        res.json(classeWithRelations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteClasse = async (req, res) => {
    try {
        const { id } = req.params;
        const classe = await Classe.findByPk(id);
        if (!classe) return res.status(404).json({ error: "Classe non trouvée" });
        await classe.destroy();
        res.json({ message: "Classe supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
