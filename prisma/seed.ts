import { PrismaClient } from '@prisma/client';

import { camps, users } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.camp.deleteMany();
  await prisma.art.deleteMany();
  await prisma.user.deleteMany();

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // for (const art of arts) {
  //   await prisma.art.create({ data: art });
  // }

  for (const camp of camps) {
    await prisma.camp.create({ data: camp });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
