const http = require('http');
const url = require('url')
const query = require('querystring');
const fs = require('fs');
const parseString = require('xml2js').parseString;

let xmlResponses = 0;

http.createServer(function (req, res) {
  if (req.method === 'GET') {
    if (url.parse(req.url).pathname === '/09-01') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('09-01');
    } else if (url.parse(req.url).pathname === '/09-02') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      let x = url.parse(req.url, true).query.x;
      let y = url.parse(req.url, true).query.y;
      res.end(`09-02 x:${x} y:${y} status:${res.statusCode}`);
      return;
    }else if(url.parse(req.url).pathname === '/09-08'){
        let bound = 'kristina';
        let body = '--' + bound + '--\n' +
            'Content-Disposition:form-data; name="file"; filename="txt.txt"\n' +
            'Content-Type:text/plain\n\n' +
            fs.readFileSync('txt.txt') +
            `\n--${bound}--\n`
        res.end(body);
    }
  }
  if (req.method === 'POST') {
    if (url.parse(req.url).pathname === '/09-03') {
      let dataString = '';
      let dataObj;
      req.on('data', chunk => {
        dataString += chunk;
      });

      req.on('end', () => {
        dataObj = query.parse(url.parse(req.url).query);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`09-03 x:${dataObj.x} y:${dataObj.y} s:${dataObj.s}`);

      })
    } else if(url.parse(req.url).pathname === '/09-04'){
        res.writeHead(200, { 'Content-Type': 'application/json' });
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const json = JSON.parse(data);
                const result = {
                    __comment: "Response Lab9",
                    x_plus_y: json.x + json.y,
                    Concatination_s_o: json.s + " " + Object.values(json.o).join(' '),
                    Length_m: json.m.length
                }
                res.end(JSON.stringify(result));
            });
    }else if(url.parse(req.url).pathname === '/09-05'){
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
    }else if(url.parse(req.url).pathname === '/09-06'){
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'multipart/form-data' });
            res.end(data);
    
          })
    }else if(url.parse(req.url).pathname === '/09-07'){
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'multipart/form-data' });
            res.end(data);
    
          })
    }
  }
}).listen(5000);
console.log('Server listening port 5000...')