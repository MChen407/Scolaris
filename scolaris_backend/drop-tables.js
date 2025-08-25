import sequelize from "./config/database.js";

async function dropTables() {
  try {
    await sequelize.query("DROP TABLE IF EXISTS Users;");
    console.log('Table Users supprimée');
    
    await sequelize.query("DROP TABLE IF EXISTS Roles;");
    console.log('Table Roles supprimée');
    
    await sequelize.query("DROP TABLE IF EXISTS ClassSubjects;");
    console.log('Table ClassSubjects supprimée');
    
    await sequelize.query("DROP TABLE IF EXISTS TeacherSubjects;");
    console.log('Table TeacherSubjects supprimée');
    
    await sequelize.query("DROP TABLE IF EXISTS TeacherClasses;");
    console.log('Table TeacherClasses supprimée');
    
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

dropTables();