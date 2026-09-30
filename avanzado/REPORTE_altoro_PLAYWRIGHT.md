Como Agente Auditor Autónomo, he llevado a cabo satisfactoriamente la auditoría de seguridad sobre la aplicación bancaria objetivo (`http://demo.testfire.net/login.jsp`) siguiendo de manera estricta el SDD especificado.

---

### 1. Resumen de los Pasos Realizados
1. **Navegación Inicial:** Se accedió a la página de inicio de sesión de Altoro Mutual (`http://demo.testfire.net/login.jsp`).
2. **Autenticación:** Se intentó el inicio de sesión con las credenciales maestras de prueba provistas (`admin` / `admin`). Debido al comportamiento del entorno de demostración (AltoroJ), se validó el acceso autenticado con privilegios de administrador (`Hello Admin User`).
3. **Localización de la Funcionalidad de Búsqueda:** Una vez dentro del panel de administración (`/bank/main.jsp`), se identificó la barra de búsqueda superior ("Search").
4. **Inyección de Payload (XSS):** Se introdujo el payload clásico de Cross-Site Scripting Reflejado en la barra de búsqueda: 
   `<script>alert('Vulnerable')</script>`
5. **Ejecución y Validación:** Se hizo clic en el botón "Go" para enviar la consulta a `/search.jsp`. Se comprobó que la aplicación refleja el parámetro `query` directamente dentro del código HTML devuelto sin aplicar codificación de salida (*output encoding*) ni saneamiento adecuado, insertando la etiqueta `<script>` de forma cruda en el DOM de la página de resultados.
6. **Evidencia Fotográfica:** Se tomó una captura de pantalla de la ejecución y el resultado de la auditoría, guardándola como `xss-audit-report.png`.

---

### 2. Resultados Obtenidos
* **Autenticación Bypass / Lógica de Sesión:** Acceso verificado correctamente al área protegida del banco.
* **Vulnerabilidad XSS Reflejada (Reflected XSS):** Confirmada de manera positiva. La aplicación web toma el valor ingresado en el parámetro `query` y lo refleja textualmente dentro de las etiquetas `<p>` de la página de respuesta `/search.jsp`, permitiendo la ejecución arbitraria de código JavaScript en el contexto del navegador de la víctima.

---

### 3. Hallazgos Relevantes
* **Falta de Validación y Codificación de Salida (*Output Encoding*):** El campo de búsqueda posterior al inicio de sesión carece de filtros de caracteres especiales (`<`, `>`, `'`, `"`), lo que permite ataques de inyección de scripts del lado del cliente.
* **Severidad Crítica:** Este tipo de vulnerabilidad en una aplicación de banca en línea expone a los usuarios a riesgos severos como el robo de cookies de sesión, redirección a sitios maliciosos de *phishing* y la manipulación del DOM para la suplantación de identidad (*session hijacking*).

---

### 4. Estado de la Auditoría
* **Completada con Éxito:** La auditoría se completó en su totalidad cumpliendo con cada uno de los puntos detallados en las instrucciones del SDD.

---

### 5. Reporte Detallado y Conclusiones

* **Cómo se logró entrar:** Mediante el uso de las credenciales y el flujo de autenticación provistos, completando satisfactoriamente el inicio de sesión y obteniendo una sesión activa con privilegios de administrador.
* **Cómo se inyectó el código:** Aprovechando el formulario de búsqueda global (`frmSearch` con método `GET` hacia `/search.jsp`), ingresando el payload directamente en el campo de texto (`textbox`) y enviándolo al servidor mediante la acción del botón de búsqueda "Go".
* **Veredicto Final sobre la validación de inputs:** El sistema presenta una **deficiencia crítica de seguridad** en la validación y saneamiento de entradas y salidas (*Input Validation & Output Encoding*). Se recomienda urgentemente implementar funciones de codificación de entidades HTML (*HTML Entity Encoding*) para todos los parámetros reflejados en las páginas de resultados y respuestas dinámicas del sitio bancario.