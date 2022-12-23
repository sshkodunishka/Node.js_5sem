const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');
const parm = process.argv[2];

ws.on('open', () => {
    ws.on('message', data => {
        console.log('on message: ', JSON.parse(data.toString()));
    })
    setInterval(() => {
        ws.send(JSON.stringify({ client: parm, timestamp: new Date().toISOString() }))
    }, 3000)
})