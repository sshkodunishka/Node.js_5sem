const net = require('net');

let HOST = '0.0.0.0'
let PORT1 = 40000;
let PORT2 = 50000;
let num = 0;

let h = (n) => {
    return (sock) => {
        console.log(`Connected ${n}: ` + sock.remoteAddress + ': ' + sock.remotePort);
        sock.on('data', (data) => {
            num = data.readInt32LE().toString();
            console.log(`Server data: ${num}`);
            sock.write('ECHO: ' + num);
        });

        sock.on('close', () => {
            console.log('Server closed: ', sock.remoteAddress + ' ' + sock.remotePort);
            console.log('--------------------------------------------------------------------');
        });
    }
}

net.createServer(h(PORT1)).listen(PORT1, HOST).on('listening', () => {
    console.log(`TCP-server ${HOST}: ${PORT1}`);
})
net.createServer(h(PORT2)).listen(PORT2, HOST).on('listening', () => {
    console.log(`TCP-server ${HOST}: ${PORT2}`);
})

