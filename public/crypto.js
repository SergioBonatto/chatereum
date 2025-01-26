function generateSecretKey() {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

function encryptMessage(message) {
    const secretKey = generateSecretKey();
    return CryptoJS.AES.encrypt(message, secretKey).toString();
}

function decryptMessage(ciphertext) {
    const secretKey = generateSecretKey();
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
