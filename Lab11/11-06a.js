const rpcWSC = WebSocket = require('rpc-websockets').Client;
let wsA = new rpcWSC('ws://localhost:4000');

wsA.on('open', () => {
    wsA.subscribe('A');
    wsA.on('A', () => {
        console.log('Event A');
    });
});