Título/ID 

005-- Autenticacion-basada-en-tokens-jwt
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Contexto
La aplicación de ticketera requiere un mecanismo seguro para autenticar al usuario administrador que consulta el dashboard y controlar el acceso a los diferentes endpoints de la API y recursos protegidos, manteniendo un esquema eficiente y desacoplado entre el backend y el frontend.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Decision
Se implementó un sistema de autenticación basado en **JSON Web Tokens (JWT)**. Tras un inicio de sesión exitoso, el servidor emite un token firmado digitalmente (válido por 8 horas) que el frontend almacena en localStorage y adjunta en la cabecera Authorization de cada petición subsiguiente. Las rutas de /api/tickets solo responden con un token válido; las contraseñas se guardan cifradas con bcrypt. Por el alcance del proyecto hay un único rol (administrador), así que no se implementó control por roles.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Consecuencias

Positivas: Arquitectura sin estado (*stateless*): el servidor no necesita almacenar sesiones activas en memoria, lo que facilita la escalabilidad.
    * Excelente integración con aplicaciones frontend basadas en componentes o SPAs (como Vue.js).
    * Permite transportar de forma segura información resumida sobre la identidad y permisos del usuario.
Negativas:  Requiere gestionar adecuadamente la expiración de los tokens y el almacenamiento seguro en el lado del cliente.
    * La revocación anticipada de un token antes de su vencimiento requiere lógica adicional (como listas negras o *refresh tokens*).
    * Guardar el token en localStorage lo deja expuesto si la página sufriera un ataque XSS. Como mejora futura se puede enviar en una cookie HttpOnly, que JavaScript no puede leer.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Estado

Aceptado

