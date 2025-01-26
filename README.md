
## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/chatereum.git
    cd chatereum
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

## Uso

1. Inicie o servidor:
    ```sh
    node server.js
    ```

2. Abra o arquivo [index.html](http://_vscodecontentref_/7) em seu navegador.

## Funcionalidades

- **Criação de Sala**: Crie uma sala para iniciar uma sessão de chat P2P.
- **Conexão à Sala**: Conecte-se a uma sala existente usando o ID da sala.
- **Envio de Mensagens**: Envie mensagens criptografadas para o peer conectado.
- **Blockchain**: Cada mensagem enviada é registrada em um blockchain simples.

## Scripts

- [server.js](http://_vscodecontentref_/8): Configura e inicia o servidor de sinalização usando Express e Socket.IO.
- [crypto.js](http://_vscodecontentref_/9): Funções para geração de chaves secretas e criptografia/descriptografia de mensagens.
- [peer.js](http://_vscodecontentref_/10): Configura a conexão P2P usando SimplePeer e gerencia a comunicação entre os peers.
- [ui.js](http://_vscodecontentref_/11): Gerencia a interface do usuário e a interação com os elementos da página.
- [blockchain.js](http://_vscodecontentref_/12): Implementa um blockchain simples para registrar mensagens.

## Dependências

- [Express](https://www.npmjs.com/package/express)
- [Simple-Peer](https://www.npmjs.com/package/simple-peer)
- [Socket.IO](https://www.npmjs.com/package/socket.io)
- [UUID](https://www.npmjs.com/package/uuid)
- [CryptoJS](https://cdnjs.com/libraries/crypto-js)

## Licença

Este projeto está licenciado sob a licença ISC.
