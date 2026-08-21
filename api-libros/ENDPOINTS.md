# Guía de ejecución y endpoints — api-libros

Referencia rápida para levantar la API y probar cada endpoint.
Todas las respuestas de este documento son salidas reales del servidor.

---

## 1. Requisitos

| Herramienta | Versión | Verificar con |
|---|---|---|
| Node.js | 22.x o superior | `node -v` |
| npm | 10.x | `npm -v` |
| curl | cualquiera | `curl --version` |

No necesitas instalar ninguna base de datos: SQLite viene embebida en el paquete
`better-sqlite3`.

---

## 2. Levantar la API

```bash
cd /home/edwin/MyDocuments/NH-angular/Modulo07/Practica/api-libros

npm install     # solo la primera vez
npm run dev     # modo watch: recompila al guardar
```

Salida esperada:

```
[Nest] LOG [RouterExplorer] Mapped {/api/libros, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/libros/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/libros, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/libros/:id, PUT} route
[Nest] LOG [RouterExplorer] Mapped {/api/libros/:id, PATCH} route
[Nest] LOG [RouterExplorer] Mapped {/api/libros/:id, DELETE} route
[Nest] LOG [NestApplication] Nest application successfully started

  API de libros lista en http://localhost:8080/api/libros
  Persistencia: SQLite en memoria (se reinicia con el proceso)
```

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Watch mode. Es el que usas en clase. |
| `npm start` | Arranca una vez, sin watch. |
| `npm run build` | Compila a `dist/`. |
| `npm run start:prod` | Corre lo compilado (`node dist/main`). |
| `PORT=3000 npm start` | Cambia el puerto (por defecto 8080). |

### Detener el servidor

`Ctrl+C` en la terminal. Si quedó un proceso colgado ocupando el puerto:

```bash
pkill -f api-libros
```

Ojo con esto: `pkill -f "nest start"` **no basta**. El watch mode lanza un proceso
hijo (`node .../dist/main`) que es el que realmente escucha el puerto, y matar
solo al padre lo deja vivo. Verifica que quedó libre:

```bash
ss -ltn | grep 8080     # sin salida = puerto libre
```

Al reiniciar, la base se recrea vacía y se vuelve a sembrar con los 5 libros
iniciales (es SQLite en memoria).

---

## 3. URL base

```
http://localhost:8080/api
```

El prefijo `api` se define con `setGlobalPrefix('api')` en `src/main.ts`.
Coincide con `environment.apiUrl` del front, así el Angular no cambia.

---

## 4. Endpoints

### Resumen

| # | Método | Ruta | Éxito | Errores posibles |
|---|---|---|---|---|
| 1 | GET | `/api/libros` | 200 | — |
| 2 | GET | `/api/libros?titulo=texto` | 200 | — |
| 3 | GET | `/api/libros?page=0&size=5` | 200 | — |
| 4 | GET | `/api/libros/:id` | 200 | 404 |
| 5 | POST | `/api/libros` | 201 | 400 |
| 6 | PUT | `/api/libros/:id` | 200 | 400, 404 |
| 7 | PATCH | `/api/libros/:id` | 200 | 400, 404 |
| 8 | DELETE | `/api/libros/:id` | 204 | 404 |

---

### 1. Listar todos

```bash
curl http://localhost:8080/api/libros
```

Devuelve un **array plano**, que es lo que consume `LibroService.listar()`:

```json
[
  {"id":1,"titulo":"Clean Code","autor":"Robert C. Martin","descripcion":"Guía de artesanía de software y código legible.","disponible":true,"precio":129.9},
  {"id":2,"titulo":"El Programador Pragmático","autor":"Hunt & Thomas","descripcion":"Clásico sobre oficio, herramientas y pragmatismo.","disponible":true,"precio":149},
  {"id":3,"titulo":"Refactoring","autor":"Martin Fowler","descripcion":"Cómo mejorar el diseño del código existente.","disponible":false,"precio":189.5},
  {"id":4,"titulo":"Domain-Driven Design","autor":"Eric Evans","descripcion":"Modelar software alrededor del dominio del negocio.","disponible":true,"precio":210},
  {"id":5,"titulo":"Angular en Profundidad","autor":"New Horizons","descripcion":"Material del curso de Desarrollo Web con Angular.","disponible":true,"precio":99}
]
```

En Angular:

```ts
listar(): Observable<Libro[]> {
  return this.http.get<Libro[]>(this.url);
}
```

---

### 2. Filtrar por título

