const config = {
    user: 'student',
    server: 'localhost',
    password: 'fitfit',
    database: 'SKM', 
    options: {
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 4,
        idleTimeoutMillis: 30000
    },
}
module.exports = config;