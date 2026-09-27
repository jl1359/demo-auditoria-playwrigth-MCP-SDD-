# Contrato de Auditoría Intermedio: Registro de Usuario y Formularios
**URL Objetivo:** https://parabank.parasoft.com/parabank/register.htm

**Objetivo de la Auditoría (QA Flujo Complejo):**
Validar que el formulario de registro de nuevos clientes acepta entradas válidas, maneja múltiples campos simultáneos y completa el registro exitosamente.

**Instrucciones Detalladas:**
1. Navega a la página de registro del ParaBank.
2. Llena los siguientes campos con datos generados por ti (Ficticios):
   - First Name: `Agente`
   - Last Name: `Auditor`
   - Address: `123 AI Street`
   - City: `Tech City`
   - State: `CA`
   - Zip Code: `90210`
   - Phone: `555-1234`
   - SSN: `000-00-0000`
3. Inventa un nombre de usuario único (ej. `agente_test_01`) y una contraseña (`ClaveSegura123`).
4. Llena los campos "Username", "Password" y "Confirm Password" con tus credenciales inventadas.
5. Haz clic en el botón "Register".
6. Verifica si la página redirige a un mensaje de "Your account was created successfully" o si lanza un error de campos requeridos.
7. Redacta el reporte final de validación del formulario (Pass/Fail).
