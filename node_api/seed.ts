import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Antennas
  const antenna1 = await prisma.antenna.create({
    data: { reference: 1001 }
  });
  const antenna2 = await prisma.antenna.create({
    data: { reference: 1002 }
  });

  // Create EnCours
  const enCours1 = await prisma.enCours.create({
    data: {
      antennaId: antenna1.id,
    }
  });

  const enCours2 = await prisma.enCours.create({
    data: {
      antennaId: antenna2.id,
    }
  });

  // Create Workshops
  const workshop1 = await prisma.workshop.create({
    data: {
      name: 'Workshop Alpha',
      enCoursId: enCours1.id,
    }
  });

  const workshop2 = await prisma.workshop.create({
    data: {
      name: 'Workshop Beta',
      enCoursId: enCours2.id,
    }
  });

  // Create RfidOrders
  const rfidOrder1 = await prisma.rfidOrder.create({
    data: {
      rfid: 5001,
      status: 1
    }
  });

  const rfidOrder2 = await prisma.rfidOrder.create({
    data: {
      rfid: 5002,
      status: 2
    }
  });

  // Create Rfids
  await prisma.rfid.create({
    data: {
      enCoursId: enCours1.id,
      workshopId: workshop1.id,
      rfidOrderId: rfidOrder1.id,
      reference: 7001,
    }
  });

  await prisma.rfid.create({
    data: {
      enCoursId: enCours2.id,
      workshopId: workshop2.id,
      rfidOrderId: rfidOrder2.id,
      reference: 7002,
    }
  });

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      status: 1,
      startDate: new Date('2024-06-01T08:00:00'),
      endDate: new Date('2024-06-01T18:00:00'),
      enCoursId: enCours1.id,
      workshopId: workshop1.id,
      rfidOrderId: rfidOrder1.id,
    }
  });

  const order2 = await prisma.order.create({
    data: {
      status: 2,
      startDate: new Date('2024-06-02T09:00:00'),
      endDate: new Date('2024-06-02T17:00:00'),
      enCoursId: enCours2.id,
      workshopId: workshop2.id,
      rfidOrderId: rfidOrder2.id,
    }
  });

  // Create Artisans
  const artisan1 = await prisma.artisan.create({
    data: { name: 'John Doe' }
  });
  const artisan2 = await prisma.artisan.create({
    data: { name: 'Jane Smith' }
  });

  // Create Supports
  await prisma.support.create({
    data: {
      orderId: order1.id,
      artisanId: artisan1.id,
      workshopId: workshop1.id,
      type: 1,
      startDate: new Date('2024-06-01T09:30:00'),
      endDate: new Date('2024-06-01T16:00:00'),
    }
  });

  await prisma.support.create({
    data: {
      orderId: order2.id,
      artisanId: artisan2.id,
      workshopId: workshop2.id,
      type: 2,
      startDate: new Date('2024-06-02T10:00:00'),
      endDate: new Date('2024-06-02T15:30:00'),
    }
  });

  // Create Alerts
  await prisma.alert.create({
    data: {
      orderId: order1.id,
      type: 1,
      startDate: new Date('2024-06-01T11:00:00'),
      endDate: new Date('2024-06-01T12:00:00'),
    }
  });

  await prisma.alert.create({
    data: {
      orderId: order2.id,
      type: 2,
      startDate: new Date('2024-06-02T13:00:00'),
      endDate: new Date('2024-06-02T14:00:00'),
    }
  });

  // Create Events
  await prisma.event.create({
    data: {
      rfidOrderId: rfidOrder1.id,
      timestamp: new Date('2024-06-01T08:30:00'),
      eventType: 1,
    }
  });

  await prisma.event.create({
    data: {
      rfidOrderId: rfidOrder2.id,
      timestamp: new Date('2024-06-02T09:15:00'),
      eventType: 2,
    }
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
