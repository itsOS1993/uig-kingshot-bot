const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');
const { t } = require('../i18n');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register with your Kingshot Game ID')
    .addStringOption(option =>
      option.setName('gameid')
        .setDescription('Your Kingshot Game ID')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Choose your language')
        .addChoices(
          { name: 'Deutsch', value: 'de' },
          { name: 'English', value: 'en' },
          { name: 'Español', value: 'es' },
          { name: 'Русский', value: 'ru' },
          { name: 'Türkçe', value: 'tr' }
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const discordId = interaction.user.id;
    const gameId = interaction.options.getString('gameid');
    const language = interaction.options.getString('language') || 'de';

    try {
      // Prüfen ob Discord User existiert
      const existingUser = await prisma.player.findUnique({
        where: { discordId }
      });

      if (existingUser) {
        return interaction.reply({
          content: t(existingUser.language, "ALREADY_REGISTERED"),
          ephemeral: true
        });
      }

      // Prüfen ob GameID bereits registriert ist
      const existingGameId = await prisma.player.findUnique({
        where: { gameId }
      });

      if (existingGameId) {
        return interaction.reply({
          content: t(language, "GAMEID_ALREADY_USED"),
          ephemeral: true
        });
      }

      await prisma.player.create({
        data: {
          discordId,
          gameId,
          username: "Unknown",
          level: 1,
          language
        }
      });

      await interaction.reply({
        content: t(language, "REGISTER_SUCCESS"),
        ephemeral: true
      });

    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: t(language, "REGISTER_ERROR"),
        ephemeral: true
      });
    }
  }
};