Búsqueda *contains*, insensible a mayúsculas. Alimenta el buscador con
autocompletado de la Sesión 6.

```bash
curl "http://localhost:8080/api/libros?titulo=clean"
```

```json
[{"id":1,"titulo":"Clean Code","autor":"Robert C. Martin","descripcion":"Guía de artesanía de software y código legible.","disponible":true,"precio":129.9}]
```

En Angular, con `HttpParams`:

```ts
buscar(termino: string): Observable<Libro[]> {
  const params = new HttpParams().set('titulo', termino);
  return this.http.get<Libro[]>(this.url, { params });
}
```

---

### 3. Listar paginado

Si mandas `page`, la respuesta cambia de array a objeto `Pagina<T>`.
Sin `page`, sigue siendo array plano. Así la paginación es opt-in y no rompe
el código que ya escribimos en clase.

```bash
curl "http://localhost:8080/api/libros?page=0&size=2"
```

```json
{
  "content": [
    {"id":1,"titulo":"Clean Code","autor":"Robert C. Martin","descripcion":"Guía de artesanía de software y código legible.","disponible":true,"precio":129.9},
    {"id":2,"titulo":"El Programador Pragmático","autor":"Hunt & Thomas","descripcion":"Clásico sobre oficio, herramientas y pragmatismo.","disponible":true,"precio":149}
  ],
  "total": 5,
  "page": 0,
  "size": 2
}
```

| Param | Default | Notas |
|---|---|---|
| `page` | — | Base 0. Si no lo mandas, no hay paginación. |
| `size` | 5 | Mínimo 1. |
| `titulo` | — | Se puede combinar: `?titulo=a&page=0&size=3`. |

En Angular (reto 3 de la Práctica 2):

```ts
export interface Pagina<T> {
  content: T[];
  total: number;
  page: number;
  size: number;
}

listarPaginado(page: number, size: number): Observable<Pagina<Libro>> {
  const params = new HttpParams().set('page', page).set('size', size);
  return this.http.get<Pagina<Libro>>(this.url, { params });
}
```

`total` es lo que necesita el `mat-paginator` para calcular cuántas páginas hay.

---

### 4. Obtener uno por id

```bash
curl http://localhost:8080/api/libros/3
```

```json
{"id":3,"titulo":"Refactoring","autor":"Martin Fowler","descripcion":"Cómo mejorar el diseño del código existente.","disponible":false,"precio":189.5}
```

Si no existe, `404`:

```bash
curl -i http://localhost:8080/api/libros/999
```

```json
{"message":"No existe el libro con id 999","error":"Not Found","statusCode":404}
```

En Angular (reto 3 de la Práctica 1):

```ts
obtener(id: number): Observable<Libro> {
  return this.http.get<Libro>(`${this.url}/${id}`);
}
```

---

### 5. Crear (POST)

```bash
curl -X POST http://localhost:8080/api/libros \
  -H 'Content-Type: application/json' \
  -d '{"titulo":"Angular Signals a fondo","autor":"Edwin Barrientos","precio":120}'
```

Responde `201 Created` con el recurso creado, incluido el `id` que generó la BD:

```json
{"id":6,"titulo":"Angular Signals a fondo","autor":"Edwin Barrientos","descripcion":null,"disponible":true,"precio":120}
```

#### Cuerpo aceptado

| Campo | Tipo | Obligatorio | Default | Validación |
|---|---|---|---|---|
| `titulo` | string | sí | — | mínimo 3 caracteres |
| `autor` | string | no | `null` | — |
| `descripcion` | string | no | `null` | — |
| `disponible` | boolean | no | `true` | — |
| `precio` | number | no | `0` | ≥ 0 |

El `id` no se envía: lo asigna la base de datos.

---

### 6. Reemplazar (PUT)

PUT reemplaza el recurso **completo**: los campos que no mandes vuelven a su
valor por defecto. Esa es la semántica correcta de PUT.

```bash
curl -X PUT http://localhost:8080/api/libros/6 \
  -H 'Content-Type: application/json' \
  -d '{"titulo":"Angular Signals (2da ed.)","autor":"Edwin B.","disponible":false,"precio":135}'
```

```json
{"id":6,"titulo":"Angular Signals (2da ed.)","autor":"Edwin B.","descripcion":null,"disponible":false,"precio":135}
```

Nota que `descripcion` quedó en `null` porque no se envió.

---

### 7. Actualizar parcial (PATCH)

PATCH toca **solo** los campos enviados. Es el reto 2 de la Práctica 2:
actualizar únicamente el precio.

