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
            response.writeHead(200, {'Content-Type' : 'application/json'});
            if(!selectedElem){
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

db.on('DELETE', (request, response)=>{
	console.log('DELETE');
    if (url.parse(request.url, true).query.id !== null) {
        let id = +url.parse(request.url, true).query.id;
        if (Number.isInteger(id)) {
            let deletedRow = db.delete(id);
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(JSON.stringify(deletedRow));
        }
    }
});

http.createServer(function (request, response) {
	if(url.parse(request.url).pathname === '/api/db') {
        console.log(request.method);
        response.setHeader('Content-Type', 'application/json')
		db.emit(request.method, request, response);
        
	}
	if(url.parse(request.url).pathname === '/') {
        let page = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(page);
    }
}).listen(5000);