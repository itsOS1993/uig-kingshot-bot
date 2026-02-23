const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');
const { t } = require('../i18n');
const { createEmbed } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlanguage')
    .setDescription('Change your bot language')
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
        .setRequired(true)
    ),

  async execute(interaction) {
    const discordId = interaction.user.id;
    const newLanguage = interaction.options.getString('language');

    try {
      const player = await prisma.player.findUnique({
        where: { discordId }
      });

      if (!player) {
        return interaction.reply({
          embeds: [
            createEmbed({
              description: t("en", "NOT_REGISTERED"),
              color: 0xfaa61a
            })
          ],
          ephemeral: true
        });
      }

      await prisma.player.update({
        where: { discordId },
        data: { language: newLanguage }
      });

      await interaction.reply({
        embeds: [
          createEmbed({
            description: t(newLanguage, "LANGUAGE_UPDATED"),
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
            description: t("en", "GENERIC_ERROR"),
            color: 0xed4245
          })
        ],
        ephemeral: true
      });
    }
  }
};