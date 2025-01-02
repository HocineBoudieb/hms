/*
  Warnings:

  - The primary key for the `Alert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `endDate` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `orderId` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `startDate` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `type` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Artisan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Artisan` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `name` on the `Artisan` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `EnCours` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `antennaId` on the `EnCours` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `EnCours` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `eventType` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `rfidOrderId` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `timestamp` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `endDate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `startDate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Rfid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isActive` on the `Rfid` table. All the data in the column will be lost.
  - You are about to alter the column `enCoursId` on the `Rfid` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Rfid` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `workshopId` on the `Rfid` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `RfidOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `RfidOrder` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `orderId` on the `RfidOrder` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `rfid` on the `RfidOrder` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `status` on the `RfidOrder` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Support` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `artisanId` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `endDate` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `orderId` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `startDate` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `type` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `workshopId` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Workshop` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `enCoursId` on the `Workshop` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Workshop` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `reference` to the `Rfid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Workshop` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Antenna" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "startDate" INTEGER NOT NULL,
    "endDate" INTEGER NOT NULL,
    CONSTRAINT "Alert_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alert" ("endDate", "id", "orderId", "startDate", "type") SELECT "endDate", "id", "orderId", "startDate", "type" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
CREATE TABLE "new_Artisan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" INTEGER NOT NULL
);
INSERT INTO "new_Artisan" ("id", "name") SELECT "id", "name" FROM "Artisan";
DROP TABLE "Artisan";
ALTER TABLE "new_Artisan" RENAME TO "Artisan";
CREATE TABLE "new_EnCours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "antennaId" INTEGER NOT NULL,
    CONSTRAINT "EnCours_antennaId_fkey" FOREIGN KEY ("antennaId") REFERENCES "Antenna" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnCours" ("antennaId", "id") SELECT "antennaId", "id" FROM "EnCours";
DROP TABLE "EnCours";
ALTER TABLE "new_EnCours" RENAME TO "EnCours";
CREATE UNIQUE INDEX "EnCours_antennaId_key" ON "EnCours"("antennaId");
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfidOrderId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "eventType" INTEGER NOT NULL,
    CONSTRAINT "Event_rfidOrderId_fkey" FOREIGN KEY ("rfidOrderId") REFERENCES "RfidOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("eventType", "id", "rfidOrderId", "timestamp") SELECT "eventType", "id", "rfidOrderId", "timestamp" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" INTEGER NOT NULL,
    "startDate" INTEGER NOT NULL,
    "endDate" INTEGER NOT NULL
);
INSERT INTO "new_Order" ("endDate", "id", "startDate", "status") SELECT "endDate", "id", "startDate", "status" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Rfid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enCoursId" INTEGER NOT NULL,
    "workshopId" INTEGER NOT NULL,
    "reference" INTEGER NOT NULL,
    CONSTRAINT "Rfid_enCoursId_fkey" FOREIGN KEY ("enCoursId") REFERENCES "EnCours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rfid_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rfid" ("enCoursId", "id", "workshopId") SELECT "enCoursId", "id", "workshopId" FROM "Rfid";
DROP TABLE "Rfid";
ALTER TABLE "new_Rfid" RENAME TO "Rfid";
CREATE TABLE "new_RfidOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfid" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    CONSTRAINT "RfidOrder_rfid_fkey" FOREIGN KEY ("rfid") REFERENCES "Rfid" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RfidOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RfidOrder" ("id", "orderId", "rfid", "status") SELECT "id", "orderId", "rfid", "status" FROM "RfidOrder";
DROP TABLE "RfidOrder";
ALTER TABLE "new_RfidOrder" RENAME TO "RfidOrder";
CREATE TABLE "new_Support" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "artisanId" INTEGER NOT NULL,
    "workshopId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "startDate" INTEGER NOT NULL,
    "endDate" INTEGER NOT NULL,
    CONSTRAINT "Support_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Support_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "Artisan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Support_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Support" ("artisanId", "endDate", "id", "orderId", "startDate", "type", "workshopId") SELECT "artisanId", "endDate", "id", "orderId", "startDate", "type", "workshopId" FROM "Support";
DROP TABLE "Support";
ALTER TABLE "new_Support" RENAME TO "Support";
CREATE TABLE "new_Workshop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" INTEGER NOT NULL,
    "enCoursId" INTEGER NOT NULL,
    CONSTRAINT "Workshop_enCoursId_fkey" FOREIGN KEY ("enCoursId") REFERENCES "EnCours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workshop" ("enCoursId", "id") SELECT "enCoursId", "id" FROM "Workshop";
DROP TABLE "Workshop";
ALTER TABLE "new_Workshop" RENAME TO "Workshop";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Antenna_reference_key" ON "Antenna"("reference");
