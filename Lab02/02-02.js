let http = require('http');
let fs = require('fs');

http.createServer(function (request, response) {

    const fname = './crab.png';
    let png = null;

    fs.stat(fname, (err, stat) => {
        if (err) { console.log('error:', err); }
        else {
            png = fs.readFileSync(fname);
            response.writeHead(200, { 'Content-Type': 'image/png', 'Conctent-Length': stat.size })
            response.end(png, 'binary')
        }
    });
}).listen(5000);

console.log('Server running...')