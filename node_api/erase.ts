import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Truncate tables in the correct order to avoid foreign key constraints
  await prisma.event.deleteMany();
  await prisma.rfidOrder.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.support.deleteMany();
  await prisma.rfid.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.enCours.deleteMany();
  await prisma.order.deleteMany();
  await prisma.artisan.deleteMany();
  await prisma.antenna.deleteMany();

  console.log('All tables have been cleared!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
