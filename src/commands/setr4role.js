const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const prisma = require('../database/prisma');
const { createEmbed } = require('../utils/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setr4role')
    .setDescription('Set the R4 role')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role that can manage power')
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const guildId = interaction.guild.id;

    await prisma.guildConfig.upsert({
      where: { guildId },
      update: { r4RoleId: role.id },
      create: {
        guildId,
        r4RoleId: role.id
      }
    });

    await interaction.reply({
      embeds: [
        createEmbed({
          description: `R4 role set to ${role.name}`,
          color: 0x57f287
        })
      ],
      ephemeral: true
    });
  }
};