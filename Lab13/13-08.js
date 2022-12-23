const net = require('net');

const HOST = '127.0.0.1';
const PORT = process.argv[2] ? process.argv[2] : 40000;


let client = new net.Socket();
let buf = new Buffer.alloc(4);
let timerId = null;

client.connect(PORT, HOST, () => {
    console.log('Client connected:', client.remoteAddress + ' ' + client.remotePort);
    let X = 0;
    let input = process.stdin;
    input.on('data', data => {
        X = data;
        setInterval(() => {
            client.write((buf.writeInt32LE(X, 0), buf));
        }, 1000);
        client.on('data', data => {
            console.log(`Client data: ${data.toString()}`);
        });

    
    })


});

client.on('close', () => {
    console.log('Client close');
});
client.on('error', (e) => {
    console.log('Client error')
})