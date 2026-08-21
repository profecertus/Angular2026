# api-libros — Backend REST para el Módulo 7 (Consumo de APIs)

API REST en **NestJS** con persistencia **SQLite embebida** (`better-sqlite3` + TypeORM).
Reemplaza al backend emulado `angular-in-memory-web-api` de `sesion7-app` con un
servidor HTTP de verdad, sin cambiar una línea del código Angular.

## Nota sobre H2

H2 es una base de datos **Java**: corre dentro de la JVM y no tiene driver para Node,
así que no se puede usar desde NestJS (la única vía sería levantar H2 en modo servidor
PostgreSQL, y eso igual necesita Java instalado).

El equivalente directo en el ecosistema Node es **SQLite**:

| H2 (Java) | SQLite (Node) |
|---|---|
| `jdbc:h2:mem:testdb` | `database: ':memory:'` |
| `jdbc:h2:./data/libros` | `database: './libros.sqlite'` |
| `ddl-auto=create-drop` | `synchronize: true` |
| Sin servidor, embebida | Sin servidor, embebida |

Hoy usa `:memory:`, o sea la BD se crea vacía en cada arranque y se siembra con 5 libros.
Para que los datos sobrevivan al reinicio, cambia una línea en `src/app.module.ts`:

```ts
database: 'libros.sqlite',   // en vez de ':memory:'
```

## Correr

```bash
cd api-libros
npm install
npm run dev      # watch mode, escucha en http://localhost:8080
```

El puerto 8080 y el prefijo `api` no son casuales: calzan con
`environment.apiUrl = 'http://localhost:8080/api'` del front.

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/libros` | `Libro[]` (array plano) |
| GET | `/api/libros?titulo=clean` | `Libro[]` filtrado (contains, case-insensitive) |
| GET | `/api/libros?page=0&size=5` | `Pagina<Libro>` → `{ content, total, page, size }` |
| GET | `/api/libros/:id` | `Libro` · `404` si no existe |
| POST | `/api/libros` | `201` + el libro creado |
| PUT | `/api/libros/:id` | `200` + reemplazo completo |
| PATCH | `/api/libros/:id` | `200` + actualización parcial (ej. `{"precio":99}`) |
| DELETE | `/api/libros/:id` | `204` sin cuerpo |

El mismo `GET /api/libros` devuelve array plano o objeto paginado según si mandas `page`.
Así el código que ya escribimos en clase sigue funcionando y la paginación es opt-in.

### Probar con curl

```bash
curl http://localhost:8080/api/libros
curl "http://localhost:8080/api/libros?titulo=clean"
curl "http://localhost:8080/api/libros?page=0&size=2"

curl -X POST http://localhost:8080/api/libros \
  -H 'Content-Type: application/json' \
  -d '{"titulo":"Angular Signals a fondo","autor":"Edwin Barrientos","precio":120}'

curl -X PATCH http://localhost:8080/api/libros/1 \
  -H 'Content-Type: application/json' -d '{"precio":99}'

curl -X DELETE http://localhost:8080/api/libros/1
```

## Conectar el front (sesion7-app)

El front ya apunta a `http://localhost:8080/api`, pero mientras esté registrado el
emulado, éste **intercepta** las peticiones antes de que salgan al red. Para usar
esta API real, deja vacío el arreglo de providers de desarrollo:

```ts
// sesion7-app/src/environments/providers.ts
export const extraProviders: (Provider | EnvironmentProviders)[] = [];
```

Levanta los dos procesos en terminales separadas:

```bash
# terminal 1
cd api-libros && npm run dev      # :8080

# terminal 2
cd sesion7-app && npm start       # :4200
```

CORS está habilitado solo para `http://localhost:4200` (ver `src/main.ts`).

Ventaja didáctica de usar la API real: en la pestaña Network del navegador se ven las
peticiones HTTP de verdad, con sus códigos de estado (201, 204, 400, 404). Con el
emulado eso no se ve.

## Estructura

```
src/
  main.ts                        prefijo /api, CORS, ValidationPipe global
  app.module.ts                  conexión TypeORM a SQLite
  libros/
    libro.entity.ts              tabla 'libros' (mismo contrato que la interfaz Libro del front)
    libros.service.ts            lógica: listar, filtrar, paginar, CRUD, seed inicial
    libros.controller.ts         rutas HTTP
    libros.module.ts
    dto/crear-libro.dto.ts       validación con class-validator
    dto/actualizar-libro.dto.ts  PartialType -> sirve para PUT y PATCH
```

## Validación

`ValidationPipe` global con `whitelist` + `forbidNonWhitelisted`:

- `{"titulo":"ab"}` → `400` "El título necesita al menos 3 caracteres"
- `{"titulo":"Valido","hacker":"x"}` → `400` "property hacker should not exist"

Sirve para la clase: muestra que el backend **también** valida, no solo el
formulario reactivo de Angular. La validación del front es UX; la del back es la que
protege los datos.

## Advertencia de seguridad

Esta API **no tiene autenticación ni autorización**: cualquiera que alcance el puerto
8080 puede crear, editar y borrar libros. Es intencional para la clase (el tema de
tokens e interceptors es del Módulo 8). No la expongas fuera de `localhost` así como está.

## Ver el SQL en clase

`app.module.ts` tiene `logging: ['query', 'error']`, así que cada operación imprime el
SQL que genera TypeORM. Es útil para mostrar qué hace un `PUT` vs un `PATCH`.
Si ensucia mucho la consola, cámbialo a `logging: ['error']`.
