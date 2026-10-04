-- AlterTable
ALTER TABLE "UserJourneyProgress"
ADD COLUMN "isStamped" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "UserJourneyProgress"
ADD COLUMN "stampedAt" DATETIME;
