import Student from "../models/student.model.js";

// Récupérer tous les élèves
export const getAllStudents = async (req, res) => {
    const students = await Student.findAll();
    res.json(students);
};

// Créer un nouvel élève
export const createStudent = async(req, res) => {
    const {firstName, lastName, gender, birthDate, guardian, phone, classId, enrollmentDate, enrollmentStatus, documents} = req.body;
    const students = await Student.create({
      firstName, lastName, gender, birthDate, guardian, phone, classId, enrollmentDate, enrollmentStatus,
      documents: documents || {
        birthCertificate: false,
        medicalCertificate: false,
        photos: false,
        previousSchoolReport: false
      }
    });
    res.status(201).json(students);
};

// Mettre à jour un élève
export const updateStudent = async(req, res) => {
    const {id} = req.params;
    const {firstName, lastName, gender,  guardian, phone, classId, enrollmentDate, enrollmentStatus, documents} = req.body;
    const student = await Student.findByPk(id);
    if(!student) return res.status(404).json({error: "Aucun élève trouvé"})
    await student.update({
      firstName, lastName, gender, guardian, phone, classId, enrollmentDate, enrollmentStatus,
      ...(documents && { documents })
    });
    res.status(200).json(student);
};

// Supprimer un élève
export  const deleteStudent = async (req, res) => {
    const {id} = req.params;
    const student = await Student.findByPk(id);
    if(!student) return res.status(404).json({error: "Élève non trouvé"});
    await student.destroy();
    res.status(200).json({message: "Elève supprimé"});
}

