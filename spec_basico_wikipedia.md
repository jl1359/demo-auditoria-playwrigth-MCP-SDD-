# Contrato de Auditoría Básico: Búsqueda y Verificación (Wikipedia)
**URL Objetivo:** https://es.wikipedia.org/

**Objetivo de la Auditoría (QA Básico):**
Probar la robustez funcional del motor de búsqueda interno y la integridad del contenido de artículos clave.

**Instrucciones Detalladas:**
1. Navega a la página principal de Wikipedia.
2. Identifica el campo de búsqueda (generalmente con el nombre `search` o id `searchInput`).
3. Escribe el término de búsqueda exacto: `Ciberseguridad`
4. Ejecuta la búsqueda (haciendo clic en el botón de buscar o presionando Enter).
5. Una vez que cargue la página de "Ciberseguridad", utiliza tus herramientas para leer la estructura de la página (DOM).
6. Extrae textualmente el primer párrafo introductorio del artículo.
7. Toma una captura de pantalla del artículo cargado para evidenciar que la búsqueda redirigió correctamente.
8. Genera un reporte que valide que el motor de búsqueda interno funciona, el tiempo estimado de carga y el texto extraído.
