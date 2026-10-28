Título/ID 

0004-autenticacion-basada-en-tokens-jwt
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Contexto
La aplicación de ticketera requiere un mecanismo seguro para autenticar usuarios (como administradores y operadores) y controlar el acceso a los diferentes endpoints de la API y recursos protegidos, manteniendo un esquema eficiente y desacoplado entre el backend y el frontend.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Decision
Se implementó un sistema de autenticación basado en **JSON Web Tokens (JWT)**. Tras un inicio de sesión exitoso, el servidor emite un token firmado digitalmente que el frontend almacena y adjunta en las cabeceras HTTP de cada petición subsiguiente para validar la sesión y los roles de usuario.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Consecuencias

Positivas: Arquitectura sin estado (*stateless*): el servidor no necesita almacenar sesiones activas en memoria, lo que facilita la escalabilidad.
    * Excelente integración con aplicaciones frontend basadas en componentes o SPAs (como Vue.js).
    * Permite transportar de forma segura información resumida sobre la identidad y permisos del usuario.
Negativas:  Requiere gestionar adecuadamente la expiración de los tokens y el almacenamiento seguro en el lado del cliente.
    * La revocación anticipada de un token antes de su vencimiento requiere lógica adicional (como listas negras o *refresh tokens*).
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Estado

Aceptado

