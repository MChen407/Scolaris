import studentRoutes from "./src/routes/student.route.js";

const express = require('express')
const app = express()

app.use("/api/students", studentRoutes);


app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000')
})