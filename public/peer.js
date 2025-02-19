import { EventEmitter } from 'https://cdn.skypack.dev/events';
import { createLibp2p } from 'https://cdn.jsdelivr.net/npm/libp2p@0.45.9/dist/src/index.min.js';
import { webRTCStar } from 'https://cdn.jsdelivr.net/npm/@libp2p/webrtc-star/dist/index.min.js';
import { noise } from 'https://cdn.jsdelivr.net/npm/@chainsafe/libp2p-noise/dist/index.min.js';
import { pubsubPeerDiscovery } from 'https://cdn.jsdelivr.net/npm/@libp2p/pubsub-peer-discovery/dist/index.min.js';

// Variável global para armazenar a instância do node
let globalNode = null;

export async function createNode() {
  const webRTCTransport = webRTCStar()

  const node = await createLibp2p({
    addresses: {
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ]
    },
    transports: [webRTCTransport],
    connectionEncryption: [noise()],
    peerDiscovery: [
      pubsubPeerDiscovery()
    ]
  })

  // Eventos de descoberta e conexão
  node.addEventListener('peer:discovery', (evt) => {
    const peer = evt.detail
    console.log('Peer descoberto:', peer.id.toString())
  })

  node.addEventListener('peer:connect', (evt) => {
    const peer = evt.detail
    console.log('Conectado ao peer:', peer.id.toString())
    document.getElementById('peer-data').value = peer.id.toString()
  })

  await node.start()
  globalNode = node // Armazena o node globalmente
  await setupChatProtocol(node)
  return node
}

export async function connectToPeer(peerId) {
    try {
      const connection = await globalNode.dial(peerId)
      console.log('Conectado ao peer:', connection.remotePeer.toString())
      return connection
    } catch (err) {
      console.error('Erro ao conectar:', err)
      throw err
    }
}

export async function sendMessageToPeer(peerId, message) {
    try {
      const connection = await globalNode.dial(peerId)
      const stream = await connection.newStream('/chat/1.0.0')
      await stream.sink([message])
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err)
      throw err
    }
}

export async function setupChatProtocol(node) {
    await node.handle('/chat/1.0.0', async ({ stream }) => {
      try {
        for await (const msg of stream.source) {
          const message = new TextDecoder().decode(msg)
          document.getElementById('output').value += `${message}\n`
        }
      } catch (err) {
        console.error('Erro no protocolo de chat:', err)
      }
    })
}
