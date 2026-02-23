const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Registriere dich mit deiner Kingshot Game ID')
    .addStringOption(option =>
      option.setName('gameid')
        .setDescription('Deine Kingshot Game ID')
        .setRequired(true)
    ),

  async execute(interaction) {
    const discordId = interaction.user.id;
    const gameId = interaction.options.getString('gameid');

    try {
      const existing = await prisma.player.findUnique({
        where: { discordId }
      });

      if (existing) {
        return interaction.reply({
          content: 'Du bist bereits registriert.',
          ephemeral: true
        });
      }

      await prisma.player.create({
        data: {
          discordId,
          gameId,
          username: "Unknown", // kommt später von API
          level: 1
        }
      });

      await interaction.reply('Registrierung erfolgreich.');
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Fehler bei Registrierung.',
        ephemeral: true
      });
    }
  }
};