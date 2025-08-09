/*
  Warnings:

  - You are about to drop the `apikeys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."apikeys" DROP CONSTRAINT "apikeys_createdBy_fkey";

-- DropTable
DROP TABLE "public"."apikeys";

-- CreateTable
CREATE TABLE "public"."ApiKeys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeys_key_key" ON "public"."ApiKeys"("key");

-- AddForeignKey
ALTER TABLE "public"."ApiKeys" ADD CONSTRAINT "ApiKeys_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
