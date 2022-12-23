const net = require("net");

let HOST = "0.0.0.0";
let PORT = 40000;

let server = net.createServer();
server.on("connection", (sock) => {
  let sum = 0;
  console.log(
    "Server CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort
  );
  sock.on("data", (data) => {
    console.log("Server data " + data + " " + sum);
    sum += data.readInt32LE(0);
  });

  let buf = Buffer.alloc(4);

  setInterval(() => {
    buf.writeInt32LE(sum, 0);
    sock.write(buf);
  }, 3000);
  sock.on("close", (data) => {
    console.log("Server CLOSED: ", sock.remoteAddress + " " + sock.remotePort);
  });
  sock.on("error", (e) => {
    console.log("Server error", sock.remoteAddress + sock.remotePort);
  });
});

server.on("listening", () => {
  console.log(`TCP-server`, HOST + ":" + PORT);
});
server.on("error", (err) => {
  console.log("TCP-server error", err);
});
server.listen(PORT, HOST);