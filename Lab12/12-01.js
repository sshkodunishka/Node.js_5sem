const fs = require('fs');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

http.createServer((request, response) => {
    let students = JSON.parse(fs.readFileSync("./StudentList.json", "utf8"))
    if (request.method === 'GET') {
        if (url.parse(request.url).pathname == '/') {
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(students));
        } else if (url.parse(request.url).pathname == '/backup') {
            let files = [];
            fs.readdir('./files', function (err, items) {
                items.forEach(file => {
                    files.push(file)
                })
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify(files));
            })
        } else if (url.parse(request.url).pathname.split('/').length > 1) {
            const n = request.url.split('/')[1];
            const student = students.find(student => student.id == n)
            if (student) {
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify(student));
            } else {
                response.setHeader('Content-Type', 'text/html; charset=utf-8');
                response.end(" 404 Not found");
            }
        }

    } else if (request.method === 'POST') {
        if (url.parse(request.url).pathname == '/') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", () => {
                let student = JSON.parse(data);
                if (students.find((st) => st.id == student.id) == null) {
                    students.push(student);
                    fs.writeFileSync("./StudentList.json", JSON.stringify(students));
                    response.writeHead(200, { "Content-Type": "application/json" });
                    response.end(JSON.stringify(student));
                } else {
                    console.log('error')
                    response.setHeader('Content-Type', 'text/html; charset=utf-8');
                    response.end(" Error");
                }
            })
        } else if (url.parse(request.url).pathname == '/backup') {
            let date = new Date();
            setTimeout(() => {
                fs.copyFile('./StudentList.json', `./files/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getSeconds()}_StudentList.json`, (err) => {
                    if (err) {
                        response.setHeader('Content-Type', 'text/html; charset=utf-8');
                        response.end(" Error");
                    } else {
                        console.log('Succesful')
                    }
                })
            }, 2000)

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(date));
        }
    } else if (request.method === 'PUT') {
        if (url.parse(request.url).pathname == '/') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", () => {
                let student = JSON.parse(data);
                if (students.find((st) => st.id == student.id)) {
                    let st = students.find((st) => st.id == student.id)
                    st.id = student.id;
                    st.name = student.name;
                    st.bday = student.bday;
                    st.specility = student.specility;
                    fs.writeFileSync("./StudentList.json", JSON.stringify(students));
                    response.writeHead(200, { "Content-Type": "application/json" });
                    response.end(JSON.stringify(student));
                } else {
                    console.log('error')
                    response.setHeader('Content-Type', 'text/html; charset=utf-8');
                    response.end(" Error");
                }
            })
        }
    } else if (request.method === 'DELETE') {
        if (request.url.includes('backup')) {
            let oldDate = request.url.split('backup/')[1];
            console.log(oldDate)
            let files = [];
            fs.readdir('./files', function (err, items) {
                items.forEach(file => {
                    files.push(file)
                })
                console.log(files)
                files.forEach(file => {
                    let date = file.slice(0, 8);
                    console.log('-------------', date)
                    if (parseInt(oldDate) > parseInt(date)) {
                        fs.unlinkSync(`./files/${file}`)
                    } else {
                        console.log('delete')
                    }
                })
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify(oldDate));
            });
        } else if (url.parse(request.url).pathname.split('/').length > 1) {
            const n = request.url.split('/')[1];
            const student = students.find(student => student.id == n)
            if (student) {
                let myId = students.indexOf(student)
                students.splice(myId, 1)
                fs.writeFileSync("./StudentList.json", JSON.stringify(students));
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
                response.end(JSON.stringify(student));
            } else {
                response.setHeader('Content-Type', 'text/html; charset=utf-8');
                response.end(" 404 Not found");
            }

        }
    }
}).listen(5000)

let wss = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/broadcast' });

fs.watch('./StudentList.json', { encoding: 'buffer' }, (eventType, filename) => {
    if (eventType === 'change') {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Файл ${filename} изменен`);
            }
        });
    }
});