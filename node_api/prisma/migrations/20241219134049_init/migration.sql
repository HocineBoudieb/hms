/*
  Warnings:

  - You are about to alter the column `endDate` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `startDate` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `timestamp` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `endDate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `startDate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `endDate` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.
  - You are about to alter the column `startDate` on the `Support` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    CONSTRAINT "Alert_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Alert" ("endDate", "id", "orderId", "startDate", "type") SELECT "endDate", "id", "orderId", "startDate", "type" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rfidOrderId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "eventType" INTEGER NOT NULL,
    CONSTRAINT "Event_rfidOrderId_fkey" FOREIGN KEY ("rfidOrderId") REFERENCES "RfidOrder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("eventType", "id", "rfidOrderId", "timestamp") SELECT "eventType", "id", "rfidOrderId", "timestamp" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("endDate", "id", "startDate", "status") SELECT "endDate", "id", "startDate", "status" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Support" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "artisanId" INTEGER NOT NULL,
    "workshopId" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    CONSTRAINT "Support_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Support_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "Artisan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Support_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Support" ("artisanId", "endDate", "id", "orderId", "startDate", "type", "workshopId") SELECT "artisanId", "endDate", "id", "orderId", "startDate", "type", "workshopId" FROM "Support";
DROP TABLE "Support";
ALTER TABLE "new_Support" RENAME TO "Support";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