```bash
curl -X PATCH http://localhost:8080/api/libros/6 \
  -H 'Content-Type: application/json' \
  -d '{"precio":99}'
```

```json
{"id":6,"titulo":"Angular Signals (2da ed.)","autor":"Edwin B.","descripcion":null,"disponible":false,"precio":99}
```

Cambió el precio y nada más. En Angular:

```ts
actualizarPrecio(id: number, precio: number): Observable<Libro> {
  return this.http.patch<Libro>(`${this.url}/${id}`, { precio });
}
```

**PUT vs PATCH** es la comparación que vale mostrar en clase: mismo id, mismo
resultado visible, pero el PUT borró la descripción y el PATCH no. Con
`logging: ['query']` activo se ve el SQL de cada uno en la consola del backend.

---

### 8. Borrar (DELETE)

```bash
curl -i -X DELETE http://localhost:8080/api/libros/6
```

Responde `204 No Content`, **sin cuerpo**. Por eso en el servicio Angular se
tipa como `void`:

```ts
borrar(id: number): Observable<void> {
  return this.http.delete<void>(`${this.url}/${id}`);
}
```

Repetir el DELETE del mismo id devuelve `404`.

---

## 5. Validación: errores que devuelve el backend

El `ValidationPipe` global usa `whitelist` + `forbidNonWhitelisted`.

Título muy corto:

```bash
curl -X POST http://localhost:8080/api/libros \
  -H 'Content-Type: application/json' -d '{"titulo":"ab"}'
```

```json
{"message":["El título necesita al menos 3 caracteres"],"error":"Bad Request","statusCode":400}
```

Campo que no existe en el DTO:

```bash
curl -X POST http://localhost:8080/api/libros \
  -H 'Content-Type: application/json' -d '{"titulo":"Valido aqui","hacker":"x"}'
```

```json
{"message":["property hacker should not exist"],"error":"Bad Request","statusCode":400}
```

Sirve para el punto de la clase: la validación del formulario reactivo es **UX**,
la del backend es la que realmente protege los datos. Ambas hacen falta.

Estos `400` son también la forma más fácil de probar el `catchError` del front:
manda un título de 2 letras desde la app y mira cómo reacciona la UI.

---

## 6. Códigos de estado que verás

| Código | Cuándo |
|---|---|
| 200 | GET, PUT y PATCH correctos |
| 201 | POST correcto |
| 204 | DELETE correcto (sin cuerpo) |
| 400 | Cuerpo inválido, o `:id` no numérico (`ParseIntPipe`) |
| 404 | El id no existe |

---

## 7. Conectar con el front (sesion7-app)

El front ya apunta a `http://localhost:8080/api`, pero mientras
`angular-in-memory-web-api` esté registrado, **intercepta** las peticiones antes
de que salgan a la red. Para usar esta API real, vacía el arreglo:

```ts
// sesion7-app/src/environments/providers.ts
export const extraProviders: (Provider | EnvironmentProviders)[] = [];
```

Dos terminales:

```bash
# terminal 1 — backend
cd api-libros && npm run dev      # :8080

# terminal 2 — frontend
cd sesion7-app && npm start       # :4200
```

CORS está habilitado solo para `http://localhost:4200`.

Ganancia para la clase: en la pestaña **Network** del navegador se ven las
peticiones HTTP reales con sus métodos y códigos de estado. Con el emulado eso
no aparece, porque nunca hay tráfico de red.

---

## 8. Problemas frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `EADDRINUSE: address already in use :::8080` | Ya hay un proceso en el 8080 | `pkill -f api-libros` (mata también el hijo del watch), o usa `PORT=3000 npm start` |
| El front sigue mostrando datos viejos | El emulado está interceptando | Vacía `extraProviders` en `providers.ts` |
| `CORS policy: No 'Access-Control-Allow-Origin'` | El front no corre en el 4200 | Agrega tu origen en `enableCors` de `src/main.ts` |
| Los libros creados desaparecen al reiniciar | SQLite en memoria | Cambia `database: ':memory:'` por `'libros.sqlite'` en `app.module.ts` |
| `Cannot find module 'better-sqlite3'` | Falta instalar | `npm install` |
| La consola se llena de SQL | `logging: ['query','error']` | Déjalo en `logging: ['error']` |

---

## 9. Advertencia de seguridad

La API **no tiene autenticación ni autorización**. Cualquiera que alcance el
puerto 8080 puede crear, modificar y borrar libros. Es a propósito: el tema de
tokens e interceptors corresponde al Módulo 8. No la publiques fuera de
`localhost` en este estado.
