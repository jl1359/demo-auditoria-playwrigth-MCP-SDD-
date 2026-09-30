### Reporte de Auditoría Autónomo: Moodle Localhost

**URL Objetivo:** `http://localhost/login/index.php`  
**Fecha/Hora:** Sesión de Auditoría Automatizada en tiempo real  
**Agente Auditor:** Autonomous Audit Agent

---

### 1. Resumen Ejecutivo
Se ejecutó una prueba de contraste (Negative & Positive Testing) sobre el formulario de autenticación local de la instancia de Moodle en ejecución local. El objetivo principal fue validar el comportamiento del sistema ante diferentes escenarios de acceso: acceso público/invitado, credenciales no válidas (Negative Testing) y credenciales de administrador maestras (Positive Testing).

---

### 2. Detalle de Pruebas y Resultados

#### A. Prueba de Acceso Público (Guest Access)
* **Acción:** Se localizó e interactuó con el botón de acceso público identificado como `"Entrar como persona invitada"` (`#loginguestbtn`).
* **Comportamiento del Sistema:** Moodle permitió el acceso inmediato con privilegios limitados de invitado, redirigiendo correctamente al sitio sin solicitar claves adicionales.
* **Evidencia visual:** Se capturó la pantalla correspondiente (`guest_login_result`).
* **Limpieza de sesión:** Se recargó explícitamente la página de autenticación (`http://localhost/login/index.php`) para invalidar el estado del invitado antes de continuar con la siguiente fase.

#### B. Negative Testing (Credenciales Inválidas)
* **Acción:** Se introdujeron credenciales ficticias en los campos de formulario:
  * Usuario (`#username`): `auditor_falso`
  * Contraseña (`#password`): `clave_falsa`
* **Acción posterior:** Se hizo clic en el botón principal de acceso (`#loginbtn`).
* **Comportamiento del Sistema:** Moodle rechazó el intento de inicio de sesión de manera estricta y arrojó el mensaje de error estándar de seguridad:  
  > *"Acceso inválido. Por favor, inténtelo otra vez."*
* **Evidencia visual:** Captura de pantalla guardada como `negative_testing_error`.

#### C. Positive Testing (Credenciales Maestras / Administrador)
* **Acción:** Se limpiaron los campos del formulario y se ingresaron las credenciales maestras autorizadas:
  * Usuario (`#username`): `admin`
  * Contraseña (`#password`): `@Jose13593380`
* **Acción posterior:** Se envió el formulario haciendo clic en el botón de acceso.
* **Comportamiento del Sistema:** El sistema autenticó de forma exitosa y redirigió automáticamente al panel de control (`Dashboard` / Área personal, URL: `http://localhost/my/`).
* **Evidencia visual:** Captura de pantalla final almacenada como `dashboard_admin`, evidenciando el acceso con privilegios de administrador.

---

### 3. Conclusiones y Conclusiones de Auditoría

1. **Gestión de Invitados:** El mecanismo de acceso como invitado funciona según lo esperado en Moodle, permitiendo navegación pública restringida sin comprometer cuentas privilegiadas.
2. **Robustez ante Credenciales Eróneas:** El control de autenticación local bloqueó de forma efectiva los intentos con credenciales falsas (`auditor_falso`), previniendo fugas de información innecesarias en el mensaje de error (evitando diferenciar si el usuario existe o no, mitigando riesgos de enumeración de usuarios).
3. **Control de Acceso Administrativo:** Las credenciales maestras proporcionadas validaron satisfactoriamente la identidad del administrador (`admin`), otorgando acceso completo al panel de control de la plataforma.