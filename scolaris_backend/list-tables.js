import sequelize from "./config/database.js";

async function listTables() {
  try {
    const [results] = await sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table';"
    );
    
    console.log('Tables in database:');
    results.forEach(table => {
      console.log('- ' + table.name);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

listTables();