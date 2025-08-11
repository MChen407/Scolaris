 const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API Scolaris opérationnelle')
})

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000')
})