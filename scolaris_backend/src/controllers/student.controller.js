import Student from "../models/student.model";

// Récupérer tous les élèves
const getAllStudents = async (req, res) => {
    const students = await Student.findAll();
    res.json(students);
};

// Créer un nouvel élève
const createStudent = async(req, res) => {
    const {firstName, lastName, gender, amount, guardian, phone, classId, enrollmentDate, enrollmentStatus} = req.body;
    const students = await Student.create({firstName, lastName, gender, amount, guardian, phone, classId, enrollmentDate, enrollmentStatus});
    res.status(201).json(students);
};

// Mettre à jour un élève
const updateStudent = async(req, res) => {
    const {id} = req.params;
    const {firstName, lastName, gender, amount, guardian, phone, classId, enrollmentDate, enrollmentStatus} = req.body;
    const student = await Student.findByPk(id);
    if(!student) return res.status(404).json({error: "Aucun élève trouvé"})
    await student.update({firstName, lastName, gender, amount, guardian, phone, classId, enrollmentDate, enrollmentStatus});
    res.status(200).json(student);
};

// Supprimer un élève
const deleteStudent = async (req, res) => {
    const {id} = req.params;
    const student = await Student.findByPk(id);
    if(!student) return res.status(404).json({error: "Élève non trouvé"});
    await student.destroy();
    res.status(200).json({message: "Elève supprimé"});
}

module.exports = {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent
}