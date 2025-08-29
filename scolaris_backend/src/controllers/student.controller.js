import { Student, Classe } from "../models/index.model.js";

// Récupérer tous les élèves
export const getAllStudents = async (req, res) => {
    try {
        const { niveau } = req.query;
        let whereClause = {};
        
        if (niveau) {
            const classes = await Classe.findAll({ where: { niveau } });
            const classIds = classes.map(c => c.id);
            whereClause.classId = classIds;
        }
        
        const students = await Student.findAll({
            where: whereClause,
            include: [{ model: Classe, attributes: ['name', 'niveau'] }],
            order: [['firstName', 'ASC']]
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouvel élève
export const createStudent = async(req, res) => {
    try {
        const {firstName, lastName, gender, birthDate, guardian, phone, address, parentName, parentPhone, classId, enrollmentStatus, documents} = req.body;
        const student = await Student.create({
            firstName, 
            lastName, 
            gender, 
            birthDate, 
            guardian, 
            phone, 
            address,
            parentName,
            parentPhone,
            classId, 
            enrollmentDate: new Date().toISOString().split('T')[0],
            enrollmentStatus: enrollmentStatus || 'active',
            documents: documents || {
                birthCertificate: false,
                medicalCertificate: false,
                photos: false,
                previousSchoolReport: false
            }
        });
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un élève
export const updateStudent = async(req, res) => {
    try {
        const {id} = req.params;
        const {firstName, lastName, gender, birthDate, guardian, phone, address, parentName, parentPhone, classId, enrollmentStatus, documents} = req.body;
        const student = await Student.findByPk(id);
        if(!student) return res.status(404).json({error: "Aucun élève trouvé"})
        await student.update({
            firstName, 
            lastName, 
            gender, 
            birthDate, 
            guardian, 
            phone, 
            address,
            parentName,
            parentPhone,
            classId, 
            enrollmentStatus,
            ...(documents && { documents })
        });
        res.status(200).json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un élève
export const deleteStudent = async (req, res) => {
    try {
        const {id} = req.params;
        const student = await Student.findByPk(id);
        if(!student) return res.status(404).json({error: "Élève non trouvé"});
        await student.destroy();
        res.status(200).json({message: "Elève supprimé"});
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: error.message });
    }
}

