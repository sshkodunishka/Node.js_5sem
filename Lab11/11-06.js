const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS({ port: 4000, host: "localhost" });
server.event('A');
server.event('B');
server.event('C');
process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        if (chunk.trim() == 'A') {
            server.emit('A');
        }
        if (chunk.trim() == 'B') {
            server.emit('B');
        }
        if (chunk.trim() == 'C') {
            server.emit('C');
        }
    }
});