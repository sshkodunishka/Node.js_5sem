const http = require('http');
const fs = require('fs');
const url = require('url');
const send = require('shkodunishka');


http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    if (url.parse(request.url).pathname === '/' && request.method === 'GET') {
        fs.readFile('./index.html', (err, data) => {
            response.end(data);
        })
    }

    if (url.parse(request.url).pathname === '/' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => { body += chunk.toString(); });
        request.on('end', () => {
            let parm = JSON.parse(body);
            console.log(parm.sender);
            send.send('06-03');
            response.end('Status: OK.\nSender: ' + parm.sender)
        })
    }
}).listen(5000);