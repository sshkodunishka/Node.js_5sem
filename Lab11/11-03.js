const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000, host: 'localhost' });
let n = 0;

wss.on('connection', (ws) => {
    setInterval(() => {
        wss.clients.forEach((client) => {
            client.send(`11-03-server: ${n++}`);
        });
    }, 15000);

    setInterval(() => {
        console.log('server:ping');
        ws.ping('server:ping');
        console.log(wss.clients.size.toString());
    }, 5000)
    ws.on('pong', (data) => {
        console.log(`on pong ${data.toString()}`);
    })
})