import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllData() {
  // Delete data in reverse order of dependencies
  await prisma.event.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.support.deleteMany();
  await prisma.stats.deleteMany();
  await prisma.rfid.deleteMany();
  await prisma.order.deleteMany();
  await prisma.rfidOrder.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.enCours.deleteMany();
  await prisma.antenna.deleteMany();
  await prisma.artisan.deleteMany();

  console.log('All data deleted successfully');
}

async function main() {
  // First, delete existing data
  await deleteAllData();

  // Create 3 EnCours (and associated Antennas)
  const enCours = await Promise.all(
    Array.from({ length: 3 }, async (_, i) => {
      const antenna = await prisma.antenna.create({
        data: { reference: i + 1 },
      });
      return prisma.enCours.create({
        data: { antennaId: antenna.id },
      });
    })
  );

  // Create 3 Workshops (one for each EnCours)
  const workshops = await Promise.all(
    enCours.map((ec, i) =>
      prisma.workshop.create({
        data: { name: `Workshop ${i + 1}`, enCoursId: ec.id },
      })
    )
  );

  // Create RfidOrders and associated Orders
  const rfidOrders = await Promise.all(
    Array.from({ length: 6 }, async (_, i) => {
      const rfidOrder = await prisma.rfidOrder.create({
        data: {
          rfid: i + 1,
          status: Math.floor(Math.random() * 3), // Random status
        },
      });

      const order = await prisma.order.create({
        data: {
          status: Math.floor(Math.random() * 3), // Random status
          startDate: new Date(),
          endDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // Valid for one week
          enCoursId: enCours[i % enCours.length].id,
          workshopId: workshops[i % workshops.length].id,
          rfidOrderId: rfidOrder.id,
        },
      });

      return { rfidOrder, order };
    })
  );

  // Create Rfids and associate them with RfidOrders
  await Promise.all(
    rfidOrders.map((ro, i) =>
      prisma.rfid.create({
        data: {
          enCoursId: enCours[i % enCours.length].id,
          workshopId: workshops[i % workshops.length].id,
          rfidOrderId: ro.rfidOrder.id,
          reference: i + 1,
        },
      })
    )
  );

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
