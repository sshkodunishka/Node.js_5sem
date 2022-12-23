const net = require('net');

let HOST = '127.0.0.1';
let PORT = 40000;

let client = new net.Socket();
let buf = new Buffer.alloc(4);
let timerId = null;
let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 1 : parm;

client.connect(PORT, HOST, () => {
    console.log('Client connected:', client.remoteAddress + ' ' + client.remotePort);
    timerId = setInterval(() => {
        buf.writeInt32LE(parm, 0);
        client.write(buf)
    }, 1000)

    setTimeout(() => {
        clearInterval(timerId);
        client.end();
    }, 20000)
})

client.on('data', (data) => {
    console.log('Client data: ' + data.readInt32LE());
});

client.on('close', () => {
    console.log('Client close');
});
client.on('error', (e) => {
    console.log('Client error')
})