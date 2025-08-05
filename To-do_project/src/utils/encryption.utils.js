const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.EMAIL_SECRET_KEY || 'defaultsecretkeymustbe32bytes!';
const iv = crypto.randomBytes(16); // Initialization vector

// Encrypt email
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt email
function decrypt(text) {
  const [ivHex, encryptedHex] = text.split(':');
  const ivBuffer = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
