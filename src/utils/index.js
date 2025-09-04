const crypto = require("crypto")

function generateRandomString(length) {

  const numBytes = Math.ceil(length / 2);

  return crypto.randomBytes(numBytes).toString("hex").slice(0, length);
}

function generateDateString() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();

  return `${year}0${month}0${day}`
}


module.exports = { generateDateString, generateRandomString }