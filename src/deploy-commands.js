require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const isDev = process.env.DEV_MODE === 'true';

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('=== HARD RESET DEPLOY START ===');

    // 1️⃣ Global Commands löschen
    console.log('Clearing ALL global commands...');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: [] },
    );

    // 2️⃣ Guild Commands löschen (falls DEV)
    if (guildId) {
      console.log('Clearing ALL guild commands...');
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: [] },
      );
    }

    // 3️⃣ Neue Commands registrieren
    console.log('Registering fresh commands...');

    if (isDev && guildId) {
      console.log('Deploying in DEV (Guild) mode...');
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
    } else {
      console.log('Deploying in PROD (Global) mode...');
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
    }

    console.log('=== COMMANDS FULLY RESET & DEPLOYED ===');

  } catch (error) {
    console.error(error);
  }
})();