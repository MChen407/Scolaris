import studentRoutes from "./src/routes/student.route.js";
import subjectRoutes from "./src/routes/subject.route.js";
import classeRoutes from "./src/routes/classe.route.js";
import teacherRoutes from "./src/routes/teacher.route.js";
import gradesRoutes from "./src/routes/grades.routes.js";
import financeRoutes from "./src/routes/finance.routes.js";
import statisticsRoutes from "./src/routes/statistics.routes.js";

import cors from "cors";
import express from "express";
import sequelize from "./config/database.js";



const app = express();

// Middleware pour parser le JSON
app.use(express.json());



// Middleware CORS pour autoriser mon frontend
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));


app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classeRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/statistics", statisticsRoutes);


// Synchroniser la base de données et démarrer le serveur
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
    console.log('Base de données synchronisée');
  });
}).catch(err => {
  console.error('Erreur de synchronisation de la base de données:', err);
});