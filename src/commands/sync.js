const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');
const { fetchPlayer } = require('../services/kingshotApi');
const { createEmbed } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sync')
    .setDescription('Sync your level with Kingshot'),

  async execute(interaction) {
    const discordId = interaction.user.id;

    const player = await prisma.player.findUnique({
      where: { discordId }
    });

    if (!player) {
      return interaction.reply({
        embeds: [createEmbed({
          description: "You are not registered.",
          color: 0xed4245
        })],
        ephemeral: true
      });
    }

    const apiData = await fetchPlayer(player.gameId);
    if (!apiData) {
      return interaction.reply({
        embeds: [createEmbed({
          description: "API error or player not found.",
          color: 0xed4245
        })],
        ephemeral: true
      });
    }

    if (apiData.level > player.level) {

      await prisma.player.update({
        where: { discordId },
        data: { level: apiData.level }
      });

      return interaction.reply({
        embeds: [createEmbed({
          title: "Level Up!",
          description: `You reached Level ${apiData.level}!`,
          color: 0x57f287
        })]
      });
    }

    return interaction.reply({
      embeds: [createEmbed({
        description: "No level change detected.",
        color: 0x5865f2
      })],
      ephemeral: true
    });
  }
};