let http = require('http');
let url = require("url");
let fs = require('fs');
const server = http.createServer;

let factorial = (n) => { return (n < 2 ? n : n * factorial(n - 1)); }

function Fact(n, cb) {
    this.fn = n;
    this.ffact = factorial;
    this.fcb = cb;
    const executeNow = () => { this.fcb(null, this.ffact(this.fn)); }
    this.calc = () => { process.nextTick(executeNow); }
}
server((req, res) => {
    switch (url.parse(req.url).pathname) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync('03-03.html'));
            break;
        case '/fact':
            if (url.parse(req.url).query === null) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end("Hello World");
            }
            else {
                let k = url.parse(req.url, true).query.k;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                const generateResponse = (err, result) => { res.end(JSON.stringify({ k: k, fact: result })); }
                let fact = new Fact(k, generateResponse );
                fact.calc();
            }
            break;
    }
}).listen(5000, 'localhost', () => {
    console.log('Server start at 5000 port');
});