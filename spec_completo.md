# Contrato de Auditoría Completa: OWASP Juice Shop (E-commerce)
**URL Objetivo:** https://demo.owasp-juice.shop/#/login

**Objetivo de la Auditoría:**
Verificar la robustez del sistema de autenticación contra ataques básicos de Inyección SQL (SQLi) y evaluar la respuesta del sistema.

**Fase 1: Preparación del Entorno**
1. Navega a la URL objetivo (página de login).
2. Si aparece un banner de bienvenida ("Welcome to OWASP Juice Shop") o un aviso de cookies, haz clic en el botón "Dismiss" o "Me want it!" para cerrarlos y limpiar la pantalla.

**Fase 2: Auditoría de Inyección SQL en Autenticación**
3. Localiza el campo de "Email" y el campo de "Password".
4. En el campo "Email", introduce el siguiente payload clásico de inyección SQL para intentar forzar el acceso como administrador: 
   `' OR 1=1 --`
5. En el campo "Password", introduce cualquier texto falso, por ejemplo: `clave123`.
6. Haz clic en el botón "Log in".

**Fase 3: Recolección de Evidencias y Reporte**
7. Observa la reacción del sistema. ¿El sistema mostró un mensaje de error rojo de "Invalid email or password"? ¿O permitió el acceso a la cuenta del administrador mostrando su perfil?
8. Toma una captura de pantalla del resultado en la interfaz.
9. Redacta el reporte de auditoría indicando:
   - Los pasos ejecutados.
   - Si la vulnerabilidad de Inyección SQL fue exitosa o si el sistema la bloqueó.
   - Tu recomendación técnica para el equipo de desarrollo.
