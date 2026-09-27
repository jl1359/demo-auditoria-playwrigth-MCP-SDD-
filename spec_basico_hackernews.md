# Contrato de Auditoría Básico: Minería de Tendencias (Hacker News)
**URL Objetivo:** https://news.ycombinator.com/

**Objetivo de la Auditoría (Scraping de Noticias):**
Demostrar la capacidad del agente para recorrer listas dinámicas en formato de tabla/filas y extraer metadatos de enlaces y puntuaciones.

**Instrucciones Detalladas:**
1. Navega a la portada de Hacker News.
2. Esta página muestra noticias ordenadas por votos. Usa tu herramienta de evaluación de código para inspeccionar las filas (`<tr class="athing">`).
3. Lee el título de la noticia que se encuentre en la posición #1.
4. Lee la cantidad de puntos/votos que tiene esa noticia número 1 (generalmente en un `<span class="score">` justo debajo del título).
5. Haz clic en el enlace principal de esa noticia número 1 para visitar el sitio externo.
6. Toma una captura de pantalla de la página externa a la que fuiste redirigido.
7. Redacta un reporte indicando: El título de la noticia líder de hoy, cuántos puntos tiene, y si el enlace externo funciona correctamente o está roto.
