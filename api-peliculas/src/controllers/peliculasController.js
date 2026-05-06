const peliculaService = require('../services/PeliculaService');
const pool = require('../config/db');

// GET /api/peliculas
const listarPeliculas = async (req, res, next) => {
  try {
    const { genero } = req.query;
    const peliculas = await peliculaService.obtenerTodas(genero);
    res.json(peliculas);
  } catch (err) {
    next(err);
  }
};

// GET /api/peliculas/:id
const obtenerPelicula = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const pelicula = await peliculaService.obtenerPorId(id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    res.json(pelicula);
  } catch (err) {
    next(err);
  }
};

// POST /api/peliculas
const crearPelicula = async (req, res, next) => {
  try {
    const { titulo, anio, nota, director_id, genero_id } = req.body;
    const nueva = await peliculaService.crear({ titulo, anio, nota, director_id, genero_id });
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/peliculas/:id
const eliminarPelicula = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const eliminada = await peliculaService.eliminar(id);
    if (!eliminada) return res.status(404).json({ error: 'Película no encontrada' });
    res.json({ mensaje: 'Película eliminada', pelicula: eliminada });
  } catch (err) {
    next(err);
  }
};

// GET /api/estadisticas
const obtenerEstadisticas = async (req, res, next) => {
  try {
    const stats = await peliculaService.obtenerEstadisticas();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// PUT /api/peliculas/:id
const actualizarPelicula = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { titulo, anio, nota, director_id, genero_id } = req.body

    // ⚠️ Como tu service no tiene update, devolvemos mock
    res.json({
      mensaje: 'Película actualizada (mock)',
      id,
      datos: { titulo, anio, nota, director_id, genero_id }
    })

  } catch (err) {
    next(err)
  }
}

// GET /api/peliculas/:id/resenas
const listarResenas = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // ⚠️ Mock porque no tienes service
    res.json({
      pelicula_id: id,
      resenas: []
    })

  } catch (err) {
    next(err)
  }
}

// POST /api/peliculas/:id/resenas
const crearResena = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { comentario, nota } = req.body

    // ⚠️ Mock
    res.status(201).json({
      mensaje: 'Reseña creada (mock)',
      pelicula_id: id,
      comentario,
      nota
    })

  } catch (err) {
    next(err)
  }
}
// Nota: He quitado temporalmente actualizarPelicula, listarResenas y crearResena 
// porque tu Service aún no las tiene implementadas.

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        d.nombre AS director,
        COUNT(p.id) AS num_peliculas,
        ROUND(AVG(p.nota), 2) AS nota_media,
        MAX(p.nota) AS nota_maxima,
        MIN(p.nota) AS nota_minima
      FROM directores d
      JOIN peliculas p ON p.director_id = d.id
      GROUP BY d.id, d.nombre
      HAVING COUNT(p.id) >= 1
      ORDER BY nota_media DESC
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      WITH stats AS (
        SELECT
          g.nombre AS genero,
          COUNT(p.id) AS num_peliculas,
          ROUND(AVG(p.nota), 2) AS nota_media,
          COUNT(r.id) AS total_resenas
        FROM generos g
        LEFT JOIN peliculas p ON p.genero_id = g.id
        LEFT JOIN resenas r ON r.pelicula_id = p.id
        GROUP BY g.id, g.nombre
      )
      SELECT *, RANK() OVER (ORDER BY nota_media DESC NULLS LAST) AS ranking
      FROM stats
      ORDER BY ranking
    `)
    res.json(rows)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listarPeliculas,
  obtenerPelicula,
  crearPelicula,
  eliminarPelicula,
  obtenerEstadisticas,
  listarResenas,
  crearResena,
  actualizarPelicula,
  estadisticasDirectores,
  estadisticasGeneros
};

