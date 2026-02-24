const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

const fontRegular = path.join(__dirname, "../assets/fonts/Montserrat-Regular.ttf");
const fontBold = path.join(__dirname, "../assets/fonts/Montserrat-Bold.ttf");
const fontMedium = path.join(__dirname, "../assets/fonts/Montserrat-Medium.ttf");
const fontSemiBold = path.join(__dirname, "../assets/fonts/Montserrat-SemiBold.ttf");
const fontExtraBold = path.join(__dirname, "../assets/fonts/Montserrat-ExtraBold.ttf");

GlobalFonts.registerFromPath(fontRegular, "Montserrat");
GlobalFonts.registerFromPath(fontBold, "Montserrat");
GlobalFonts.registerFromPath(fontMedium, "Montserrat");
GlobalFonts.registerFromPath(fontSemiBold, "Montserrat");
GlobalFonts.registerFromPath(fontExtraBold, "Montserrat");

async function generateProfileCard(data) {
  const canvas = createCanvas(1000, 400);
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = "top";

  // Background laden
  const background = await loadImage(
    path.join(__dirname, '../assets/profil-base.png')
  );
  ctx.drawImage(background, 0, 0, 1000, 400);

    // =========================
    // Avatar (nur x, y, size relevant)
    // =========================

    const avatar = await loadImage(data.avatarURL);

    const avatarX = 60;
    const avatarY = 115;
    const avatarSize = 170;

    ctx.save();

    // Kreis exakt innerhalb der definierten Box
    ctx.beginPath();
    ctx.arc(
    avatarX + avatarSize * 0.5,
    avatarY + avatarSize * 0.5,
    avatarSize * 0.5,
    0,
    Math.PI * 2
    );

    ctx.clip();

    // Bild exakt in diese Box zeichnen
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

    ctx.restore();

  // =========================
  // Username
  // =========================

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 36px Montserrat';
  ctx.fillText(data.username, 260, 95);

  // =========================
  // ID
  // =========================

  ctx.fillStyle = '#C6D9DE';
  ctx.font = '500 20px Montserrat';
  ctx.fillText(`ID: ${data.gameId}`, 260, 145);

  // =========================
  // LEVEL
  // =========================

  ctx.fillStyle = '#A8C7CD';
  ctx.font = '600 16px Montserrat';
  ctx.fillText('LEVEL', 260, 190);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 90px Montserrat';
  ctx.fillText(data.level.toString(), 260, 210);

  // =========================
  // POWER
  // =========================

  ctx.fillStyle = '#FFD700';
  ctx.font = '700 36px Montserrat';
  ctx.fillText(data.powerFormatted, 640, 115);

  ctx.fillStyle = '#A8C7CD';
  ctx.font = '500 14px Montserrat';
  ctx.fillText('Power', 640, 155);

  // =========================
  // Allianz + Kingdom
  // =========================

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 22px Montserrat';
  ctx.fillText(`Allianz: ${data.alliance}`, 640, 190);
  ctx.fillText(`Königreich: #${data.kingdom}`, 640, 225);

  return canvas.toBuffer("image/png");
}

module.exports = { generateProfileCard };