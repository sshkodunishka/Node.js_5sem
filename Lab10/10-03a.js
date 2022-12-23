const WebSocket = require('ws')

let parm = process.argv[2]; 

console.log('parm = ', parm);

let prfx = typeof parm == 'undefined'?'A':parm;
const ws = new WebSocket('ws://localhost:5000/broadcast')

ws.on('open', ()=>{

    let k = 0;
    setInterval(()=>{
        ws.send(`client: ${prfx}-${++k}`);
    }, 1000);
    ws.on('message', message =>{
        console.log(`Received message => ${message}`)
    })
    
})