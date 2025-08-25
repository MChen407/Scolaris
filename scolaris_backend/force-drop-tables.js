import sequelize from "./config/database.js";

async function forceDropTables() {
  try {
    // Fermer toutes les connexions existantes
    await sequelize.close();
    
    // Créer une nouvelle connexion
    const newSequelize = new (await import('sequelize')).Sequelize({
      dialect: 'sqlite',
      storage: './src/config/scolaris.sqlite',
      logging: false
    });
    
    await newSequelize.query("PRAGMA busy_timeout = 30000;");
    await newSequelize.query("DROP TABLE IF EXISTS Users;");
    console.log('Table Users supprimée');
    
    await newSequelize.query("DROP TABLE IF EXISTS Roles;");
    console.log('Table Roles supprimée');
    
    await newSequelize.close();
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

forceDropTables();