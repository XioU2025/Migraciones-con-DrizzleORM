# Task Manager API

API REST construida con TypeScript, Express, PostgreSQL y Drizzle ORM. El recurso principal es `tasks`.

## Requisitos

- Node.js 20 o superior
- npm
- Una base de datos PostgreSQL (por ejemplo, Neon)

## Instalación

```bash
npm install
```

Copia `.env.example` como `.env` y configura tu conexión:

```env
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
PORT=3000
```

No subas `.env` a GitHub. El archivo `.env.example` no contiene secretos.

## Migraciones

Las migraciones versionadas se encuentran en `drizzle/` y se ejecutan en orden:

```bash
npm run db:migrate
```

- `0000_initial.sql`: crea la tabla `tasks` con identificador, título, descripción y fecha de creación.
- `0001_add_completed.sql`: evoluciona el esquema agregando `completed BOOLEAN NOT NULL DEFAULT false`.

Para generar una nueva migración después de modificar `src/db/schema.ts`:

```bash
npm run db:generate
```

Revisa el SQL generado y conserva tanto el SQL como los archivos de metadatos de `drizzle/` en Git. Luego ejecuta `npm run db:migrate`.

## Ejecutar la API

Modo desarrollo:

```bash
npm run dev
```

Compilar y ejecutar:

```bash
npm run build
npm start
```

La API estará en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Comprobar estado |
| GET | `/api/tasks` | Listar tareas |
| GET | `/api/tasks/:id` | Consultar una tarea |
| POST | `/api/tasks` | Crear una tarea |
| PATCH | `/api/tasks/:id` | Actualizar una tarea |
| DELETE | `/api/tasks/:id` | Eliminar una tarea |

### Ejemplo de creación

`POST /api/tasks`

```json
{
  "title": "Preparar entrega",
  "description": "Terminar API y evidencias"
}
```

### Ejemplo de actualización

`PATCH /api/tasks/1`

```json
{
  "completed": true
}
```

## Validaciones y códigos HTTP

- `200`: consulta, actualización o eliminación exitosa.
- `201`: registro creado.
- `400`: identificador o datos inválidos.
- `404`: ruta o tarea inexistente.
- `500`: error interno no controlado.

El título es obligatorio (1 a 120 caracteres), la descripción admite hasta 2000 caracteres y la actualización requiere al menos un campo válido. Se rechazan propiedades no permitidas.