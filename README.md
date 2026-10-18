# 📊 Dashboard de Gestión de Tickets y Técnicos

Dashboard web que muestra el avance de un equipo de técnicos según los tickets que resolvieron: cuánto trabajo hay, quién lo está resolviendo, qué tan rápido y cómo evoluciona en el tiempo. Está pensado para que una persona de gestión pueda consultarlo de un vistazo, aun con miles de tickets cargados.

## 🎓 Sobre el proyecto

Proyecto desarrollado para la materia **Arquitectura Web** — **[UNPAZ / 2026 ]**.

El sistema separa claramente las capas de una arquitectura web moderna:

```
 ┌────────────┐    HTTP / JSON    ┌──────────────────┐    SQL (SSL)    ┌──────────────────┐
 │  Frontend  │ ────────────────▶ │  API REST        │ ──────────────▶ │  PostgreSQL      │
 │ (dashboard)│ ◀──────────────── │  Node + Express  │ ◀────────────── │  (Neon)          │
 └────────────┘                   └──────────────────┘                 └──────────────────┘
```

### 👥 Equipo

| Integrante | Rol | Responsabilidad |
|---|---|---|
| **Clara Cantarino** | DevOps | Base de datos en la nube, variables de entorno, despliegue y puesta en línea |
| **María Rodríguez** | Backend | API REST, lógica de negocio y consultas a la base de datos |
| **Bárbara Carrizo** | Frontend | Interfaz del dashboard, gráficos, tablas y consumo de la API |


## 🔗 Links

| Recurso | URL |
|---|---|
| 🌐 Aplicación desplegada | AQUI IRIA LA URL, SI TUVIERA UNAAA |
| ⚙️ API (backend) | AQUI IRIA LA URL, SI TUVIERA UNAAA  |
| 📁 Repositorio backend | AQUI IRIA LA URL, SI TUVIERA UNAAA  |
| 📁 Repositorio frontend | AQUI IRIA LA URL, SI TUVIERA UNAAA  |


## ✨ Funcionalidades

- **KPIs generales:** total de tickets, realizados, en progreso y pendientes, porcentajes, tiempo promedio de resolución y tickets atrasados.
- **Ranking por técnico:** tickets totales, resueltos, porcentaje de resolución y días promedio de resolución.
- **Listado de tickets** paginado, con filtros por técnico, estado, prioridad, categoría y rango de fechas.
- **Alta de tickets** mediante la API.
- Pensado para trabajar con un volumen alto de datos (10.000 tickets de prueba).



## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | [React] |
| Backend | Node.js + Express |
| Cliente de base de datos | `pg` (node-postgres) |
| Base de datos | PostgreSQL en [Neon](https://neon.com) |
| Configuración | `dotenv` |
| Despliegue | [Vercel + github] |

## 🗂️ Estructura del backend

```
DASH/
├── server.js                     # punto de entrada
├── package.json
├── .env                          # variables privadas (NO se sube al repo)
└── src/
    ├── config/
    │   └── db.js                 # conexión (Pool) a PostgreSQL
    ├── controllers/
    │   └── ticketController.js   # lógica de tickets y métricas
    └── routes/
        └── tickets.js            # definición de rutas
    └── middlewares/
        └── authMiddleware.js            
```

## 🧱 Modelo de datos

```
tecnicos                         tickets
├── id (PK)                      ├── id (PK)
├── nombre                       ├── titulo
├── email (único)                ├── descripcion
├── especialidad                 ├── tecnico_id (FK → tecnicos.id)
└── telefono                     ├── estado: pendiente | en_progreso | realizado
                                 ├── prioridad: baja | media | alta
usuarios                         ├── categoria: Software | Redes | Hardware | Accesos
├── id (PK)                      ├── fecha_creacion
├── nombre                       └── fecha_resolucion (nula si no está resuelto)
├── email (único)
└── password (hash)
```

Un técnico tiene muchos tickets; cada ticket pertenece a un solo técnico. 

## 🚀 Cómo ejecutarlo en tu computadora

### Requisitos

- [Node.js](https://nodejs.org) 18 o superior
- Una base PostgreSQL. La forma más simple es un proyecto gratuito en [Neon](https://neon.com)

### 1. Clonar e instalar

```bash
git clone [URL-DEL-REPO-BACKEND]
cd [NOMBRE-DE-LA-CARPETA]
npm install
```

### Levantar el servidor

```bash
node server.js
```

En la consola tienen que aparecer:

```
Servidor corriendo en el puerto 3000
¡Conectado exitosamente a Neon (PostgreSQL)!
```

### 5. Probar que funciona

Abrí en el navegador:

| URL | Resultado esperado |
|---|---|
| `http://localhost:3000/` | Mensaje "API de la Ticketera funcionando" |
| `http://localhost:3000/api/tickets/metricas` | JSON con KPIs y ranking por técnico (`total: 10000`) |
| `http://localhost:3000/api/tickets?limit=5` | Primeros 5 tickets con el nombre del técnico |

## 🔌 Documentación de la API

Base URL local: `http://localhost:3000/api`

### `GET /tickets/metricas`

Devuelve los indicadores generales y el desempeño de cada técnico.

```json
{
  "total": 10000,
  "realizados": 7000,
  "en_progreso": 1500,
  "pendientes": 1500,
  "porcentaje_realizados": 70.0,
  "porcentaje_pendientes": 15.0,
  "dias_promedio_resolucion": 3.4,
  "atrasados": 120,
  "porTecnico": [
    {
      "id": 1,
      "nombre": "Clara Cantarino",
      "total": 4000,
      "realizados": 3400,
      "porcentaje": 85.0,
      "dias_promedio": 1.9
    }
  ]
}
```

`atrasados` cuenta los tickets sin resolver con más de 30 días de antigüedad. Los valores de ejemplo son ilustrativos.

### `GET /tickets`

Listado paginado. Parámetros opcionales de query:

| Parámetro | Descripción | Ejemplo |
|---|---|---|
| `page` | Número de página (por defecto 1) | `page=2` |
| `limit` | Resultados por página (por defecto 20, máximo 100) | `limit=50` |
| `tecnico_id` | Filtra por técnico | `tecnico_id=1` |
| `estado` | `pendiente`, `en_progreso` o `realizado` | `estado=pendiente` |
| `prioridad` | `baja`, `media` o `alta` | `prioridad=alta` |
| `categoria` | `Software`, `Redes`, `Hardware` o `Accesos` | `categoria=Redes` |
| `desde` / `hasta` | Rango de fecha de creación | `desde=2026-08-01` |

Ejemplo: `/api/tickets?page=1&limit=20&estado=pendiente&tecnico_id=2`

Respuesta:

```json
{
  "data": [
    {
      "id": 9876,
      "titulo": "Sin conexión a internet",
      "descripcion": "Ticket de prueba #9876 reportado por un usuario.",
      "estado": "pendiente",
      "prioridad": "alta",
      "categoria": "Redes",
      "fecha_creacion": "2026-10-14T18:22:10.000Z",
      "fecha_resolucion": null,
      "tecnico_id": 2,
      "tecnico": "Bárbara Carrizo"
    }
  ],
  "total": 1500,
  "page": 1,
  "limit": 20,
  "totalPages": 75
}
```

### `POST /tickets`

Crea un ticket. Body en JSON:

```json
{
  "titulo": "La impresora no imprime",
  "descripcion": "No responde desde esta mañana",
  "tecnico_id": 3,
  "estado": "pendiente",
  "prioridad": "media",
  "categoria": "Hardware"
}
```

Obligatorios: `titulo`, `descripcion` y `tecnico_id`. Si no se envían, `estado` queda en `pendiente` y `prioridad` en `media`. Responde `201` con el ticket creado, o `400` si falta un dato o el técnico no existe.

## 🤝 Guía por rol

**Frontend (Bárbara):** consumir `GET /api/tickets/metricas` para los KPIs y el ranking, y `GET /api/tickets` para la tabla. La URL de la API debe ir en una variable de entorno, para poder cambiarla entre local y producción.

**Backend (María):** cualquier consulta nueva se agrega en `src/controllers/` y se expone desde `src/routes/`. Siempre usar consultas parametrizadas (`$1`, `$2`...) y nunca concatenar valores del usuario dentro del SQL.

**DevOps (Clara):** la base vive en Neon; el backend y el frontend se despliegan por separado. En producción hay que cargar las variables de entorno en el panel de la plataforma, usar un `JWT_SECRET` distinto al local y limitar CORS al dominio del frontend.

## ☁️ Despliegue

1. **Base de datos:** proyecto en Neon con `schema.sql` y `seed.sql` ejecutados.
2. **Backend:** servicio web en [COMPLETAR: Render / Railway] con comando de inicio `node server.js` y las variables `DATABASE_URL`, `JWT_SECRET` y `PORT`.
3. **Frontend:** [COMPLETAR: Vercel / Netlify], con la variable de la URL del backend apuntando al servicio desplegado.
4. Verificar que el backend responde en `/api/tickets/metricas` desde la URL pública.

## 🔒 Seguridad

- Las credenciales viven en `.env`, que está en `.gitignore` y nunca se sube al repositorio.
- Todas las consultas a la base están parametrizadas para evitar inyección SQL.
- La conexión a la base usa SSL.
- Autenticación del administrador con JWT y contraseñas almacenadas con hash (bcrypt).

## 📄 Licencia

Proyecto académico. Uso educativo.