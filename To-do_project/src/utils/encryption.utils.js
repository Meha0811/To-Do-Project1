const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
const ALGORITHM = 'aes-256-ecb'; // ECB mode: no IV needed

// Validate hex string
function isHex(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}

function encrypt(text) {
    if (typeof text !== 'string') throw new Error('Encrypt input must be a string');
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, null);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    if (typeof encryptedText !== 'string' || !isHex(encryptedText)) {
        throw new Error('Decrypt input is not a valid hex string');
    }
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, null);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
