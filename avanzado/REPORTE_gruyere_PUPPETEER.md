# Reporte de Auditoría Avanzada: Robo de Sesión (Google Gruyere)

**Fecha:** 24 de Mayo, 2024  
**Objetivo:** `https://google-gruyere.appspot.com/start`  
**Instancia Asignada:** `https://google-gruyere.appspot.com/622581990832182752688816596956377948583/`  
**Auditor:** Agente Auditor Autónomo  

---

## 1. Resumen Ejecutivo
Se realizó una auditoría de seguridad sobre la plataforma intencionalmente vulnerable **Google Gruyere** para evaluar los mecanismos de gestión y cifrado de sesiones (`session management`). Mediante la interacción automatizada con la instancia de pruebas, se registró un nuevo usuario, se autenticó exitosamente y se procedió a inspeccionar las cookies del navegador mediante ejecución de código JavaScript en cliente (`document.cookie`).

---

## 2. Metodología y Pasos Ejecutados

1. **Instanciación:** Se accedió a la URL inicial de Gruyere (`/start`) para generar una máquina de pruebas y se siguió la redirección a la URL única de la instancia (`/622581990832182752688816596956377948583/`).
2. **Registro de Usuario:** Se navegó a la sección de registro (`newaccount.gtl`) y se creó el usuario de prueba `hacker_ai` con la contraseña `1234`.
3. **Autenticación (Login):** Se ingresó a la plataforma utilizando las credenciales recién creadas en la ruta `/login`.
4. **Extracción de Cookies:** Se ejecutó una evaluación de JavaScript (`document.cookie`) para capturar las cookies activas en la sesión del navegador.

---

## 3. Evidencia Recolectada

El valor exacto recuperado de las cookies del navegador fue:

```text
GRUYERE=10850514|hacker_ai||author; GRUYERE_ID=622581990832182752688816596956377948583
```

---

## 4. Análisis Técnico y Conclusiones

* **Análisis de la cookie `GRUYERE`:**  
  La cookie contiene el valor `10850514|hacker_ai||author`. Al analizar la estructura de esta cadena, se observa que está compuesta por campos delimitados por tuberías (`|`):
  * `10850514`: Identificador o token numérico de sesión/secuencia.
  * `hacker_ai`: El nombre de usuario en texto plano (`uid`).
  * Campos vacíos correspondientes a metadatos adicionales.
  * `author`: El rol del usuario dentro de la aplicación.

* **¿Texto plano, Base64 o Cifrado?:**  
  La cookie **no está cifrada ni codificada**. Los datos críticos de la sesión (como el nombre de usuario y el rol) se exponen completamente en **texto plano**, separados por un delimitador simple.

* **Conclusión Final:**  
  La gestión de sesión de Google Gruyere **es altamente vulnerable** por diseño (Inseguridad por Diseño / *Insecure Deserialization / Weak Session Management*). 
  * Un atacante que logre leer las cookies (por ejemplo, a través de una vulnerabilidad de Cross-Site Scripting - XSS) puede extraer de forma inmediata el nombre de usuario y su rol.
  * Al no existir un mecanismo de cifrado o firma robusto (como JSON Web Tokens con claves secretas o sesiones almacenadas únicamente en el servidor con un identificador aleatorio opaco), la cookie es susceptible a ataques de manipulación e suplantación de identidad (*Session Tampering* / *Privilege Escalation*).