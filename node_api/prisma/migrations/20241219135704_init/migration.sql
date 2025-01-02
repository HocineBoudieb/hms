-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Artisan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Artisan" ("id", "name") SELECT "id", "name" FROM "Artisan";
DROP TABLE "Artisan";
ALTER TABLE "new_Artisan" RENAME TO "Artisan";
CREATE TABLE "new_Workshop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "enCoursId" INTEGER NOT NULL,
    CONSTRAINT "Workshop_enCoursId_fkey" FOREIGN KEY ("enCoursId") REFERENCES "EnCours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workshop" ("enCoursId", "id", "name") SELECT "enCoursId", "id", "name" FROM "Workshop";
DROP TABLE "Workshop";
ALTER TABLE "new_Workshop" RENAME TO "Workshop";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
