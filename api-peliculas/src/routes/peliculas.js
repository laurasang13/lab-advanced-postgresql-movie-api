const { Router } = require('express')
const router = Router()
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol')
const {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  eliminarPelicula,
  actualizarPelicula,
  listarResenas,
  crearResena,
  estadisticasDirectores,
  estadisticasGeneros
} = require('../controllers/peliculasController')

// Rutas públicas
router.get('/', listarPeliculas)

router.get('/estadisticas/directores', estadisticasDirectores)
router.get('/estadisticas/generos', estadisticasGeneros)

router.get('/:id', obtenerPelicula)
router.get('/:id/resenas', listarResenas)

// Rutas protegidas: cualquier usuario autenticado
router.post('/', verificarToken, crearPelicula)
router.post('/:id/resenas', verificarToken, crearResena)

// Rutas protegidas: solo admin
router.put('/:id', verificarToken, verificarRol('admin'), actualizarPelicula)
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarPelicula)


module.exports = router