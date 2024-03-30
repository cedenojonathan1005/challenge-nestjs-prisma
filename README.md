## Installing

Create services
```bash
docker-compose up -d
```

Prisma migrate
```bash
docker exec api npx prisma migrate dev --name "init"
```

Prisma db seed
```bash
docker exec api npx prisma db seed
```
### Swagger

```
http://localhost:3000/doc#/
```

## Manual Installing
Intall dependencies
```bash
npm i
```

Rename file .env.template for .env and set the environment variables
```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
```

Config database
```bash
Go to folder prisma and execute npx prisma migrate dev --create-only
```

Run the project
```bash
npm run start:dev
```