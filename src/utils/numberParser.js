function parsePower(input) {
  if (!input) return null;

  const cleaned = input.replace(/[.,\s]/g, '').toUpperCase();

  if (cleaned.endsWith("K")) {
    return parseFloat(cleaned) * 1_000;
  }

  if (cleaned.endsWith("M")) {
    return parseFloat(cleaned) * 1_000_000;
  }

  if (cleaned.endsWith("B")) {
    return parseFloat(cleaned) * 1_000_000_000;
  }

  const number = Number(cleaned);
  return Number.isNaN(number) ? null : number;
}

function formatPower(num) {
  return num.toLocaleString("en-US");
}

module.exports = { parsePower, formatPower };