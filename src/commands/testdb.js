const { SlashCommandBuilder } = require('discord.js');
const prisma = require('../database/prisma');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testdb')
    .setDescription('Testet Datenbankverbindung'),

  async execute(interaction) {
    try {
      const count = await prisma.player.count();
      await interaction.reply(`DB verbunden. Spieler: ${count}`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'DB Fehler.', ephemeral: true });
    }
  }
};