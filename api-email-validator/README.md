# API Email Validator (NestJS)

API REST mínima: recibe un correo por POST y responde si está o no dentro de un array de emails.

Pensada para servir de backend al validador asíncrono del Módulo 6 (Formularios Avanzados).

---

## 1. Requisitos

| Herramienta | Versión mínima | Verificar |
|---|---|---|
| Node.js | 18.x (recomendado 20.x LTS) | `node -v` |
| npm | 9.x | `npm -v` |

No necesitás instalar el CLI de Nest global: ya viene en `devDependencies` y los scripts lo resuelven vía `npm run`.

---

## 2. Instalar

```bash
cd Modulo06/Practica/api-email-validator
npm install
```

---

## 3. Lanzar

### Modo desarrollo (con hot reload)

```bash
npm run start:dev
```

Salida esperada:

```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] EmailModule dependencies initialized
[Nest] LOG [RoutesResolver] EmailController {/api/email}
[Nest] LOG [RouterExplorer] Mapped {/api/email/validar, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/email, GET} route
[Nest] LOG [NestApplication] Nest application successfully started
API escuchando en http://localhost:3000/api
```

Cada vez que guardés un `.ts` se recompila solo.

### Modo normal (sin watch)

```bash
npm run start
```

### Modo producción

```bash
npm run build      # compila a ./dist
npm run start:prod # corre node dist/main
```

### Cambiar el puerto

```bash
PORT=4000 npm run start:dev
```

---

## 4. Verificar que está arriba

```bash
curl http://localhost:3000/api/email
```

Si responde el JSON con el listado de correos, ya está corriendo.

---

## 5. Probar el endpoint

### Correo que SÍ está en el array

```bash
curl -X POST http://localhost:3000/api/email/validar \
  -H "Content-Type: application/json" \
  -d '{"email":"edwin@itera.com"}'
```

```json
{
  "email": "edwin@itera.com",
  "existe": true,
  "mensaje": "El correo ya se encuentra registrado"
}
```

### Correo que NO está

```bash
curl -X POST http://localhost:3000/api/email/validar \
  -H "Content-Type: application/json" \
  -d '{"email":"nuevo@correo.com"}'
```

```json
{
  "email": "nuevo@correo.com",
  "existe": false,
  "mensaje": "El correo está disponible"
}
```

### Formato inválido → 400

```bash
curl -X POST http://localhost:3000/api/email/validar \
  -H "Content-Type: application/json" \
  -d '{"email":"no-es-un-email"}'
```

```json
{
  "statusCode": 400,
  "message": ["El formato del correo no es válido"],
  "error": "Bad Request"
}
```

### Props extra en el body → 400

El `ValidationPipe` corre con `forbidNonWhitelisted`, así que esto también revienta:

```bash
curl -X POST http://localhost:3000/api/email/validar \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","rol":"admin"}'
```

---

## 6. Endpoints

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/api/email/validar` | `{ "email": "..." }` | Valida si el correo está en el array |
| GET | `/api/email` | — | Lista los correos cargados |

---

## 7. Modificar el array de correos

Está en `src/email/email.service.ts`:

```typescript
private readonly emailsRegistrados: readonly string[] = [
  'edwin@itera.com',
  'admin@auna.pe',
  // agregá los tuyos acá, siempre en minúsculas
];
```

En `start:dev` el cambio se recarga solo. La comparación normaliza con `trim().toLowerCase()`,
así que `  EDWIN@Itera.com ` matchea igual, pero el array debe estar en minúsculas.

---

## 8. Consumirlo desde Angular

CORS está habilitado solo para `http://localhost:4200`. Si tu front corre en otro puerto,
ajustá `origin` en `src/main.ts`.

Async validator de ejemplo:

```typescript
emailNoRegistrado(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return http
      .post<{ existe: boolean }>('http://localhost:3000/api/email/validar', {
        email: control.value,
      })
      .pipe(
        map((res) => (res.existe ? { emailTomado: true } : null)),
        catchError(() => of(null)), // si la API falla, no bloquees el form
      );
  };
}
```

Combinalo con `debounceTime` en el form para no disparar un request por tecla.

---

## 9. Troubleshooting

**`EADDRINUSE: address already in use :::3000`**
El puerto está ocupado. Levantalo en otro: `PORT=3001 npm run start:dev`
O matá el proceso: `lsof -ti:3000 | xargs kill -9`

**`nest: command not found`**
Faltó el `npm install`, o lo estás invocando directo. Usá siempre `npm run start:dev`,
no `nest start` a secas.

**Error de CORS en el navegador**
Tu front no corre en `localhost:4200`. Agregá tu origen al array `origin` en `src/main.ts`.

**Cambios en el código que no se reflejan**
Verificá que estés en `start:dev` y no en `start`. El segundo no tiene watch.

**`Cannot find module 'reflect-metadata'`**
`npm install` incompleto. Borrá y reinstalá: `rm -rf node_modules package-lock.json && npm install`

---

## 10. Nota de seguridad

El endpoint **no tiene autenticación ni rate limiting**. Para el laboratorio va bien, pero
un endpoint que confirma qué correos existen es un enumerador de usuarios si se expone en
red real. Antes de llevarlo a algo productivo hay que meterle auth y throttling
(`@nestjs/throttler`), y considerar responder genérico en lugar de confirmar la existencia.
