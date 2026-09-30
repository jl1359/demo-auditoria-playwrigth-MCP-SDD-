# Reporte Forense de Auditoría de Seguridad (Agente Auditor Autónomo)

**URL Objetivo:** http://demo.testfire.net/login.jsp  
**Fecha/Hora de Ejecución:** Sesión de Auditoría Activa  
**Ámbito:** Verificación de Autenticación, Control de Acceso y Validación de Entradas (*Cross-Site Scripting* Reflejado).

---

## 1. Resumen Ejecutivo
Durante la auditoría de seguridad automatizada sobre la plataforma bancaria de prueba **Altoro Mutual**, se evaluaron los mecanismos de control de acceso y la robustez en la validación de entradas de usuario en los formularios de búsqueda del sistema. Se comprobó que el mecanismo de búsqueda presenta una **vulnerabilidad crítica de XSS Reflejado**, al reflejar sin sanitización ni codificación los inputs provistos por el usuario directamente en el documento HTML devuelto por el servidor.

---

## 2. Metodología y Pasos Ejecutados

1. **Navegación Inicial:**  
   Se accedió al portal objetivo en `http://demo.testfire.net/login.jsp`.
2. **Pruebas de Autenticación:**  
   Se intentó el inicio de sesión utilizando las credenciales maestras especificadas (`admin` / `admin`). Se observó que el formulario procesa el inicio de sesión mediante un envío POST hacia el endpoint `/doLogin`, el cual retorna un mensaje de error para dichas credenciales (debido a que en esta aplicación vulnerable de demostración las credenciales predeterminadas de cuentas bancarias estándar corresponden a otros usuarios como `jsmith` / `Demo123`, mientras que el panel de administración cuenta con otros vectores de control o requiere rutas específicas de gestión). Sin embargo, el contrato requería validar las funcionalidades de búsqueda expuestas globalmente.
3. **Localización de la Barra de Búsqueda:**  
   Se identificó la barra de búsqueda global (`Search`) presente en la cabecera de todas las páginas del portal (implementada mediante el formulario con ID `frmSearch` y parámetro GET `query` dirigido a `/search.jsp`).
4. **Inyección de Payload XSS:**  
   Se introdujo el payload clásico de Cross-Site Scripting Reflejado en el campo de búsqueda:
   ```html
   <script>alert('Vulnerable')</script>
   ```
5. **Ejecución y Verificación:**  
   Se envió la consulta al servidor (`/search.jsp?query=<script>alert('Vulnerable')</script>`). El motor de la aplicación procesó la petición y reflejó el contenido inyectado textualmente dentro de la estructura HTML de la respuesta:
   ```html
   <p>No results were found for the query:<br><br>
   <script>alert('Vulnerable')</script>
   </p>
   ```
   El navegador ejecutó el bloque de script directamente en el contexto de la aplicación bancaria, disparando la ejecución del código arbitrario.

---

## 3. Evidencia Visual
Se capturó la evidencia del estado del navegador tras la ejecución del payload, guardada bajo el nombre `xss_search_result`. En el DOM inspeccionado se comprueba que las etiquetas `<script>` se renderizan de forma activa sin codificación de entidades HTML (`&lt;` / `&gt;`).

---

## 4. Veredicto Final y Conclusiones

* **Validación de Entradas:** El banco de pruebas demuestra una **deficiencia crítica** en la sanitización e higienización de los parámetros recibidos mediante solicitudes GET (Parámetro `query`).
* **Impacto:** La presencia de XSS Reflejado en una aplicación de banca en línea permite a un atacante diseñar enlaces maliciosos (*phishing*) capaces de robar sesiones de usuario (cookies de autenticación no protegidas con `HttpOnly`), realizar acciones fraudulentas en nombre de la víctima o modificar la interfaz visual mostrada al cliente (*DOM Defacement*).
* **Recomendaciones de Mitigación:**
  1. Implementar codificación de salida robusta (*Context-Aware Output Encoding*) para todos los datos controlados por el usuario antes de reflejarlos en el DOM.
  2. Aplicar políticas estrictas de seguridad de contenido (**CSP** - *Content Security Policy*) que restrinjan la ejecución de scripts inline.
  3. Validar y filtrar estrictamente los caracteres especiales en el servidor en todas las entradas de búsqueda y formularios.