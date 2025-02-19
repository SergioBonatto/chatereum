const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const { NOISE } = require('libp2p-noise')
const Bootstrap = require('libp2p-bootstrap')
const DHT = require('libp2p-kad-dht')
const multiaddr = require('multiaddr')

let node = null;

async function createNode() {
  node = await Libp2p.create({
    addresses: {
      listen: ['/ip4/0.0.0.0/tcp/0']
    },
    modules: {
      transport: [TCP],
      streamMuxer: [Mplex],
      connEncryption: [NOISE],
      peerDiscovery: [Bootstrap, DHT]
    },
    config: {
      peerDiscovery: {
        autoDial: true, // Automatically connect to discovered peers
        bootstrap: {
          list: [
            // Here you would list known bootstrap nodes for your network
            '/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
            '/ip4/104.236.176.52/tcp/4001/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z'
          ]
        },
        dht: {
          enabled: true,
          randomWalk: {
            enabled: true
          }
        }
      }
    }
  });

  node.on('peer:discovery', (peerInfo) => {
    console.log('Discovered:', peerInfo.id.toB58String());
    document.getElementById('peer-data').value = peerInfo.id.toB58String();
  });

  node.handle('/chat/1.0.0', ({ stream }) => {
    pump(stream, sink((data) => {
      const decryptedMessage = decryptMessage(data.toString());
      appendMessage(`Peer: ${decryptedMessage}`);
    }), (err) => {
      if (err) console.error(err)
    })
  });

  node.on('peer:connect', (connection) => {
    document.querySelector('button:nth-of-type(1)').disabled = false;
    appendMessage('Peer connected successfully!');
  });

  await node.start();
  console.log('Node started with ID:', node.peerId.toB58String());

  // Store self in DHT for discovery
  await node.contentRouting.provide(node.peerId, '/chat/1.0.0');
}

function findAndConnectToPeer() {
  if (!node) return appendMessage('Node not initialized');

  node.contentRouting.findProviders('/chat/1.0.0', 1).then((providers) => {
    if (providers.length > 0) {
      const peerId = providers[0].id;
      node.dialProtocol(peerId, '/chat/1.0.0').then(({ stream }) => {
        pump(stream, sink((data) => {
          const decryptedMessage = decryptMessage(data.toString());
          appendMessage(`Peer: ${decryptedMessage}`);
        }), (err) => {
          if (err) console.error(err)
        });
        appendMessage(`Connected to peer: ${peerId.toB58String()}`);
      }).catch(err => {
        appendMessage(`Connection error: ${err.message}`);
      });
    } else {
      appendMessage('No peers providing /chat/1.0.0 found');
    }
  });
}

function sendMessage(message) {
  if (node) {
    const encryptedMessage = encryptMessage(message);
    // Assume we have at least one connection
    const peers = node.peerStore.peers.values();
    for (const peer of peers) {
      node.dialProtocol(peer.id, '/chat/1.0.0').then(({ stream }) => {
        stream.write(Buffer.from(encryptedMessage));
        appendMessage(`You: ${message}`);
      }).catch(err => {
        appendMessage(`Error sending message: ${err.message}`);
      });
    }
  }
}

function appendMessage(message) {
  const output = document.getElementById('output');
  output.value += message + '\n';
  output.scrollTop = output.scrollHeight;
}

window.createNode = createNode;
window.findAndConnectToPeer = findAndConnectToPeer;
window.sendMessage = sendMessage;

// Note: You need to implement `encryptMessage` and `decryptMessage` functions for secure communication.
