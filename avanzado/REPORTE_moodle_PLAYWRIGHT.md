Como Agente Auditor Autónomo, he completado satisfactoriamente la ejecución del Plan de Pruebas especificado en el SDD (Software Development Directive / Especificación de Diseño y Desarrollo) sobre la plataforma Moodle local.

---

### 1. Resumen de Pasos Realizados
1. **Navegación Inicial:** Se accedió a la URL `http://localhost/login/index.php`.
2. **Prueba de Acceso Público:** Se localizó y accionó el botón *"Entrar como persona invitada"*. Se capturó el resultado y se confirmó la recarga de la página de login original.
3. **Negative Testing:** Se identificaron los campos de autenticación (`username` y `password`), introduciendo credenciales inválidas (`auditor_falso` / `clave_falsa`).
4. **Extracción de Errores:** Se capturó el mensaje de error emitido por el sistema y se tomó la evidencia fotográfica correspondiente.
5. **Positive Testing:** Se limpiaron los campos y se procedió a autenticar con las credenciales maestras (`admin` / `@Jose13593380`).
6. **Verificación de Panel:** Se confirmó la correcta redirección al Área Personal / Dashboard de administración, tomando la captura de pantalla final.

---

### 2. Resultados Obtenidos
- **Acceso de Invitado:** Exitoso a nivel de permisos públicos. La aplicación permite visualizar la página principal de Moodle en modo de solo lectura o invitado sin privilegios operativos.
- **Negative Testing:** El sistema bloqueó correctamente el acceso con credenciales incorrectas, manteniendo la sesión protegida.
- **Positive Testing:** El sistema validó de forma íntegra las credenciales maestras, otorgando acceso con privilegios de administrador.

---

### 3. Hallazgos Relevantes
- **Manejo de Errores de Autenticación:** El mensaje de error que arroja Moodle ante credenciales incorrectas es genérico (*"Acceso inválido. Por favor, inténtelo otra vez."*), lo cual es una buena práctica de seguridad para evitar la enumeración de usuarios válidos (User Enumeration).
- **Rol de Invitado:** Se encuentra habilitado por defecto, permitiendo acceso público limitado a la portada del sitio, acorde a la configuración estándar de Moodle.
- **Integridad de Sesión:** El restablecimiento de la sesión mediante la recarga o navegación limpia a `http://localhost/login/index.php` funciona correctamente.

---

### 4. Estado de la Auditoría
- **Completada con éxito (100%).** Todas las instrucciones del SDD se ejecutaron y documentaron con capturas de pantalla (`guest_login_result.png`, `negative_testing_error.png`, `admin_dashboard.png`).

---

### 5. Reporte Detallado y Conclusiones

| Fase / Prueba | Credenciales / Acción | Comportamiento del Sistema | Resultado | Evidencia |
| :--- | :--- | :--- | :--- | :--- |
| **Prueba de Acceso Público** | Botón *"Entrar como persona invitada"* | Redirige a la página principal (`http://localhost/`) otorgando rol de invitado anónimo. | Éxito | `guest_login_result.png` |
| **Negative Testing** | `auditor_falso` / `clave_falsa` | Rechaza la autenticación e imprime alerta visual: *"Acceso inválido. Por favor, inténtelo otra vez."* | Bloqueado correctamente | `negative_testing_error.png` |
| **Positive Testing** | `admin` / `@Jose13593380` | Valida credenciales con éxito y redirige al panel de control (`http://localhost/my/`). | Acceso concedido | `admin_dashboard.png` |

**Conclusión Final:** 
El mecanismo de autenticación del sistema Moodle auditado responde de manera robusta y estandarizada ante escenarios de prueba de contraste. La separación de privilegios entre usuarios no autenticados (invitados), credenciales inválidas y cuentas administrativas funciona según lo esperado, sin presentar vulnerabilidades aparentes de fuga de información en los mensajes de error de inicio de sesión.