-- CreateTable
CREATE TABLE "PowerHistory" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PowerHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PowerHistory" ADD CONSTRAINT "PowerHistory_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
