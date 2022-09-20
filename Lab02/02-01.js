let http = require('http');
let fs = require('fs');

http.createServer(function (request, response) {
    if (request.url === '/') {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    }
    let html = fs.readFileSync('./index.html')
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
}).listen(5000);

console.log('Server running...')