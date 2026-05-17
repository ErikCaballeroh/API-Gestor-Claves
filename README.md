# API-Gestor-Claves

API REST para gestionar claves, familias, roles e invitaciones, creada con Express.js y MySQL.

## Requisitos
- Node.js 18+ (recomendado)
- MySQL (o servicio compatible)
- Archivo `.env` con las siguientes variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestor_claves
DB_PORT=3306
SECRET_KEY=tu_secret_key_para_AES
SESSION_SECRET=tu_secret_para_session
```

La base de datos inicial se encuentra en `db/db_gestor.sql`.

## Instalación y ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` con las variables anteriores.

3. Ejecutar localmente:

```bash
node app.js
```

O con Docker Compose:

```bash
docker compose up --build
```

La API se expone en `http://localhost:3000`.

## Autenticación
La API utiliza sesiones de servidor (`express-session`). Las rutas bajo `/api/*` (excepto `/api/auth`) requieren que el usuario esté autenticado. Las rutas de administración requieren además `id_rol = 1`.

Para realizar peticiones autenticadas con `curl` se deben almacenar y enviar las cookies:

```bash
# Guardar cookies tras el login
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@example.com","password":"tu_contraseña"}'

# Usar cookies en peticiones siguientes
curl -b cookies.txt http://localhost:3000/api/claves
```

## Endpoints (resumen)

Prefijo base: `/api`

- `/api/auth`
	- `POST /register` — Registrar usuario. Body: `{ "nombre","email","clave" }`
	- `POST /login` — Iniciar sesión. Body: `{ "email","password" }`
	- `POST /logout` — Cerrar sesión
	- `GET /session` — Obtener sesión actual
	- `GET /usuario/:correo` — Obtener usuario por correo

- `/api/claves` (autenticado)
	- `GET /` — Listar claves
	- `GET /:id` — Obtener clave por id
	- `POST /` — Crear clave. Body: `{ "nombre","sitio","usuario","clave","categoria","compartir" }`
	- `PUT /:id` — Actualizar clave
	- `DELETE /:id` — Eliminar clave

- `/api/categorias` (autenticado; cambios requieren rol 1)
	- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

- `/api/familias` (autenticado)
	- `GET /`, `GET /:id`, `GET /claves`, `GET /miembros`, `DELETE /expulsar/:id`, `POST /`, `PUT /:id`, `DELETE /:id`

- `/api/invitaciones` (autenticado)
	- `GET /`, `GET /:id`, `POST /`, `POST /aceptar/:token`, `PUT /:id`, `DELETE /:id`

- `/api/roles` (requiere rol 1)
	- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

- `/api/usuarios` (requiere rol 1)
	- `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

## Ejemplos `curl`

1) Registro de usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"nombre":"Juan","email":"juan@example.com","clave":"mi_clave"}'
```

2) Login y guardar cookies

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"juan@example.com","password":"mi_clave"}'
```

3) Obtener sesión (usar cookies)

```bash
curl -b cookies.txt http://localhost:3000/api/auth/session
```

4) Listar claves (usuario autenticado)

```bash
curl -b cookies.txt http://localhost:3000/api/claves
```

5) Crear una clave

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/claves \
	-H "Content-Type: application/json" \
	-d '{"nombre":"Gmail","sitio":"gmail.com","usuario":"juan","clave":"pass123","categoria":1,"compartir":0}'
```

6) Crear invitación (genera token en la respuesta)

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/invitaciones \
	-H "Content-Type: application/json" \
	-d '{"fecha_vencimiento":"2026-12-31"}'
```

7) Aceptar invitación (usuario autenticado)

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/invitaciones/aceptar/TOKEN_GENERADO
```

## Seguridad y notas técnicas

- Las contraseñas se cifran con AES utilizando `SECRET_KEY`.
- La autenticación se gestiona por sesiones y cookies; el cliente debe enviar cookies en cada petición autenticada.
- Las rutas administrativas usan el middleware `checkRole(1)`.

## Estructura relevante

- Archivo principal: `app.js`
- Rutas: carpeta `routes/`
- Controladores: carpeta `controllers/`
- Conexión a base de datos: `db/connection.js`


