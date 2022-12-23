const udp = require('dgram');
const PORT = 3000;
const client = udp.createSocket('udp4')

client.on('message', (msg, info) => {
    console.log( msg.toString());
    // console.log(`Client: received ${msg.length} bites from ${info.address}: ${info.port}\n`);
 });

let data = Buffer.from('Client: message 01');
client.send(data, PORT, 'localhost', (err) => {
    if (err) {
        client.close();
    } else {
        console.log('Client: Message sent to server');
    }
})
let data1 = Buffer.from('Hello')
let data2 = Buffer.from('lllll')

client.send([data1, data2], PORT, 'localhost', (err) => {
    if (err) {
        client.close();
    } else {
        console.log('Client: Message sent to server');
    }
})