require('dotenv').config();

const { fetchPlayer } = require('./src/services/kingshotApi');

(async () => {
  const result = await fetchPlayer("232004580");
  console.log("RESULT:", result);
})();