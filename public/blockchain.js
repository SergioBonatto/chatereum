const blockchain = [];

function calculateHash(message, previousHash) {
    return CryptoJS.SHA256(`${message}${previousHash}${Date.now()}`).toString();
}

function createBlock(message) {
    const previousHash = blockchain.length
        ? blockchain[blockchain.length - 1].hash
        : "0";

    const block = {
        message,
        timestamp: new Date().toISOString(),
        previousHash,
        hash: calculateHash(message, previousHash),
    };

    blockchain.push(block);
    return block;
}
