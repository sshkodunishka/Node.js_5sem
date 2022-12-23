const rpcWSC = WebSocket = require('rpc-websockets').Client;
let wsC = new rpcWSC('ws://localhost:4000');

wsC.on('open', () => {
    wsC.subscribe('C');
    wsC.on('C', () => {
        console.log('Event C');
    });
});