require('dotenv').config()
require('./src/config/db') 

const express = require('express')
const peliculasRouter = require('./src/routes/peliculas')
// Importamos la función específica del controlador
const { obtenerEstadisticas } = require('./src/controllers/peliculasController')

const app = express()
const PORT = process.env.PORT || 3000

const authRouter = require('./src/routes/auth')

// Middleware global
app.use(express.json())

// Rutas
app.use('/api/peliculas', peliculasRouter)

// Ruta de estadísticas (Ahora limpia y asíncrona)
app.get('/api/estadisticas', obtenerEstadisticas)

//router auth

app.use('/api/auth', authRouter)

// 404 global
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` })
})

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('❌ Error al levantar el servidor:', err.message)
})