const http = require('http')
const url = require('url');
const { MongoClient, MongoServerError } = require('mongodb')
const ObjectId = require('mongodb').ObjectId;

const connStr = "mongodb://0.0.0.0:27017/replicaSet=rs0'"
const client = new MongoClient(connStr, { useNewUrlParser: true, useUnifiedTopology: false, family: 4 })
http.createServer(async function (request, response) {
    if (request.method === 'GET') {
        //==========================GET
        try {
            if (url.parse(request.url).pathname.includes('/api/faculties')) {
                await client.connect();
                let collection = client.db('BSTU').collection('faculty');
                let pathnames = request.url.split('/');
                if (pathnames[3]) {
                    let faculty = decodeURI(pathnames[3])
                    let faculties = await collection.find({ faculty: { $eq: faculty } }).toArray();
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(faculties))
                } else {
                    let faculties = await collection.find().toArray();
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(faculties))
                }
            }
            else if (url.parse(request.url).pathname.includes('/api/pulpits')) {
                await client.connect();
                let collection = client.db('BSTU').collection('pulpit');
                let pathnames = request.url.split('/');
                if (pathnames[3]) {
                    let pulpit = decodeURI(pathnames[3])
                    let pulpits = await collection.find({ pulpit: { $eq: pulpit } }).toArray();
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(pulpits))
                } else if (url.parse(request.url).query) {
                    let querys = decodeURI(url.parse(request.url).query).slice(2).split(',')
                    let pulpits = await collection.find({ faculty: { $in: querys } }).toArray();
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(pulpits))
                }
                else {
                    let pulpits = await collection.find().toArray();
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify(pulpits))
                }
            }
        } catch (e) {
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify({ error: e.message }))
        }
    } else if (request.method === 'POST') {
        //======================================POST
        if (url.parse(request.url).pathname === '/api/faculties') {
            await client.connect();
            let collection = client.db('BSTU').collection('faculty');
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let faculties = JSON.parse(data);
                    let faculty = faculties.faculty
                    let facultyName = faculties.faculty_name
                    const insertResult = await collection.insertOne({ faculty: faculty, faculty_name: facultyName })
                    const insertedFaculty = await collection.findOne({ _id: insertResult.insertedId })
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ insertedFaculty }))
                } catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/pulpits') {
            await client.connect();
            let collection = client.db('BSTU').collection('pulpit');
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let pulpits = JSON.parse(data);
                    let pulpit = pulpits.pulpit
                    let pulpitName = pulpits.pulpit_name
                    let faculty = pulpits.faculty
                    const insertResult = await collection.insertOne({ pulpit: pulpit, pulpit_name: pulpitName, faculty: faculty })
                    const insertedPulpit = await collection.findOne({ _id: insertResult.insertedId })
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ insertedPulpit }))
                } catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/transaction') {
            await client.connect();

            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });

            request.on("end", async () => {
                const pulpits = JSON.parse(data)
                const transactionOptions = {
                    readConcern: { level: 'local' }, // local, available, majority, linearizable, snapshot
                    writeConcern: { level: 'majority' }
                }
                const session = client.startSession()

                const commit = decodeURI(url.parse(request.url).query).slice(7)
                try {
                    await session.startTransaction(transactionOptions)
                    let collection = client.db('BSTU').collection('pulpit');
                    await collection.insertMany(pulpits, { session });

                    if (commit === 'true') {
                        await session.commitTransaction();
                        await session.endSession();
                        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        response.end(JSON.stringify({ message: 'Commited' }))
                    }
                    else {
                        await session.abortTransaction();
                        await session.endSession();
                        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        response.end(JSON.stringify({ message: 'Roll back' }))
                    }


                }
                catch (e) {
                    await session.abortTransaction();
                    await session.endSession()
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
    } else if (request.method === 'PUT') {
        //======================================PUT
        if (url.parse(request.url).pathname === '/api/faculties') {
            await client.connect();
            let collection = client.db('BSTU').collection('faculty');
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let faculties = JSON.parse(data);
                    let id = ObjectId(faculties._id)
                    let faculty = faculties.faculty
                    let facultyName = faculties.faculty_name

                    const result = await collection.updateOne({ _id: id },
                        { $set: { faculty: faculty, faculty_name: facultyName } }
                    )
                    const updatedFaculty = await collection.findOne({ _id: id })

                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ updatedFaculty }))
                } catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }
        else if (url.parse(request.url).pathname === '/api/pulpits') {
            await client.connect();
            let collection = client.db('BSTU').collection('pulpit');
            let data = "";
            request.on("data", (chunk) => {
                data += chunk;
            });
            request.on("end", async () => {
                try {
                    let pulpits = JSON.parse(data);
                    let id = ObjectId(pulpits._id)
                    let pulpit = pulpits.pulpit
                    let pulpitName = pulpits.pulpit_name
                    let faculty = pulpits.faculty
                    const result = await collection.updateOne({ _id: id },
                        { $set: { pulpit: pulpit, pulpit_name: pulpitName, faculty: faculty } }
                    )
                    const updatedPulpit = await collection.findOne({ _id: id })
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ updatedPulpit }))
                } catch (e) {
                    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    response.end(JSON.stringify({ error: e.message }))
                }
            })
        }

    } else if (request.method === 'DELETE') {
        //======================================PUT
        if (url.parse(request.url).pathname.includes('/api/faculties')) {
            await client.connect();
            let collection = client.db('BSTU').collection('faculty');
            let pathnames = request.url.split('/');
            let faculty = decodeURI(pathnames[3]);
            try {
                const result = await collection.findOneAndDelete({ faculty: faculty })
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ deletedResult: result.value }))
            } catch (e) {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ error: e.message }))
            }
        }
        else if (url.parse(request.url).pathname.includes('/api/pulpits')) {
            await client.connect();
            let collection = client.db('BSTU').collection('pulpit');
            let pathnames = request.url.split('/');
            let pulpit = decodeURI(pathnames[3]);
            try {
                const result = await collection.findOneAndDelete({ pulpit: pulpit })
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ deletedResult: result.value }))
            } catch (e) {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ error: e.message }))
            }
        }

    }
}).listen(3000)
