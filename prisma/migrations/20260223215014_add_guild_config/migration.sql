-- CreateTable
CREATE TABLE "GuildConfig" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "r4RoleId" TEXT,

    CONSTRAINT "GuildConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildConfig_guildId_key" ON "GuildConfig"("guildId");
