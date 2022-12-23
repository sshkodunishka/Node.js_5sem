const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000, host: 'localhost' });
let clientName;
wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        console.log('on message: ', JSON.parse(data));
        clientName = JSON.parse(data).client;
    })

    let n = 0;
    setInterval(() => {
        const message = JSON.stringify({ server: n++, client: clientName, timestamp: new Date().toISOString() })
        ws.send(message)
    }, 5000)
})