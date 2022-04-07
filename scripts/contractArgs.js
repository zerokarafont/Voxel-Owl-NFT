require('dotenv').config();

module.exports = [
  process.env.NAME,
  process.env.SYMBOL,
  process.env.INIT_BASE_URI,
  process.env.INIT_NOT_REVEALED_URI
];