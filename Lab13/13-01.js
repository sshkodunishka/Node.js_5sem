const net = require('net');

let HOST = '0.0.0.0'
let PORT = 40000;

net.createServer((sock) => {
    console.log('Server CONNECTED: ' + sock.remoteAddress + ' : ' + sock.remotePort);

    sock.on('data', (data) => {
        console.log('Server Data: ', sock.remoteAddress + ': ' + data);
        sock.write('ECHO ' + data);
    });
}).listen(PORT, HOST);

console.log('TCP-server ' + HOST + ': ' + PORT);