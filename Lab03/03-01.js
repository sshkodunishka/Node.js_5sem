let http = require('http');
let state = 'norm';

http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`<h1>` + state + `</h1>`)
}).listen(5000);

process.stdin.setEncoding('utf8');
process.stdout.write('Server running at http://localhost:5000/\n');
process.stdout.write(state + '->');

process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        if (chunk.trim() === 'norm' || chunk.trim() === 'test' || chunk.trim() === 'stop' || chunk.trim() === 'idle') {
            process.stdout.write('reg =' + state + '-->' + chunk.trim() + '\n');
            state = chunk.trim();
            process.stdout.write(state + '->')
        }
        else if (chunk.trim() === 'exit') {
            process.exit(0);
        }
        else {
            process.stderr.write(state + '->');
        }
    }
});

// console.log('Server running...')