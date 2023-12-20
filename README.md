# graphql-test

## Cómo levantarlo?

### Primera vez?

Bien, se requiere que tengas Docker y nodejs instalados.
Diferencio la 1ra vez porque es necesario correr unos scripts para crear la base de datos.

Abrir una terminal y seguir estas instrucciones:

- 1. `docker compose up -d postgres redis`
- 2. Darle permiso a `./scripts/create_db.sh` : usar: `chmod +x ./scripts/create_db.sh`
- 3. Correr `./scripts/create_db.sh`
- 4. Darle permiso a `./scripts/migrate_db.sh`: usar: `chmod +x ./scripts/migrate_db.sh`
- 5. Correr migraciones: `./scripts/migrate_db.sh`
- 6. `yarn install`
- 7. `yarn codegen`
- 8. `yarn start:dev`

Disclaimer: La intención fue poder levantar la app desde el docker también y no como entorno de desarrollo, sin embargo tengo un bug en el Dockerfile y no logré que se copie el archivo `schema.graphql` en la carpeta `/build` y por lo tanto falla. :(

### Siguientes veces

- `docker compose up -d postgres redis`
- `yarn start:dev`
