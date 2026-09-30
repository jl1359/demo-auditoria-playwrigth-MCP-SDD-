# Reporte de Auditoría QA: Búsqueda y Verificación en Wikipedia

**URL Objetivo:** https://es.wikipedia.org/  
**Término de Búsqueda:** `Ciberseguridad`  
**Fecha de Ejecución:** Sesión Actual de Auditoría Autónoma  

---

## 1. Validación del Motor de Búsqueda Interno
* **Estado:** **Éxito (PASSED)**
* **Acción Realizada:** Se identificó correctamente el campo de entrada de búsqueda (`input[name="search"]`), se ingresó el término exacto *"Ciberseguridad"* y se ejecutó la consulta a través del endpoint de búsqueda de Wikipedia (`/w/index.php?search=Ciberseguridad`), lo cual redirigió de manera fluida y precisa al artículo correspondiente (redirigido desde la consulta a la página de *Seguridad informática*).

## 2. Tiempos Estimados de Carga (Rendimiento)
Basado en las métricas de rendimiento de navegación (`PerformanceNavigationTiming`):
* **DOM Content Loaded:** ~649.3 ms
* **Carga Completa de la Página (Load Event):** ~1006.9 ms
* **Conclusión:** El tiempo de respuesta y renderizado del motor de búsqueda y la página de destino se encuentran dentro de parámetros óptimos y de alta velocidad (< 1.5 segundos).

## 3. Extracción de Contenido (DOM y Texto Introductorio)
* **Primer Párrafo Extrayendo Textualmente:**
  > *"La seguridad informática, también conocida como ciberseguridad,[1] es el área relacionada con la informática y la telemática que se enfoca en la protección de la infraestructura computacional y todo lo vinculado con la misma, y especialmente la información contenida en una computadora o circulante a través de las redes de computadoras. Para ello existen una serie de estándares, protocolos, métodos, reglas, herramientas, y leyes concebidas para minimizar los posibles riesgos a la infraestructura o a la propia información. La ciberseguridad comprende software (bases de datos, metadatos, archivos), hardware, redes de computadoras, y todo lo que la organización entienda y valore como un riesgo si la información confidencial involucrada pudiera llegar a manos de otras personas, por ejemplo, convirtiéndose así en información privilegiada."*

## 4. Evidencia Visual
* Se ha capturado y guardado satisfactoriamente la evidencia visual del artículo cargado bajo el nombre: `ciberseguridad_wikipedia`.

---
**Conclusión General:**  
La auditoría funcional del motor de búsqueda interno y la integridad del contenido en Wikipedia han superado satisfactoriamente todas las pruebas del SDD definido.