const rpcWSC = require('rpc-websockets').Client;
const readline = require('readline');

let ws = new rpcWSC('ws://localhost:4000/');

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        ws.notify(chunk.trim())
    }
});