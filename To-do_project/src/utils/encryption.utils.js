const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 64 hex chars (32 bytes)
const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");   // 32 hex chars (16 bytes)

function encrypt(text) {
  if (!text) return null;
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (err) {
    console.error("❌ Encryption failed:", err.message);
    return text; // fallback to plain text
  }
}

function decrypt(encryptedText) {
  if (!encryptedText) return null;

  // If it's already plain text (not hex), just return it
  const isHex = /^[0-9a-fA-F]+$/.test(encryptedText);
  if (!isHex) {
    return encryptedText;
  }

  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("❌ Decryption failed:", err.message);
    return encryptedText; // return as-is
  }
}

module.exports = { encrypt, decrypt };
