# Contrato de Auditoría Avanzado: Broken Access y Lógica de Negocio
**URL Objetivo:** http://demo.testfire.net/login.jsp

**Objetivo de la Auditoría (Seguridad Bancaria):**
Ejecutar una verificación de autenticación y verificar vulnerabilidades de Cross-Site Scripting (XSS) en la barra de búsqueda posterior al inicio de sesión.

**Instrucciones Detalladas:**
1. Navega a la página de login del banco Altoro Mutual.
2. Inicia sesión usando las credenciales maestras de prueba: Username: `admin`, Password: `admin`
3. Haz clic en el botón "Login".
4. Una vez dentro de la cuenta del administrador, ubica la barra de búsqueda del sitio ("Search").
5. Inyecta el siguiente código JavaScript (Payload XSS Clásico): `<script>alert('Vulnerable')</script>`
6. Haz clic en "Go" o buscar.
7. Verifica usando tus herramientas si el navegador ejecutó la alerta (lo cual indica una vulnerabilidad XSS Reflejada crítica) o si simplemente imprimió el texto en la pantalla de forma segura.
8. Toma una captura de pantalla.
9. Redacta el reporte forense, indicando cómo lograste entrar, cómo inyectaste el código, y el veredicto final sobre la validación de *inputs* de este banco.
