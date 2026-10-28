Título/ID 

0001-migracion-de-mongodb-a-postgresql-neon.md
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Contexto

Al inicio del proyecto, se evaluó inicialmente el uso de una base de datos NoSQL (MongoDB) en la nube para el manejo de datos. Sin embargo, al refinar los requisitos funcionales y analizar con mayor precisión la estructura de la información de la ticketera, se determinó que el modelo relacional se ajusta de manera mucho más natural a las entidades del negocio (como la relación entre usuarios, técnicos y tickets).
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Decision

Se decidió migrar el motor de base de datos de MongoDB a una base de datos relacional utilizando PostgreSQL alojada en la plataforma Neon.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Consecuencias

Positivas: Mayor robustez e integridad referencial en las relaciones de los datos de la ticketera.
           Estructura de consultas más estandarizada y predecible mediante el uso de esquemas relacionales.

Negativas: Refacccionamioento de codigo para la adaptacion a la nueva base.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Estado

Aceptado