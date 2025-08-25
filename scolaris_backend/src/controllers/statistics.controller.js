import { Student, Classe, Subject, Grade, Payment, FeeType } from "../models/index.model.js";
import { Op } from 'sequelize';

export const getGeneralStats = async (req, res) => {
    try {
        const totalStudents = await Student.count();
        const totalClasses = await Classe.count();
        const totalSubjects = await Subject.count();
        
        const grades = await Grade.findAll();
        const overallAverage = grades.length > 0 
            ? grades.reduce((sum, grade) => sum + parseFloat(grade.grade), 0) / grades.length 
            : 0;
        
        const successRate = grades.length > 0 
            ? (grades.filter(grade => parseFloat(grade.grade) >= 10).length / grades.length) * 100 
            : 0;
        
        const payments = await Payment.findAll();
        const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        
        res.json({
            totalStudents,
            totalClasses,
            totalSubjects,
            overallAverage,
            successRate,
            totalRevenue,
            totalPayments: payments.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getStudentsByClass = async (req, res) => {
    try {
        const classes = await Classe.findAll({
            include: [{ model: Student }]
        });
        
        const stats = classes.map(classe => ({
            classId: classe.id,
            className: classe.name,
            studentCount: classe.Students.length,
            capacity: classe.capacity,
            occupancyRate: (classe.Students.length / classe.capacity) * 100
        }));
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAveragesBySubject = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        const grades = await Grade.findAll();
        
        const subjectStats = subjects.map(subject => {
            const subjectGrades = grades.filter(g => g.subjectId === subject.id);
            const average = subjectGrades.length > 0 
                ? subjectGrades.reduce((sum, g) => sum + parseFloat(g.grade), 0) / subjectGrades.length 
                : 0;
            
            return {
                subjectId: subject.id,
                subjectName: subject.name,
                average,
                studentCount: new Set(subjectGrades.map(g => g.studentId)).size
            };
        });
        
        res.json(subjectStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getClassPerformance = async (req, res) => {
    try {
        const classes = await Classe.findAll({
            include: [{ model: Student }]
        });
        
        const grades = await Grade.findAll();
        
        const classStats = await Promise.all(classes.map(async classe => {
            const classStudents = classe.Students;
            const classGrades = grades.filter(g => 
                classStudents.some(s => s.id === g.studentId)
            );
            
            const average = classGrades.length > 0 
                ? classGrades.reduce((sum, g) => sum + parseFloat(g.grade), 0) / classGrades.length 
                : 0;
            
            const successRate = classGrades.length > 0 
                ? (classGrades.filter(g => parseFloat(g.grade) >= 10).length / classGrades.length) * 100 
                : 0;
            
            // Meilleur élève de la classe
            const studentAverages = classStudents.map(student => {
                const studentGrades = grades.filter(g => g.studentId === student.id);
                const studentAverage = studentGrades.length > 0 
                    ? studentGrades.reduce((sum, g) => sum + parseFloat(g.grade), 0) / studentGrades.length 
                    : 0;
                return { 
                    name: `${student.firstName} ${student.lastName}`, 
                    average: studentAverage 
                };
            }).sort((a, b) => b.average - a.average);
            
            const bestStudent = studentAverages[0] || { name: '-', average: 0 };
            
            return {
                classId: classe.id,
                className: classe.name,
                studentCount: classStudents.length,
                average,
                successRate,
                bestStudent
            };
        }));
        
        res.json(classStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTop3StudentsByClass = async (req, res) => {
    try {
        const classes = await Classe.findAll({
            include: [{ model: Student }]
        });
        
        const grades = await Grade.findAll();
        
        const classTop3 = classes.map(classe => {
            const classStudents = classe.Students;
            const studentsWithAverages = classStudents.map(student => {
                const studentGrades = grades.filter(g => g.studentId === student.id);
                const average = studentGrades.length > 0 
                    ? studentGrades.reduce((sum, g) => sum + parseFloat(g.grade), 0) / studentGrades.length 
                    : 0;
                return { 
                    id: student.id,
                    name: `${student.firstName} ${student.lastName}`, 
                    average 
                };
            }).sort((a, b) => b.average - a.average).slice(0, 3);
            
            return {
                classId: classe.id,
                className: classe.name,
                students: studentsWithAverages
            };
        });
        
        res.json(classTop3);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};