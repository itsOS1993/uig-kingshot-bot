const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');
const { t } = require('../i18n');
const { createEmbed } = require('../utils/embed');
const { fetchPlayer } = require('../services/kingshotApi');

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
          embeds: [
            createEmbed({
              description: t(existingUser.language, "ALREADY_REGISTERED"),
              color: 0xfaa61a
            })
          ],
          ephemeral: true
        });
      }

      // Prüfen ob GameID bereits registriert ist
      const existingGameId = await prisma.player.findUnique({
        where: { gameId }
      });

      if (existingGameId) {
        return interaction.reply({
          embeds: [
            createEmbed({
              description: t(language, "GAMEID_ALREADY_USED"),
              color: 0xfaa61a
            })
          ],
          ephemeral: true
        });
      }

      const apiData = await fetchPlayer(gameId);

      if (!apiData) {
        return interaction.reply({
          embeds: [
            createEmbed({
              description: "Player not found or API error.",
              color: 0xed4245
            })
          ],
          ephemeral: true
        });
      }

      await prisma.player.create({
        data: {
          discordId,
          gameId,
          username: apiData.username,
          level: apiData.level,
          profileImage: apiData.profileImage,
          language
        }
      });

      await interaction.reply({
        embeds: [
          createEmbed({
            description: t(language, "REGISTER_SUCCESS"),
            color: 0x57f287
          })
        ],
        ephemeral: true
      });

    } catch (error) {
      console.error(error);

      await interaction.reply({
        embeds: [
          createEmbed({
            description: t(language, "REGISTER_ERROR"),
            color: 0xed4245
          })
        ],
        ephemeral: true
      });
    }
  }
};