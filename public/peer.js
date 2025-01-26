const socket = io('http://localhost:3000');
let peer = null;

function createRoom() {
    socket.emit('create-room');
    socket.once('room-created', (roomId) => {
        document.getElementById('peer-data').value = roomId;
        setupPeer(true, roomId);
    });
}

function joinRoom(roomId) {
    socket.emit('join-room', roomId);
    socket.once('room-joined', () => {
        setupPeer(false, roomId);
    });
}

function setupPeer(isInitiator, roomId) {
    peer = new SimplePeer({
        initiator: isInitiator,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        }
    });

    peer.on('signal', (data) => {
        socket.emit('signal', {
            roomId: roomId,
            signal: data
        });
    });

    socket.on('signal', (data) => {
        peer.signal(data.signal);
    });

    peer.on('connect', () => {
        document.querySelector('button:nth-of-type(1)').disabled = false;
        appendMessage('Peer connected successfully!');
    });

    peer.on('data', (data) => {
        const decryptedMessage = decryptMessage(data.toString());
        appendMessage(`Peer: ${decryptedMessage}`);
    });
}

function sendMessage(message) {
    if (peer && peer.connected) {
        const encryptedMessage = encryptMessage(message);
        peer.send(encryptedMessage);
        appendMessage(`You: ${message}`);
    }
}

function connectToPeer(peerSignal) {
    try {
        peer.signal(JSON.parse(peerSignal));
    } catch (e) {
        appendMessage(`Connection error: ${e.message}`);
    }
}

function appendMessage(message) {
    const output = document.getElementById('output');
    output.value += message + '\n';
    output.scrollTop = output.scrollHeight;
}

window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.sendMessage = sendMessage;
window.connectToPeer = connectToPeer;
