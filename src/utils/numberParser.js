function parsePower(input) {
  if (!input) return null;

  let value = input.toUpperCase().replace(/,/g, '').trim();

  if (value.endsWith("K")) {
    return parseFloat(value) * 1_000;
  }

  if (value.endsWith("M")) {
    return parseFloat(value) * 1_000_000;
  }

  if (value.endsWith("B")) {
    return parseFloat(value) * 1_000_000_000;
  }

  const number = Number(value);
  return isNaN(number) ? null : number;
}

function formatPower(num) {
  return num.toLocaleString("en-US");
}

module.exports = { parsePower, formatPower };