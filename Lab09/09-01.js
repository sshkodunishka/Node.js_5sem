const http = require('http');
const query = require('querystring');
const fs = require('fs');

let options = {
    host: 'localhost',
    path: '/09-01',
    port: 5000,
    method: "GET"
}

const reqDaten = http.request(options, (res) => {
    console.log('------------TASK№1-----------')
    console.log('http.request: method = ', reqDaten.method);
    console.log('http.request: response = ', res.statusCode);
    console.log('http.request: statusMessage = ', res.statusMessage);
    console.log('http.request: socket.remoteAdress = ', res.socket.remoteAddress);
    console.log('http.request: res.socket.remotePort = ', res.socket.remotePort);
    console.log('http.request: res.headers = ', res.headers);

    let data = '';
    res.on('data', (chunk) => {
        console.log('http.request: data: body =', data += chunk.toString('utf8'))
    });
    res.on('end', () => {
        console.log('http.request: end: body =', data);
    });
})
reqDaten.on('error', (e) => {
    console.log('http.request: error: ', e.message);
});
reqDaten.end();

let params = query.stringify({ x: 3, y: 4 });
options.path = `/09-02?${params}`;

const reqParameter = http.request(options, (res) => {
    console.log('------------TASK№2-----------')
    console.log('Status code: ' + res.statusCode + res.statusMessage);
    let data = '';
    res.on('data', (chunk) => {
        console.log('Parameters: ', data += chunk.toString('utf8'));
    })
})
reqParameter.end();


let paramss = query.stringify({ x: 3, y: 4, s: 'Shkodunishka' });
options.path = `/09-03?${paramss}`;
options.method = 'POST';

const reqParameters = http.request(options, (res) => {
    console.log('------------TASK№3-----------')
    console.log('Status code: ' + res.statusCode + res.statusMessage);
    let data = '';
    res.on('data', (chunk) => {
        console.log('Parameters: ', data += chunk.toString('utf-8'));
    })
})
reqParameters.end();


let jsonm = JSON.stringify({
    __comment: 'comment',
    x: 1,
    y: 2,
    s: 'Shkodunishka',
    m: ['a', 'b', 'c'],
    o: {
        surname: 'Shkoda',
        name: 'Kristina'
    }
});
options.path = `/09-04`;
options.headers = { 'content-type': 'application/json', 'accept': 'application/json' }
const reqJson = http.request(options, (res) => {
    console.log('------------TASK№4-----------');
    console.log('Status code: ' + res.statusCode);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk.toString('utf-8');
    });
    res.on('end', () => {
        console.log('Body: ', JSON.parse(data));
    });
});
reqJson.end(jsonm);


options.path = `/09-05`;
options.headers = { 'content-type': 'text/xml', 'accept': 'text/xml' };
const reqXml = http.request(options, (res) => {
    console.log('------------TASK№5-----------');
    let data = '';
    res.on('data', (chunk) => { console.log('XML: ', data += chunk.toString('utf-8')) });
});
reqXml.end(fs.readFileSync(__dirname + '/files/xml.xml'));

options.path = `/09-06`;
options.headers = { 'content-type': 'multipart/form-data', 'accept': 'multipart/form-data' };
const reqMyFile = http.request(options, (res) => {
    console.log('------------TASK№6-----------');
    let data = '';
    res.on('data', (chunk) => { console.log('MyFile: ', data += chunk.toString('utf-8')) });
});
reqMyFile.end(fs.readFileSync(__dirname + '/files/MyFile.txt'));

options.path = `/09-07`;
options.headers = { 'content-type': 'multipart/form-data', 'accept': 'multipart/form-data' };
const reqMyPng = http.request(options, (res) => {
    console.log('------------TASK№7-----------');
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Length: ', data.length);
    });
});
reqMyPng.end(fs.readFileSync(__dirname + '/files/MyFile.png'));

options.path = `/09-08`;
options.headers = { 'content-type': 'text/plain', 'accept': 'text/plain' };
options.method = 'GET';
const reqFile = http.request(options, (res) => {
    console.log('------------TASK№8-----------');
    let data = '';
    res.on('data', (chunk) => { 
        console.log('File: \n', data += chunk.toString('utf8'));
     });
     res.on('end', ()=>{
        console.log(Buffer.byteLength(data));
     })
});

reqFile.end();

