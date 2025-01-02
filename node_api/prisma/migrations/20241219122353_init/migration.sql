/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Alert" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "orderId" BIGINT NOT NULL,
    "type" BIGINT NOT NULL,
    "startDate" BIGINT NOT NULL,
    "endDate" BIGINT NOT NULL,
    CONSTRAINT "Alert_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Artisan" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "EnCours" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "antennaId" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "rfidOrderId" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "eventType" BIGINT NOT NULL,
    CONSTRAINT "Event_rfidOrderId_fkey" FOREIGN KEY ("rfidOrderId") REFERENCES "RfidOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "status" BIGINT NOT NULL,
    "startDate" BIGINT NOT NULL,
    "endDate" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Rfid" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "isActive" BIGINT NOT NULL,
    "enCoursId" BIGINT NOT NULL,
    "workshopId" BIGINT NOT NULL,
    CONSTRAINT "Rfid_enCoursId_fkey" FOREIGN KEY ("enCoursId") REFERENCES "EnCours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rfid_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RfidOrder" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "rfid" BIGINT NOT NULL,
    "orderId" BIGINT NOT NULL,
    "status" BIGINT NOT NULL,
    CONSTRAINT "RfidOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Support" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "orderId" BIGINT NOT NULL,
    "artisanId" BIGINT NOT NULL,
    "workshopId" BIGINT NOT NULL,
    "type" BIGINT NOT NULL,
    "startDate" BIGINT NOT NULL,
    "endDate" BIGINT NOT NULL,
    CONSTRAINT "Support_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Support_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "Artisan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Support_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "enCoursId" BIGINT NOT NULL,
    CONSTRAINT "Workshop_enCoursId_fkey" FOREIGN KEY ("enCoursId") REFERENCES "EnCours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
