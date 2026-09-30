# Reporte de Auditoría Autónomo: Manejo de Elementos Dinámicos (Dropdown)

**URL Objetivo:** https://the-internet.herokuapp.com/dropdown  
**Fecha/Hora de Ejecución:** Sesión de Auditoría Autónoma en Vivo  
**Objetivo de la Auditoría:** Verificar la interacción correcta con elementos `<select>` nativos y comprobar la persistencia y renderizado de los cambios de estado en el DOM.

---

## 1. Resumen Ejecutivo
La auditoría se completó de manera exitosa. El agente autónomo evaluó el estado inicial del elemento desplegable, aplicó una acción de selección mediante automatización de interfaz y confirmó el cambio de estado tanto a nivel lógico (propiedades y atributos del DOM) como visual (captura de pantalla).

---

## 2. Hallazgos Detallados Paso a Paso

1. **Navegación:**  
   Se accedió correctamente a la URL provista: `https://the-internet.herokuapp.com/dropdown`.

2. **Identificación del Elemento:**  
   Se localizó el elemento interactivo mediante el selector estándar del DOM: `<select id="dropdown">`.

3. **Evaluación del Estado Inicial:**  
   * Mediante inspección de propiedades en JavaScript, se confirmó que el valor inicial (`dropdown.value`) correspondía a una cadena vacía (`""`), lo cual representa la opción por defecto *"Please select an option"*.
   * Se verificó que ni la *Option 1* ni la *Option 2* tenían la propiedad `selected` o el atributo `selected="selected"` activados por defecto.

4. **Acción de Selección Forzada:**  
   * Se utilizó la herramienta de selección para forzar el cambio de valor del dropdown hacia la **"Option 2"** (`value="2"`).

5. **Verificación del DOM tras la Interacción:**  
   * Se consultó nuevamente el estado del DOM mediante script de evaluación:
     * `dropdown.value` arrojó `"2"`.
     * `dropdown.selectedIndex` cambió a `2`.
     * La propiedad `.selected` del nodo correspondiente a la *Option 2* se evaluó como `true`.
   * El navegador renderizó el cambio de estado correctamente actualizando la selección interna del componente HTML estándar.

6. **Evidencia Visual:**  
   * Se capturó una imagen de la página evidenciando el estado actual de la interfaz y el menú desplegable.

---

## 3. Conclusiones
* **Manejo del Evento:** El elemento `<select>` nativo responde de manera predecible a las instrucciones de selección programáticas (`puppeteer_select`), disparando los cambios necesarios en el árbol DOM y actualizando las propiedades de selección de las opciones hijas.
* **Renderizado de Estado:** El navegador procesó y renderizó de forma instantánea y correcta el cambio de estado, reflejando la *Option 2* como activa.
* **Calidad de la Interfaz (UX):** Al tratarse de un elemento HTML estándar (`<select>`), la accesibilidad y la manipulación mediante agentes automatizados son robustas y confiables en comparación con componentes personalizados hechos a base de `<div>` y JavaScript complejo.