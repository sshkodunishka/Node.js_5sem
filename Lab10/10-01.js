const WebSocket = require('ws');

const httpserver = require('http').createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/start') {
        res.writeHead(200, { 'Content-Type': 'text/html; charser=utf-8' });
        res.end(require('fs').readFileSync('./index.html'));
    } else {
        res.statusCode = 400;
        res.end('ERROR 400')
    }
});
httpserver.listen(3000);
console.log('wsserver: 3000');

let k = 0;

const wsserver = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver' });
wsserver.on('connection', (ws) => {
    ws.on('message', message =>{
        console.log(`${message}`)
        lastMessage = message.slice(-1);
    })
    let interval = setInterval(()=>{ws.send(`10-01-server:${lastMessage}->${++k}`)}, 5000)
    setTimeout(() => {;
        clearInterval(interval);}, 25000);
})
wsserver.on('error',(e)=>{console.log('ws server error ', e)});
 wsserver.onclose = (e)=>{console.log('socket close');
wsserver.close(console.log('wssocket close'));};
console.log(`ws server: host:${wsserver.options.host}, port:${wsserver.options.port}, path:${wsserver.options.path}`)
