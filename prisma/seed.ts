import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  //admin user
  if (!(await prisma.user.findFirst({ where: { roles: { has: Role.ADMIN } } }))) {
    const defaultAdminPass = 'Password01';

    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: bcrypt.hashSync(defaultAdminPass, 10),
        roles: [Role.ADMIN],
      },
    });

    console.log('Created default admin user. Password is Password01');
  }

  // default user
  if (process.env.DEV === 'true') {
    if (!(await prisma.user.findFirst({ where: { username: 'testuser' } }))) {
      await prisma.user.create({
        data: {
          username: 'testuser',
          passwordHash: bcrypt.hashSync('Password01', 10),
        },
      });
    }

    console.log(`Added test user. Password is Password01`);
  } else {
    console.log('Seeding for production, not including default users');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
