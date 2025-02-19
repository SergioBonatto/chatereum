function isValidBlock(block, previousBlock) {
    if (!previousBlock) return true; // Genesis block

    return block.previousHash === previousBlock.hash &&
           block.hash === calculateHash(block.message, block.previousHash);
}

function isValidChain(chain) {
    if (!Array.isArray(chain) || chain.length === 0) return false;

    for (let i = 1; i < chain.length; i++) {
        if (!isValidBlock(chain[i], chain[i-1])) {
            return false;
        }
    }
    return true;
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
