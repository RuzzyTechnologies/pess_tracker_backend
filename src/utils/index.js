const crypto = require("crypto");

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

function urlParser(url) {
  const lastSlashIndex = url.lastIndexOf("/");

  const base = url.slice(0, lastSlashIndex);
  const name = url.slice(lastSlashIndex + 1);
  return [base, name];
}


function validateCompanyEmail(email) {
  const allowedDomains = ["outdoors.ng", "xpark360.ng", "pdma.io", "premiumdigitalmarketing.ng", "essdigital.ng"];

  const AtIndex = email.indexOf("@");
  const address = email.slice(AtIndex + 1);

  if (!allowedDomains.includes(address)) {
    return false;
  }
  return true;
}


module.exports = { generateDateString, generateRandomString, urlParser, validateCompanyEmail, createToken };