Título/ID 

001-- Arquitectura.md
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Contexto

El sistema es de uso interno, diseñado para procesar un volumen alto de datos.  Sus requerimientos funcionales son directos y acotados: cálculo de KPIs generales, generación de rankings por técnico, listado paginado con filtros avanzados y alta de registros. Para este tipo de aplicación interna orientada a la visualización rápida de métricas, se evaluó cómo estructurar la base del código y su despliegue.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Decision

Se optó por implementar una arquitectura monolítica, centralizando la lógica de negocio, las rutas de la API (Node.js con Express) y la conexión a la base de datos (PostgreSQL en Neon) en una única aplicación unificada.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Consecuencias

Positivas: 
Simplicidad de implementación y despliegue: Al tratarse de un monolito, todo el código del servidor reside y se gestiona en un entorno unificado, lo que simplifica notablemente el desarrollo local y las pruebas.


Negativas: Escalabilidad vertical: Si el sistema creciera exponencialmente en múltiples direcciones de negocio, escalar requeriría replicar la aplicación completa en lugar de aislar componentes específicos de alta demanda.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Estado

Aceptado