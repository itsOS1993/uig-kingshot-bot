const prisma = require('../database/prisma');
const { fetchPlayer } = require('./kingshotApi');
const { createEmbed } = require('../utils/embed');

async function checkLevelUp(client) {
  const players = await prisma.player.findMany();

  for (const player of players) {
    const apiData = await fetchPlayer(player.gameId);
    if (!apiData) continue;

    if (apiData.level > player.level) {

      const updated = await prisma.player.update({
        where: { id: player.id },
        data: {
          level: apiData.level,
          lastLevelCheck: new Date()
        }
      });

      const guild = client.guilds.cache.first();
      if (!guild) continue;

      const member = await guild.members.fetch(player.discordId).catch(() => null);
      if (!member) continue;

      const channel = guild.systemChannel;
      if (!channel) continue;

      await channel.send({
        embeds: [
          createEmbed({
            title: "Level Up!",
            description: `${member} reached Level ${updated.level}!`,
            color: 0x57f287
          })
        ]
      });
    }
  }
}

module.exports = { checkLevelUp };