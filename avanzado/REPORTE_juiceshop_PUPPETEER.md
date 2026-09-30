# Reporte Forense de Auditoría de Seguridad e Inyección SQL (Nivel 1)

**URL Objetivo:** `https://demo.owasp-juice.shop/#/login`  
**Fecha de Auditoría:** Ejecución Automatizada Nivel 1  
**Tipo de Prueba:** Penetration Testing / Validación de Sanitización de Entradas en Autenticación  

---

## 1. Resumen Ejecutivo
Se ejecutó una auditoría automatizada sobre el formulario de autenticación de OWASP Juice Shop con el fin de evaluar la robustez de las consultas a base de datos frente a ataques de Inyección SQL (SQLi). Se introdujo un payload clásico de bypass de autenticación en el campo de correo electrónico. El sistema procesó la entrada y **permitió el acceso exitoso** al panel de usuario autenticado con privilegios de administrador (`admin@juice-sh.op`), confirmando la presencia de una vulnerabilidad crítica.

---

## 2. Metodología y Ejecución del Test

1. **Navegación:** Se accedió correctamente a la ruta de inicio de sesión (`#/login`) y se descartaron los diálogos/banners de cookies e información iniciales.
2. **Identificación de Campos:** Se localizaron los campos de entrada correspondientes al correo electrónico (`#email`) y la contraseña (`#password`).
3. **Inyección de Payload:** 
   - Campo *Email*: `' OR 1=1 --`
   - Campo *Password*: `auditoria123` (texto basura / inválido)
4. **Acción:** Se hizo clic en el botón de inicio de sesión (`#loginButton`).

---

## 3. Evidencia y Resultado Obtenido

* **Comportamiento de la Aplicación:** La aplicación no rechazó la petición ni arrojó un error de credenciales inválidas. En su lugar, redirigió al usuario de manera inmediata a la vista principal autenticada.
* **Inspección de Almacenamiento Local (Forensia):** Mediante inspección del navegador tras la redirección, se verificó la generación y almacenamiento de un token JWT válido (`localStorage.getItem('token')`), el cual contiene los datos decodificados del usuario administrador:
  ```json
  {
    "id": 1,
    "email": "admin@juice-sh.op",
    "role": "admin"
  }
  ```

---

## 4. Conclusión y Clasificación de la Vulnerabilidad

* **Payload Utilizado:** `' OR 1=1 --`
* **Clasificación:** **CRÍTICA**
* **Justificación:** La aplicación es vulnerable a Inyección SQL en el formulario de inicio de sesión. El código introducido alteró la lógica de la sentencia SQL original en el backend, haciendo que la condición de autenticación devuelva siempre *True* (1=1) y omitiendo la verificación de la contraseña mediante el operador de comentario (`--`). Como resultado, se logró una escalada de privilegios instantánea obteniendo una sesión activa con el rol de administrador.