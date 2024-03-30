import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const pass = await argon2.hash('admin');

  await prisma.user.create({
    data: {
      name: 'Pedro Manual',
      user: 'admin',
      pass,
      rol: {
        create: {
          role: 'ADMIN',
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
