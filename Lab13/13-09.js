const udp = require('dgram');
const PORT = 3000;

let server = udp.createSocket('udp4');
server.on('error', (err) => {
    console.log('Error: ' + err);
    server.close();
});

server.on('message', (msg, info) => {
    // console.log('Server: info from client ' + msg.toString());
    // console.log(`Server: received ${msg.length} bites from ${info.address}: ${info.port}\n `);

    server.send("ECHO " + msg, info.port, info.address, (err) => {
        if (err) {
            server.close();
        } else {
            console.log('Server: Message was sanded client');
        }
    })
});


server.on('listening', () => {
    console.log(`Server PORT: ${server.address().port}`);
    console.log(`Server Address: ${server.address().address}`);
    console.log(`Server IPv: ${server.address().family}`);
})

server.on('close', () => {
    console.log('Server CLOSED')
})

server.bind(PORT);