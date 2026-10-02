# Contrato de Auditoría Avanzado: Seguridad e Inyección SQL
**URL Objetivo:** https://demo.owasp-juice.shop/#/login

**Objetivo de la Auditoría:**
Ejecutar una prueba de penetración automatizada (Pentesting) de Nivel 1 para buscar vulnerabilidades en los formularios de autenticación.

**Instrucciones de Auditoría:**
1. Navega a la URL de inicio de sesión del Juice Shop.
2. Si te aparece un banner o pop-up de cookies, ignóralo o ciérralo.
3. Identifica el campo de correo electrónico y el campo de contraseña.
4. Para auditar la sanitización de la base de datos, inyecta el siguiente código SQL en el campo de correo: `' OR 1=1 --`
5. En el campo de contraseña, escribe texto basura: `auditoria123`
6. Haz clic en el botón de iniciar sesión ("Log in").
7. Evalúa la respuesta de la página: Verifica si aparece un mensaje de error o si el sistema permite la entrada y muestra el ícono del carrito de compras/perfil de usuario.
8. Redacta un reporte forense indicando el payload utilizado, el resultado obtenido y clasifica si la vulnerabilidad es "Crítica" (si logró entrar) o "Segura" (si lo bloqueó).

