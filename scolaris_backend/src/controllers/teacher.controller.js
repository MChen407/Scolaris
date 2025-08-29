import { Teacher, Subject, Classe } from "../models/index.model.js";

export const getAllTeachers = async (req, res) => {
    try {
        const { niveau } = req.query;
        const whereClause = niveau ? { niveau } : {};
        
        const teachers = await Teacher.findAll({
            where: whereClause,
            include: [
                { model: Subject, as: 'Subjects' },
                { model: Classe, as: 'Classes' }
            ],
            order: [['niveau', 'ASC'], ['firstName', 'ASC']]
        });
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findByPk(id, {
            include: [
                { model: Subject, as: 'Subjects' },
                { model: Classe, as: 'Classes' }
            ]
        });
        if (!teacher) return res.status(404).json({ error: "Enseignant non trouvé" });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, specialization, niveau, weeklyHours, hireDate, subjectIds, classIds } = req.body;
        console.log('Creating teacher with data:', { firstName, lastName, email, phone, address, specialization, niveau, weeklyHours, subjectIds, classIds });
        
        const teacher = await Teacher.create({ 
            firstName, 
            lastName, 
            email, 
            phone, 
            address,
            specialization,
            niveau,
            weeklyHours, 
            hireDate: hireDate || new Date().toISOString().split('T')[0]
        });
        console.log('Teacher created:', teacher.id);
        
        if (subjectIds && subjectIds.length > 0) {
            console.log('Setting subjects:', subjectIds);
            await teacher.setSubjects(subjectIds);
        }
        
        if (classIds && classIds.length > 0) {
            console.log('Setting classes:', classIds);
            await teacher.setClasses(classIds);
        }
        
        const teacherWithRelations = await Teacher.findByPk(teacher.id, {
            include: [
                { model: Subject, as: 'Subjects' },
                { model: Classe, as: 'Classes' }
            ]
        });
        
        res.status(201).json(teacherWithRelations);
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, address, specialization, niveau, weeklyHours, hireDate, subjectIds, classIds } = req.body;
        const teacher = await Teacher.findByPk(id);
        if (!teacher) return res.status(404).json({ error: "Enseignant non trouvé" });
        
        await teacher.update({ firstName, lastName, email, phone, address, specialization, niveau, weeklyHours, hireDate });
        
        if (subjectIds !== undefined) {
            await teacher.setSubjects(subjectIds);
        }
        
        if (classIds !== undefined) {
            await teacher.setClasses(classIds);
        }
        
        const teacherWithRelations = await Teacher.findByPk(id, {
            include: [
                { model: Subject, as: 'Subjects' },
                { model: Classe, as: 'Classes' }
            ]
        });
        
        res.json(teacherWithRelations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findByPk(id);
        if (!teacher) return res.status(404).json({ error: "Enseignant non trouvé" });
        await teacher.destroy();
        res.json({ message: "Enseignant supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};