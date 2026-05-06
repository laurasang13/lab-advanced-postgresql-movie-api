## 2. ¿Por qué usamos LEFT JOIN en lugar de INNER JOIN? ¿Qué filas se perderían con INNER JOIN?

Usamos `LEFT JOIN` para mantener todas las películas en el resultado, aunque no tengan director o género asociado.

Con `INNER JOIN` se perderían las filas que no tengan coincidencia en las tablas `directores` o `generos`.


## ¿Qué películas tienen usuarios más entusiastas que la crítica? ¿Y al revés?

Las películas con una diferencia positiva son aquellas donde los usuarios valoran la película mejor que la crítica editorial.

En este caso, películas como `The Dark Knight`, `Dune` e `Inception` tienen usuarios más entusiastas que la crítica.

Por el contrario, las películas con diferencia negativa serían aquellas donde la nota editorial es superior a la media de los usuarios. En los resultados mostrados no se observa claramente una diferencia negativa, pero en ese caso significaría que la crítica valoró mejor la película que los usuarios.

# Parte 8: Reflexión

## ¿Cuándo es contraproducente crear un índice?

No siempre es bueno crear muchos índices. En tablas donde se hacen muchos `INSERT`, `UPDATE` o `DELETE`, tener demasiados índices puede afectar al rendimiento.

Esto pasa porque PostgreSQL tiene que actualizar también los índices cada vez que cambian los datos, así que las operaciones de escritura tardan más.

Los índices son muy útiles para mejorar búsquedas y filtros, pero conviene usarlos solo cuando realmente aportan beneficio.

---

## ¿Qué diferencia hay entre `RANK()` y `DENSE_RANK()`?

Las dos funciones sirven para crear rankings, pero gestionan los empates de forma distinta.

Con `RANK()`, si dos elementos tienen la misma posición, la siguiente se salta. Lo contrario sucede con `DENSE_RANK()`` que no se salta posiciones.

## ¿Por qué el trigger usa `AFTER INSERT OR UPDATE OR DELETE` en lugar de `BEFORE`?

El trigger usa `AFTER` porque interesa registrar los cambios cuando ya se han realizado correctamente en la base de datos.

Así la auditoría guarda el resultado final real de la operación.

Si se usara `BEFORE`, el trigger se ejecutaría antes de que el cambio se complete y podría registrarse información que finalmente no llegue a guardarse si ocurre algún error.