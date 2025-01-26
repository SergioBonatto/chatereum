import CryptoJS from 'crypto-js';

function generateSecretKey() {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

function encryptMessage(message, secretKey) {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
}

function decryptMessage(ciphertext, secretKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export { generateSecretKey, encryptMessage, decryptMessage };
