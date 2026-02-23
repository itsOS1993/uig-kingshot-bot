const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');
const amount = interaction.options.getInteger('amount');
const { createEmbed } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('power')
    .setDescription('Add power')
    .addIntegerOption(option =>
        option.setName('amount')
            .setDescription('Enter full number (example: 10000000)')
            .setRequired(true)
        )
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Target user (R4 only)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const amountInput = interaction.options.getString('amount');
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const amount = parsePower(amountInput);
    if (!amount || amount <= 0) {
      return interaction.reply({
        embeds: [createEmbed({ description: "Invalid amount.", color: 0xed4245 })],
        ephemeral: true
      });
    }

    const guildId = interaction.guild.id;

    const config = await prisma.guildConfig.findUnique({
      where: { guildId }
    });

    const isSelf = targetUser.id === interaction.user.id;

    if (!isSelf) {
      const member = interaction.member;
      if (!config || !config.r4RoleId || !member.roles.cache.has(config.r4RoleId)) {
        return interaction.reply({
          embeds: [createEmbed({ description: "You are not allowed to modify others.", color: 0xed4245 })],
          ephemeral: true
        });
      }
    }

    const player = await prisma.player.findUnique({
      where: { discordId: targetUser.id }
    });

    if (!player) {
      return interaction.reply({
        embeds: [createEmbed({ description: "User not registered.", color: 0xfaa61a })],
        ephemeral: true
      });
    }

    const updated = await prisma.player.update({
        where: { discordId: targetUser.id },
        data: {
            power: player.power + amount,
            powerHistory: {
            create: {
                guildId: interaction.guild.id,
                changedBy: interaction.user.id,
                amount: amount
            }
            }
        }
    });

    await interaction.reply({
      embeds: [
        createEmbed({
          description: `Power updated.\nNew Power: ${formatPower(updated.power)}`,
          color: 0x57f287
        })
      ]
    });
  }
};