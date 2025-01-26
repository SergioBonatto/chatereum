const blockchain = [];

function calculateHash(username, message, previousHash) {
    return btoa(`${username}${message}${previousHash}${Date.now()}`);
}

function createBlock(username, message) {
    const previousHash = blockchain.length ? blockchain[blockchain.length - 1].hash : "0";
    const block = {
        username,
        message,
        timestamp: new Date().toISOString(),
        previousHash,
        hash: calculateHash(username, message, previousHash),
    };
    blockchain.push(block);
    return block;
}

export { blockchain, createBlock };
