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
