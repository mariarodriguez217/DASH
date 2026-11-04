# 006-- Despliegue-hibrido-docker-render-y-vercel

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Contexto
El sistema de dashboard de métricas internas requiere una estrategia de despliegue desacoplada que garantice independencia entre frontend y backend, paridad entre el entorno de desarrollo y producción, e integración continua (CI/CD) automatizada desde el repositorio. El frontend está desarrollado como una SPA en Vue 3 con Vite y requiere ser distribuido en un CDN estático, mientras que el backend en Node.js/Express debe ejecutarse dentro de un entorno contenerizado sobre un servidor con HTTPS. Esto exige definir la tecnología de hosting de cada parte y un mecanismo limpio de comunicación entre ambos servicios alojados en plataformas distintas.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Decision
Se implementó una estrategia de despliegue híbrida y contenerizada dividida en los siguientes pilares:

1. **Backend (Render + Docker):** Se empaquetó la aplicación Node.js/Express en una imagen Docker (`Dockerfile`) basada en Node Alpine. Render compila y despliega automáticamente la imagen ante cada push a la rama principal en GitHub, garantizando que el backend corra exactamente igual que en el entorno local.
2. **Frontend (Vercel):** Se alojó la SPA en Vercel para aprovechar el build automático y la distribución mediante CDN global. La URL base de la API se parametriza a través de la variable `VITE_API_URL`, definida en el cliente HTTP (`src/api/cliente.js`) apuntando al prefijo `/api` de producción (`https://dashboar-aw.onrender.com/api`) e inyectada en las variables de entorno de Vercel.
3. **CORS:** Se configuró el middleware de CORS en el servidor Node.js para permitir peticiones HTTP provenientes del dominio de Vercel.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Consecuencias

### Positivas:
- Paridad total de entornos gracias a la contenerización del backend con Docker, permitiendo ejecutar `docker compose` en local sin discrepancias con producción.
- Automatización del pipeline de CI/CD: cada push a GitHub desencadena el build del contenedor en Render y el despliegue del frontend en Vercel de forma independiente.
- Desacoplamiento de infraestructura: el frontend consume la API mediante la variable `VITE_API_URL`, lo que permite migrar el dominio o servidor del backend sin modificar el código fuente.
- Alta disponibilidad y velocidad en la entrega del frontend al servirse como artefacto estático desde la red CDN de Vercel.

### Negativas:
- Latencia de inicio en frío (*cold start*) en el backend alojado en Render al recibir la primera petición tras un período de inactividad (en la capa gratuita).
- Inflexibilidad durante el build si no se incluye el prefijo `/api` en la variable `VITE_API_URL`, lo que puede derivar en errores 404 si la URL base no coincide con los endpoints del backend.
- Administración adicional en la configuración del middleware de CORS para asegurar que el backend acepte conexiones únicamente desde el dominio desplegado por Vercel.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Estado

Aceptado