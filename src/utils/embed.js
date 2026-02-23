const { EmbedBuilder } = require('discord.js');

function createEmbed({ title, description, color = 0x2b2d31 }) {
  return new EmbedBuilder()
    .setTitle(title || null)
    .setDescription(description || null)
    .setColor(color)
    .setTimestamp();
}

module.exports = { createEmbed };