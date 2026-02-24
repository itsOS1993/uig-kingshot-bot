const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const prisma = require('../database/prisma');
const { generateProfileCard } = require('../utils/profileCanvas');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Show player profile')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Target user (optional)')
        .setRequired(false)
    ),

  async execute(interaction) {

    const targetUser = interaction.options.getUser('user') || interaction.user;

    // Spieler aus DB holen
    const player = await prisma.player.findUnique({
      where: { discordId: targetUser.id }
    });

    if (!player) {
      return interaction.reply({
        content: 'User not registered.',
        ephemeral: true
      });
    }

    // Avatar URL holen (PNG, feste Größe)
    const avatarURL = targetUser.displayAvatarURL({
      extension: 'png',
      size: 256
    });

    // Power formatieren (z.B. 21,800,000)
    const powerFormatted = player.power.toLocaleString('en-US');

    // Canvas generieren
    const buffer = await generateProfileCard({
      username: player.username || targetUser.username,
      gameId: player.gameId,
      level: player.level,
      powerFormatted,
      alliance: 'UIG',
      kingdom: player.kingdom || '1566',
      avatarURL
    });

    const attachment = new AttachmentBuilder(buffer, {
      name: 'profile.png'
    });

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setImage('attachment://profile.png');

    await interaction.reply({
      embeds: [embed],
      files: [attachment]
    });

  }
};