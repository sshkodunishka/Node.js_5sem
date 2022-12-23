const http = require('http');
const url = require('url');
const fs = require('fs');
const sql = require('mssql');
const config = require('./config')


http.createServer(async function (request, response) {
    //------------------------------GET----------------------------
    if (request.method === 'GET') {
        try {
            if (url.parse(request.url).pathname === '/') {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(require("fs").readFileSync("./index.html"))
            }
            else if (url.parse(request.url).pathname === '/api/faculties') {
                const pool = await sql.connect(config)
                const faculties = await pool.request().query("SELECT * FROM FACULTY");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(faculties.recordset))
            }
            else if (url.parse(request.url).pathname === '/api/pulpits') {
                const pool = await sql.connect(config)
                const pulpits = await pool.request().query("SELECT * FROM PULPIT");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(pulpits.recordset))
            }
            else if (url.parse(request.url).pathname === '/api/subjects') {
                const pool = await sql.connect(config)
                const subjects = await pool.request().query("SELECT * FROM SUBJECT");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(subjects.recordset))
            }
            else if (url.parse(request.url).pathname.includes('/api/auditoriumtypes')) {
                let pathnames = request.url.split('/');
                if (pathnames[3]) {

                    let codeAuditorium = pathnames[3];
                    const pool = await sql.connect(config)
                    const auditoriumsPerType = await pool.request()
                        .input('code', sql.Char, decodeURI(codeAuditorium))
                        .query("SELECT * FROM AUDITORIUM WHERE AUDITORIUM_TYPE = @code");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(auditoriumsPerType.recordset))
                } else {
                    const pool = await sql.connect(config)
                    const auditoriumstypes = await pool.request().query("SELECT * FROM AUDITORIUM_TYPE");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(auditoriumstypes.recordset))
                }
            }
            else if (url.parse(request.url).pathname === '/api/auditoriums') {
                const pool = await sql.connect(config)
                const auditoriums = await pool.request().query("SELECT * FROM AUDITORIUM");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(auditoriums.recordset))
            }
            else if (url.parse(request.url).pathname.includes('/api/faculty')) {
                let pathnames = request.url.split('/');
                let codeFaculty = pathnames[3];
                const pool = await sql.connect(config)
                const pulpitsFaculty = await pool.request()
                    .input('code', sql.Char, decodeURI(codeFaculty).trim())
                    .query("SELECT * FROM PULPIT WHERE FACULTY = @code");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(pulpitsFaculty.recordset))
            }
        }
        catch (e) {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify({ error: e.message }))
        }
    }
    else if (request.method === 'POST') {
        //------------------------------POST----------------------------
        if (url.parse(request.url).pathname === '/api/pulpits') {

            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let pulpits = JSON.parse(data);
                    let pulpit = pulpits.pulpit;
                    let pulpitName = pulpits.pulpit_name;
                    let faculty = pulpits.faculty;
                    const pool = await sql.connect(config)
                    const pulpitsFaculty = await pool.request()
                        .input('pulpit', sql.Char, decodeURI(pulpit).trim())
                        .input('pulpitName', sql.Char, decodeURI(pulpitName).trim())
                        .input('faculty', sql.Char, decodeURI(faculty).trim())
                        .query("INSERT PULPIT(PULPIT, PULPIT_NAME, FACULTY) VALUES(@pulpit, @pulpitName, @faculty)");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)
                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/subjects') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {

                    let subjects = JSON.parse(data);
                    let subject = subjects.subject;
                    let subjectName = subjects.subject_name;
                    let pulpit = subjects.pulpit;
                    const pool = await sql.connect(config)
                    const addSubject = await pool.request()
                        .input('subject', sql.Char, decodeURI(subject).trim())
                        .input('subjectName', sql.Char, decodeURI(subjectName).trim())
                        .input('pulpit', sql.Char, decodeURI(pulpit).trim())
                        .query("INSERT SUBJECT(SUBJECT, SUBJECT_NAME, PULPIT) VALUES(@subject, @subjectName, @pulpit)");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)
                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }

        else if (url.parse(request.url).pathname === '/api/auditoriumstypes') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let auditoriums = JSON.parse(data);
                    let auditoriumType = auditoriums.auditorium_type;
                    let auditoriumTypename = auditoriums.auditorium_typename;
                    const pool = await sql.connect(config)
                    await pool.request()
                        .input('auditoriumType', sql.Char, decodeURI(auditoriumType).trim())
                        .input('auditoriumTypename', sql.Char, decodeURI(auditoriumTypename).trim())
                        .query("INSERT AUDITORIUM_TYPE(AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) VALUES(@auditoriumType, @auditoriumTypename)");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)
                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }

            })
        }
        else if (url.parse(request.url).pathname === '/api/auditoriums') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let auditoriums = JSON.parse(data);
                    let auditorium = auditoriums.auditorium;
                    let auditoriumName = auditoriums.auditorium_name;
                    let auditoriumCapacity = auditoriums.auditorium_capacity;
                    let auditoriumType = auditoriums.auditorium_type;
                    const pool = await sql.connect(config)
                    await pool.request()
                        .input('auditorium', sql.Char, decodeURI(auditorium).trim())
                        .input('auditoriumName', sql.Char, decodeURI(auditoriumName).trim())
                        .input('auditoriumCapacity', sql.Int, decodeURI(auditoriumCapacity).trim())
                        .input('auditoriumType', sql.Char, decodeURI(auditoriumType).trim())
                        .query("INSERT AUDITORIUM(AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE) VALUES(@auditorium, @auditoriumName,@auditoriumCapacity ,@auditoriumType)");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)

                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
    }
    else if (request.method === 'PUT') {
        //------------------------------PUT----------------------------
        if (url.parse(request.url).pathname === '/api/faculties') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let faculties = JSON.parse(data);
                    let faculty = faculties.faculty;
                    let facultyName = faculties.faculty_name;
                    const pool = await sql.connect(config)
                    await pool.request()
                        .input('faculty', sql.Char, decodeURI(faculty).trim())
                        .input('facultyName', sql.Char, decodeURI(facultyName).trim())
                        .query("UPDATE FACULTY SET FACULTY_NAME = @facultyName WHERE FACULTY = @faculty");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)

                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/pulpits') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let pulpits = JSON.parse(data);
                    let pulpit = pulpits.pulpit;
                    let pulpitName = pulpits.pulpit_name;
                    let faculty = pulpits.faculty;
                    const pool = await sql.connect(config)
                    const pulpitsFaculty = await pool.request()
                        .input('pulpit', sql.Char, decodeURI(pulpit).trim())
                        .input('pulpitName', sql.Char, decodeURI(pulpitName).trim())
                        .input('faculty', sql.Char, decodeURI(faculty).trim())
                        .query("UPDATE PULPIT SET PULPIT_NAME = @pulpitName, FACULTY = @faculty WHERE PULPIT=@pulpit");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)

                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/subjects') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let subjects = JSON.parse(data);
                    let subject = subjects.subject;
                    let subjectName = subjects.subject_name;
                    let pulpit = subjects.pulpit;
                    const pool = await sql.connect(config)
                    await pool.request()
                        .input('subject', sql.Char, decodeURI(subject).trim())
                        .input('subjectName', sql.Char, decodeURI(subjectName).trim())
                        .input('pulpit', sql.Char, decodeURI(pulpit).trim())
                        .query("UPDATE SUBJECT SET SUBJECT_NAME = @subjectName, PULPIT = @pulpit WHERE SUBJECT=@subject");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)

                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/auditoriumstypes') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let auditoriums = JSON.parse(data);
                    let auditoriumType = auditoriums.auditorium_type;
                    let auditoriumTypename = auditoriums.auditorium_typename;
                    const pool = await sql.connect(config)
                    await pool.request()
                        .input('auditoriumType', sql.Char, decodeURI(auditoriumType))
                        .input('auditoriumTypename', sql.Char, decodeURI(auditoriumTypename))
                        .query("UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @auditoriumTypename WHERE AUDITORIUM_TYPE=@auditoriumType");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)
                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/auditoriums') {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let auditoriums = JSON.parse(data);
                    let auditorium = auditoriums.auditorium;
                    let auditoriumName = auditoriums.auditorium_name;
                    let auditoriumCapacity = auditoriums.auditorium_capacity;
                    let auditoriumType = auditoriums.auditorium_type;
                    const pool = await sql.connect(config)
                    await pool.request()
                        .input('auditorium', sql.Char, decodeURI(auditorium))
                        .input('auditoriumName', sql.Char, decodeURI(auditoriumName))
                        .input('auditoriumCapacity', sql.Int, decodeURI(auditoriumCapacity))
                        .input('auditoriumType', sql.Char, decodeURI(auditoriumType))
                        .query("UPDATE AUDITORIUM SET AUDITORIUM_NAME = @auditoriumName, AUDITORIUM_CAPACITY = @auditoriumCapacity, AUDITORIUM_TYPE =@auditoriumType WHERE AUDITORIUM=@auditorium");
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(data)
                }
                catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        ///----------------------------------------DELETE----------------------------
    } else if (request.method === 'DELETE') {
        try {
            if (url.parse(request.url).pathname.includes('/api/faculties')) {
                let pathnames = request.url.split('/');
                let codeFaculty = pathnames[3];
                const pool = await sql.connect(config)
                const deleteFaculty = await pool.request()
                    .input('codeFaculty', sql.Char, decodeURI(codeFaculty).trim())
                    .query("DELETE FACULTY WHERE FACULTY = @codeFaculty");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(deleteFaculty))

            }
            else if (url.parse(request.url).pathname.includes('/api/pulpits')) {
                let pathnames = request.url.split('/');
                let codePulpit = pathnames[3];
                const pool = await sql.connect(config)
                const deletePulpit = await pool.request()
                    .input('codePulpit', sql.Char, decodeURI(codePulpit).trim())
                    .query("DELETE PULPIT WHERE PULPIT = @codePulpit");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end('DELETED')

            }
            else if (url.parse(request.url).pathname.includes('/api/subjects')) {
                let pathnames = request.url.split('/');
                let codeSubject = pathnames[3];
                const pool = await sql.connect(config)
                const deleteSubject = await pool.request()
                    .input('codeSubject', sql.Char, decodeURI(codeSubject).trim())
                    .query("DELETE SUBJECT WHERE SUBJECT = @codeSubject");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end('DELETED')

            }
            else if (url.parse(request.url).pathname.includes('/api/auditoriumstypes')) {
                let pathnames = request.url.split('/');
                let auditoriumType = pathnames[3];
                const pool = await sql.connect(config)
                const deleteAuditoriumType = await pool.request()
                    .input('auditoriumType', sql.Char, decodeURI(auditoriumType))
                    .query("DELETE AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @auditoriumType");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end('DELETED')

            }
            else if (url.parse(request.url).pathname.includes('/api/auditoriums')) {
                let pathnames = request.url.split('/');
                let auditorium = pathnames[3];
                const pool = await sql.connect(config)
                const deleteAuditorium = await pool.request()
                    .input('auditorium', sql.Char, decodeURI(auditorium).trim())
                    .query("DELETE AUDITORIUM WHERE AUDITORIUM = @auditorium");
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end('DELETED')

            }

        }
        catch (e) {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify({ error: e.message }))
        }

    }
}).listen(3000);

console.log('Сервер запущен...')