const http = require("http");
const url = require('url');
const fs = require('fs');
const parseString = require('xml2js').parseString;

let xmlResponses = 0;

let http_handler = (req, res) => {
    if (req.method === 'GET') {
        if (url.parse(req.url).pathname === '/connection') {
            if (!url.parse(req.url, true).query.set) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h2>KeepAliveTimeout = ${server.keepAliveTimeout}</h2>`)
            } else {
                server.keepAliveTimeout = +url.parse(req.url, true).query.set;
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h2>KeepAliveTimeout = ${server.keepAliveTimeout}</h2>`);
            }
            return
        } else if (url.parse(req.url).pathname === '/headers') {
            res.setHeader('X-Shkodunishka', "lab8")
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            for (key in res.getHeaders()) {
                res.write(`<h3>response: ${key}: ${res.getHeaders()[key]}</h3>`);
            }
            for (key in req.headers) {
                res.write(`<h3>request: ${key}: ${req.headers[key]}</h3>`);
            }
            res.end()
            return
        } else if (url.parse(req.url).pathname.includes('/parameter')) {
            url_str = url.parse(req.url).pathname; 
            let url_array = url_str.split('/');
            if (url_array.length === 2) {
                let query = url.parse(req.url, true).query;
                query_length = Object.keys(query).length;
                if (query_length === 2) {
                    if (!isNaN(query.x) && !isNaN(query.y)) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write(`<h3>${query.x - query.y}</h3>`);
                        res.write(`<h3>${query.x * query.y}</h3>`);
                        res.write(`<h3>${query.x / query.y}</h3>`);
                        res.write(`<h3>${query.x + query.y}</h3>`);
                        res.end();
                        return;
                    }
                }
            }
            if (url_array.length >= 3) {
                let x = url_array[2];
                let y = url_array[3];
                if (!isNaN(x) && !isNaN(y)) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<h3>${parseInt(x) + parseInt(y)}</h3>`);
                    res.write(`<h3>${parseInt(x) - parseInt(y)}</h3>`);
                    res.write(`<h3>${parseInt(x) * parseInt(y)}</h3>`);
                    res.write(`<h3>${parseInt(x) / parseInt(y)}</h3>`);
                    res.end();
                    return
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<h3>http://${req.headers['host']}${req.url}</h3>`);
                    res.end();
                    return
                }
            }
            sendBadRequestError(res);
        } else if (url.parse(req.url).pathname === '/close') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(`<h1>Server will be closed in 10 sec</h1>`)
            setTimeout(process.exit, 10000);
            res.end()
            return
        } else if (url.parse(req.url).pathname === '/socket') {
            const serverInfo = server.address();
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            res.write('Server info: \n');
            res.write('IP: ' + serverInfo.address + '\n' +
                'Port: ' + serverInfo.port + '\n');

            res.write('Client info: \n');
            res.write('IP: ' + req.connection.remoteAddress + '\n' +
                'Port: ' + req.connection.remotePort + '\n');

            res.end();
            return
        } else if (url.parse(req.url).pathname === '/req-data') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            let buf = '';
            req.on('data', (chunk) => {
                console.log('data = ', chunk);
                console.log('requsent.on(data) = ', chunk.length);
                buf += chunk;
            });
            req.on('end', () => {
                console.log('request.on(end) = ', buf.length)
                res.end(buf);
            });
            return
        } else if (url.parse(req.url).pathname === '/resp-status') {
            let queryParams = url.parse(req.url, true).query;
            res.statusCode = parseInt(queryParams.code);
            res.statusMessage = queryParams.mess;
            res.end(queryParams.code + ' ' + queryParams.mess);
            return
        } else if (url.parse(req.url).pathname.includes('/files')) {
            let pathArray = url.parse(req.url, true).pathname.split('/');
            if (pathArray.length === 3) {
                let fileName = pathArray[2];
                let filePath = `./static/${fileName}`;
                //check if we have access by filepath
                fs.access(filePath, fs.constants.R_OK, err => {
                    if (err) {
                        res.writeHead(404, 'File not found.');
                        res.end('404');
                    } else {
                        let fileName_array = fileName.split('.');
                        switch (fileName_array[1]) {
                            case 'json':
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(fs.readFileSync(filePath));
                                break;
                            case 'js':
                                res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
                                res.end(fs.readFileSync(filePath));
                                break;
                            case 'html':
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(fs.readFileSync(filePath));
                                break;
                        }
                    }
                });
            }
            else if (pathArray.length === 2) {
                fs.readdir("./static", (err, files) => {
                    res.setHeader('X-static-files-countX-static-files-count', files.length.toString());
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(files.length.toString());
                })
                return
            }
        } else if (url.parse(req.url).pathname === '/upload') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync("upload.html"))
            return
        }
    }
    ///--------POST-------
    if (req.method === 'POST') {
        if (url.parse(req.url).pathname === '/formparameter') {
            res.writeHead(200, { 'Content-Type': 'text/html' });

            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data);
                res.end(data);
            });
        } else if (url.parse(req.url).pathname === '/json') {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const json = JSON.parse(data);
                const result = {
                    __comment: "Response Lab8",
                    x_plus_y: json.x + json.y,
                    Concatination_s_o: json.s + " " + Object.values(json.o).join(' '),
                    Length_m: json.m.length
                }
                res.end(JSON.stringify(result));
            });
        } else if (url.parse(req.url).pathname === '/xml') {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data);
                parseString(data, function (err, result) {
                    xmlResponses += 1;
                    let sum = 0;
                    let concat = '';
                    result.request.x.map((e, i) => {
                        sum += parseInt(e.$.value);
                    })
                    result.request.m.map((e, i) => {
                        concat += e.$.value;
                    })
                    res.setHeader('Content-Type', 'application/xml');
                    res.end(`<response id="${xmlResponses}" request="${result.request.$.id}">
                            <sum element="x" result="${sum}"></sum>
                            <text element="m" result="${concat}"></text>
                        </response>`
                    )
                });
            });
        } else if (url.parse(req.url).pathname === '/upload') {
            // req.on('data', chunk => {
            //     console.log(chunk.toString('utf-8'))
            // })
            const formidable = require('formidable');

            let form = new formidable.IncomingForm();
            form.uploadDir = __dirname + "/static";
            form.parse(req, function (err, fields, files) {
                let oldpath = files.filetoupload.filepath;
                let newpath = './static/' + files.filetoupload.newFilename + '-' + files.filetoupload.originalFilename
                fs.rename(oldpath, newpath, function (err) {
                    res.write('File uploaded.');
                    res.end();
                });
            });
        }
    }
}


let server = http.createServer();
server.keepAliveTimeout = 10000;


server.listen(5000, (v) => { console.log('server listen http://localhost:5000/') })
    .on('error', (e) => { console.log('server listen http://localhost:5000/: ERROR', e.code) })
    .on('request', http_handler);

function sendBadRequestError(res) {
    res.statusCode = 400;
    res.statusMessage = 'Bad request';
    res.end("HTTP ERROR 400: Bad request");
}