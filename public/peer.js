import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
let peer = null;

function createRoom() {
    socket.emit('create-room');
    socket.once('room-created', (roomId) => {
        console.log('Room created:', roomId);
        setupPeer(true);
    });
}

function joinRoom(roomId) {
    socket.emit('join-room', roomId);
    socket.once('room-joined', () => {
        console.log('Joined room:', roomId);
        setupPeer(false);
    });
}

function setupPeer(isInitiator) {
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
            target: isInitiator ? 'guest' : 'host',
            signal: data
        });
    });

    socket.on('signal', (signal) => {
        peer.signal(signal);
    });

    peer.on('connect', () => {
        console.log('Peer connected');
    });

    peer.on('data', (data) => {
        console.log('Received:', data.toString());
    });
}

function sendMessage(message) {
    if (peer) {
        peer.send(message);
    }
}

export { createRoom, joinRoom, sendMessage };
