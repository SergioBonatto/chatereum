import { createLibp2p } from '/node_modules/libp2p/dist/index.js'
import { WebRTCStar } from '/node_modules/@libp2p/webrtc-star/dist/index.js'
import { noise } from '/node_modules/@chainsafe/libp2p-noise/dist/index.js'
import { bootstrap } from '/node_modules/@libp2p/bootstrap/dist/index.js'
import { pubsubPeerDiscovery } from '/node_modules/@libp2p/pubsub-peer-discovery/dist/index.js'

async function createNode() {
  const webRTCStar = new WebRTCStar()

  const node = await createLibp2p({
    addresses: {
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
      ]
    },
    transports: [webRTCStar],
    connectionEncryption: [noise()],
    peerDiscovery: [
      bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTiezGAk'
        ]
      }),
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
  return node
}

export async function connectToPeer(peerId) {
    try {
      const connection = await node.dial(peerId)
      console.log('Conectado ao peer:', connection.remotePeer.toString())
      return connection
    } catch (err) {
      console.error('Erro ao conectar:', err)
      throw err
    }
  }

  export async function sendMessageToPeer(peerId, message) {
    try {
      const connection = await node.dial(peerId)
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
