import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Antennas
  const antenna1 = await prisma.antenna.create({ data: { reference: 201 } });
  const antenna2 = await prisma.antenna.create({ data: { reference: 202 } });
  const antenna3 = await prisma.antenna.create({ data: { reference: 203 } });

  // Create EnCours
  const enCours1 = await prisma.enCours.create({
    data: { antennaId: antenna1.id },
  });
  const enCours2 = await prisma.enCours.create({
    data: { antennaId: antenna2.id },
  });
  const enCours3 = await prisma.enCours.create({
    data: { antennaId: antenna3.id },
  });

  // Create Workshops
  const workshop1 = await prisma.workshop.create({
    data: { name: "Workshop A", enCoursId: enCours1.id },
  });
  const workshop2 = await prisma.workshop.create({
    data: { name: "Workshop B", enCoursId: enCours2.id },
  });
  const workshop3 = await prisma.workshop.create({
    data: { name: "Workshop C", enCoursId: enCours3.id },
  });

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      status: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      status: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    },
  });

  // Create Artisans
  const artisan1 = await prisma.artisan.create({ data: { name: "Artisan A" } });
  const artisan2 = await prisma.artisan.create({ data: { name: "Artisan B" } });

  // Create Supports
  await prisma.support.create({
    data: {
      orderId: order1.id,
      artisanId: artisan1.id,
      workshopId: workshop1.id,
      type: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  });

  await prisma.support.create({
    data: {
      orderId: order2.id,
      artisanId: artisan2.id,
      workshopId: workshop2.id,
      type: 2,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    },
  });

  // Create Rfids and RfidOrders
  const rfid1 = await prisma.rfid.create({ data: { enCoursId: enCours1.id, workshopId: workshop1.id, reference: 301 } });
  const rfid2 = await prisma.rfid.create({ data: { enCoursId: enCours2.id, workshopId: workshop2.id, reference: 302 } });

  const rfidOrder1 = await prisma.rfidOrder.create({ data: { rfid: rfid1.id, orderId: order1.id, status: 1 } });
  const rfidOrder2 = await prisma.rfidOrder.create({ data: { rfid: rfid2.id, orderId: order2.id, status: 0 } });

  // Create Events
  await prisma.event.create({
    data: {
      rfidOrderId: rfidOrder1.id,
      timestamp: new Date(),
      eventType: 1,
    },
  });

  await prisma.event.create({
    data: {
      rfidOrderId: rfidOrder2.id,
      timestamp: new Date(),
      eventType: 2,
    },
  });

  console.log("Data generated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
