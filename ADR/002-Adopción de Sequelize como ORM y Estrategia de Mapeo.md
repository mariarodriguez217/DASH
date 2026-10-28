Título/ID 

002-Adopción de Sequelize como ORM y Estrategia de Mapeo.md>
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

Aceptado