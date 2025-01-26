import { sendMessage, connectToPeer } from './peer.js';

const output = document.getElementById("output");
const messageInput = document.getElementById("message");
const peerData = document.getElementById("peer-data");

function appendMessage(message) {
    output.value += message + "\n";
}

document.querySelector("button:nth-of-type(1)").addEventListener("click", () => {
    const username = "User";
    const message = messageInput.value;
    sendMessage(username, message);
    messageInput.value = "";
});

document.querySelector("button:nth-of-type(2)").addEventListener("click", () => {
    const peerSignal = peerData.value.trim();
    if (!peerSignal) {
        appendMessage("Error: Empty connection signal.");
        return;
    }
    connectToPeer(peerSignal);
});

export { appendMessage };
