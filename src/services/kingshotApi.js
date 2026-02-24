const axios = require('axios');

const BASE_URL = process.env.KINGSHOT_API_BASE;

async function fetchPlayer(gameId) {
  try {
    const response = await axios.get(`${BASE_URL}/player-info`, {
      params: {
        playerId: gameId
      },
      timeout: 5000
    });

    const data = response.data;

    if (!data || !data.name) {
      return null;
    }

    return {
      username: data.name,
      level: data.level,
      profileImage: data.profilePhoto,
      kingdom: data.kingdom
    };

  } catch (error) {
    console.error("API ERROR:", error.message);
    return null;
  }
}

module.exports = { fetchPlayer };