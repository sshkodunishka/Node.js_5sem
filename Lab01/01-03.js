const http = require('http')


const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk
  })
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' })

  req.on('end', () => {
    let headersHtml = ''
    for (field in req.headers) {
      headersHtml += `<h3>Header ${field}: ${req.headers[field]}</h3>`
    }
    res.end(`
      <h1>Request method: ${req.method}</h1>
      <h1>Request url: ${req.url}</h1>
      <h1>Request body: ${body}</h1>
      ${headersHtml}
  `)
  })
})

server.listen(3000, () => {
  console.log('server has started...')
})