const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');


ws.on('message',(data)=>{
    console.log(data.toString());
})
ws.on('ping',(data)=>{
     console.log(`on ping: ${data.toString()}`);
    ws.pong('client pong')
})
