# Contrato de Auditoría Intermedio: Manejo de Elementos Dinámicos
**URL Objetivo:** https://the-internet.herokuapp.com/dropdown

**Objetivo de la Auditoría (QA UI/UX):**
Demostrar la habilidad de la inteligencia artificial para interactuar con elementos HTML estándar difíciles (Dropdowns/Selects) y verificar cambios de estado.

**Instrucciones Detalladas:**
1. Navega a la URL específica del Dropdown.
2. Identifica el menú desplegable (`<select id="dropdown">`).
3. Evalúa el estado inicial: Confirma que la "Opción 1" o "Opción 2" NO están seleccionadas por defecto.
4. Interactúa con la página forzando la selección de la "Option 2" en el menú desplegable.
5. Usa tus herramientas para leer el DOM nuevamente y verificar que el atributo `selected="selected"` esté ahora en la Opción 2.
6. Toma una captura de pantalla evidenciando el menú desplegable con la Opción 2 activada visiblemente.
7. Genera un reporte detallando cómo manejaste el evento del dropdown y si el navegador renderizó el cambio de estado correctamente.
