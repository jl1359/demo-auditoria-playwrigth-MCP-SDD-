# Contrato de Auditoría: Moodle (Localhost)
**URL Objetivo:** http://localhost/login/index.php

**Objetivo de la Auditoría:**
Prueba de contraste (Negative & Positive Testing) sobre el formulario de autenticación local.

**Instrucciones Detalladas:**
1. Navega a la URL local de inicio de sesión de Moodle.
2. **[Prueba de Acceso Público]** Intenta buscar el botón de "Entrar como invitado" (o ingresa el usuario `guest` con la contraseña en blanco o con clave `guest`) e intenta iniciar sesión.
3. Toma una captura de pantalla del resultado (ya sea que entres o que Moodle te bloquee).
4. Asegúrate de volver a cargar la página de login original (`http://localhost/login/index.php`) para limpiar la sesión.
5. Identifica los campos de Usuario (`username`) y Contraseña (`password`).
6. **[Negative Testing]** Ingresa el usuario falso `auditor_falso` y la clave `clave_falsa`.
7. Haz clic en el botón principal de iniciar sesión.
8. Extrae el mensaje de error que te arroja el sistema y toma una captura de pantalla evidenciando el bloqueo.
9. **[Positive Testing]** Limpia los campos de texto.
10. Ingresa las credenciales maestras oficiales:
   - Usuario: `admin`
   - Clave: `@Jose13593380`
11. Haz clic nuevamente en iniciar sesión.
12. Verifica que el sistema te haya redirigido al panel de control (Dashboard).
13. Toma una captura de pantalla final de tu panel de administrador.
14. Escribe tu reporte comparando cómo reaccionó el sistema ante el intento de invitado, las credenciales falsas y finalmente las credenciales maestras.
