Título/ID 

004-- Adopción de Sequelize como ORM y Estrategia de Mapeo.md>
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Contexto
Tras migrar a una base de datos relacional (PostgreSQL), requeríamos una herramienta de mapeo objeto-relacional (ORM) para interactuar con la base de datos desde Node.js de forma estructurada, facilitando la gestión de migraciones, modelos y relaciones complejas de la ticketera.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Decision

Se adoptó **Sequelize** como el ORM oficial del proyecto.
Para resolver el modelado de clases y entidades con jerarquías, se implementó una estrategia de **herencia de tablas** (mapeando la orientación a objetos a las tablas relacionales de PostgreSQL mediante las asociaciones y configuraciones nativas del ORM).
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Consecuencias

Positivas: Abstracción limpia de las consultas SQL y unificación del código.
          Estructura organizada para manejar entidades con atributos compartidos o jerárquicos gracias a la estrategia de herencia de tablas.
Negativas: Curva de aprendizaje para configurar correctamente las asociaciones para evitar consultas excesivas.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Estado

Reemplazado 

En la implementación final los endpoints no usan Sequelize. Las consultas se escriben en SQL con el driver pg (node-postgres), siempre parametrizadas ($1, $2...) para evitar inyección SQL. El motivo es que las métricas del dashboard se calculan con agregaciones propias de PostgreSQL (COUNT ... FILTER, AVG sobre intervalos de fechas, GROUP BY por técnico), que resultan más claras y eficientes escritas directamente en SQL que a través del ORM. La estrategia de herencia de tablas no llegó a implementarse: el modelo final tiene tres tablas simples (tecnicos, tickets, usuarios). Los modelos de Sequelize quedan en src/models/ como referencia del esquema.