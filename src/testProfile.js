const fs = require('fs');
const path = require('path');
const { generateProfileCard } = require('./utils/profileCanvas.js');

(async () => {
  try {

    const dummyData = {
      username: "itsOS",
      gameId: "232004580",
      level: 25,
      powerFormatted: "21,800,000",
      alliance: "UIG",
      kingdom: "1566",
      avatarURL: "https://cdn.discordapp.com/embed/avatars/0.png"
    };

    const buffer = await generateProfileCard(dummyData);

    const outputPath = path.join(__dirname, '../profile-test.png');

    fs.writeFileSync(outputPath, buffer);

    console.log("Profile image generated:", outputPath);

  } catch (error) {
    console.error(error);
  }
})();