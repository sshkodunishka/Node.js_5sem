const http = require('http');
const url = require('url');
const fs = require('fs');

let data = require('./DB/db.js');
let db = new data.DB();

db.on('GET', (request, response) => {
    if (url.parse(request.url, true).query.id !== null) {
        let id = +url.parse(request.url, true).query.id;
        if (Number.isInteger(id)) {
            let selectedElem = db.selectById(id);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            if (!selectedElem) {
                response.end(JSON.stringify({}))
                return
            }
            response.end(JSON.stringify(selectedElem));
            return;
        }
    }
    console.log('GET');
    response.end(JSON.stringify(db.select()));
});

db.on('POST', (request, response) => {
    console.log('POST');

    request.on('data', data => {
        let row = JSON.parse(data);
        let lastId = db.getLastId();
        row.id = +lastId + 1;
        db.insert(row);
        response.end(JSON.stringify(row));
    });
});

db.on('PUT', (request, response) => {
    console.log('PUT');

    request.on('data', data => {
        let row = JSON.parse(data);
        db.update(row);
        response.end(JSON.stringify(row));
    });
});

db.on('DELETE', (request, response) => {
    console.log('DELETE');
    if (url.parse(request.url, true).query.id !== null) {
        let id = +url.parse(request.url, true).query.id;
        if (Number.isInteger(id)) {
            let deletedRow = db.delete(id);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(deletedRow));
        }
    }
});

db.on('COMMIT', () => {
    if (statistics.isStatOn) {
        statistics.commitNumber++;
    }
    db.commit();
});

let commitInterval;
let shutdownTimer;
let statisticsTimer;
let isStatOn = false;
const statistics = {
    commitNumber: 0,
    requestNumber: 0,
    start: null,
    finish: null
}

const server = http.createServer(function (request, response) {
    if (statistics.isStatOn) {
        statistics.requestNumber++;
    }
    if (url.parse(request.url).pathname === '/api/ss') {
        if (request.method === 'GET') {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(statistics))
            // response.end(JSON.stringify({
            //     finish: statistics.finish,
            //     start: statistics.start,
            //     commit: statistics.commitNumber,
            //     request: statistics.requestNumber
            // }))
        }
        return
    }
    if (url.parse(request.url).pathname === '/api/db') {
        console.log(request.method);
        response.setHeader('Content-Type', 'application/json')
        db.emit(request.method, request, response);
    }
    if (url.parse(request.url).pathname === '/') {
        let page = fs.readFileSync('./index.html');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(page);
    }
})
server.listen(5000);
process.stdin.setEncoding('utf8');


process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        if (chunk.trim().slice(0, 2) === 'sd') {
            const number = chunk.split(' ')[1]
            if (!number) {
                clearTimeout(shutdownTimer);
                console.log('empty')
                continue
            }
            if (shutdownTimer) {
                clearTimeout(shutdownTimer)
            }
            shutdownTimer = setTimeout(() => {
                server.close();
                console.log(`Server has been down after ${number.trim()} sec`);
                process.exit();
            }, number * 1000)
        }

        if (chunk.trim().slice(0, 2) === 'sc') {
            const number = chunk.split(' ')[1]
            if (!number) {
                clearInterval(commitInterval);
                console.log('empty interval')
                continue
            }

            commitInterval = setInterval(() => {
                db.emit('COMMIT');
            }, number * 1000);
            commitInterval.unref()
        }
        if (chunk.trim().slice(0, 2) === 'ss') {
            const number = chunk.split(' ')[1]
            if (!number) {
                statistics.isStatOn = false;
                statistics.finish = new Date().toLocaleDateString()
                clearTimeout(statisticsTimer)
                console.log('empty stat')
                continue
            }
            statistics.commitNumber = 0
            statistics.requestNumber = 0;
            statistics.finish = null
            statistics.isStatOn = true;
            statistics.start = new Date().toLocaleDateString()
            statisticsTimer = setTimeout(() => {
                statistics.isStatOn = false;
                statistics.finish = new Date().toLocaleDateString()
                console.log('Stop timer')
            }, number * 1000)
  
            statisticsTimer.unref()
        }
    }
})