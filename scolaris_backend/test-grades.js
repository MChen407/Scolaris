import { Grade, Student, Subject, Classe } from "./src/models/index.model.js";

async function testGrades() {
  try {
    console.log('Testing grades API...');
    
    // Test de création d'une note
    const testGrade = await Grade.create({
      studentId: 1,
      subjectId: 1,
      classId: 1,
      period: 'Trimestre 1',
      grade: 15.5,
      maxGrade: 20,
      date: new Date().toISOString().split('T')[0],
      type: 'Devoir',
      index: 0
    });
    
    console.log('Grade created:', testGrade.toJSON());
    
    // Test de récupération
    const grades = await Grade.findAll();
    console.log('All grades:', grades.length);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGrades();