import studentRoutes from "./src/routes/student.route.js";
import subjectRoutes from "./src/routes/subject.route.js";
import classeRoutes from "./src/routes/classe.route.js";
import cors from "cors";
import express from "express";



const app = express();

// Middleware pour parser le JSON
app.use(express.json());



// Middleware CORS pour autoriser mon frontend
app.use(cors({
  origin: "http://localhost:5174",
  credentials: true
}));

app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classeRoutes);


app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000')
})