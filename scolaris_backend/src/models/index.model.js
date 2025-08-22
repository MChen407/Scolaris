import Student from "./student.model.js";
import Classe from "./classe.model.js";
import Subject from "./subject.model.js";
import Teacher from "./teacher.model.js";
import Grade from "./grades.model.js";
import Payment from "./payment.model.js";
import FeeType from "./feeType.model.js";
import StudentAverage from "./studentAverage.model.js";

// Student - Classe
Student.belongsTo(Classe, { foreignKey: "classId" });
Classe.hasMany(Student, { foreignKey: "classId" });

// Classe - Subject (Many-to-Many)
Classe.belongsToMany(Subject, { through: "ClassSubjects", foreignKey: "classId", as: "Subjects" });
Subject.belongsToMany(Classe, { through: "ClassSubjects", foreignKey: "subjectId", as: "Classes" });

// Teacher - Subject (Many-to-Many)
Teacher.belongsToMany(Subject, { through: "TeacherSubjects", foreignKey: "teacherId", as: "Subjects" });
Subject.belongsToMany(Teacher, { through: "TeacherSubjects", foreignKey: "subjectId", as: "Teachers" });

// Teacher - Classe (Many-to-Many)
Teacher.belongsToMany(Classe, { through: "TeacherClasses", foreignKey: "teacherId", as: "Classes" });
Classe.belongsToMany(Teacher, { through: "TeacherClasses", foreignKey: "classId", as: "Teachers" });

// Grade - Student, Subject, Classe
Grade.belongsTo(Student, { foreignKey: "studentId" });
Student.hasMany(Grade, { foreignKey: "studentId" });

Grade.belongsTo(Subject, { foreignKey: "subjectId" });
Subject.hasMany(Grade, { foreignKey: "subjectId" });

Grade.belongsTo(Classe, { foreignKey: "classId" });
Classe.hasMany(Grade, { foreignKey: "classId" });

// Payment - Student, FeeType
Payment.belongsTo(Student, { foreignKey: "studentId" });
Student.hasMany(Payment, { foreignKey: "studentId" });

Payment.belongsTo(FeeType, { foreignKey: "feeTypeId" });
FeeType.hasMany(Payment, { foreignKey: "feeTypeId" });

// StudentAverage - Student
StudentAverage.belongsTo(Student, { foreignKey: "studentId" });
Student.hasMany(StudentAverage, { foreignKey: "studentId" });

export {
  Student,
  Classe,
  Subject,
  Teacher,
  Grade,
  Payment,
  FeeType,
  StudentAverage
};