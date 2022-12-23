const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');

ws.on('open', async () => {
    const login = await ws.login({ login: 'aaaa', password: 'aaaa' })
    await calc()
});

async function calc() {
    const [resultSquare3, resultSquare54, resultMul] = await Promise.all([
        ws.call('square', [3]),
        ws.call('square', [5, 4]),
        ws.call('mul', [3, 5, 7, 9, 11, 13])
    ])
    const resultFib = (await ws.call('fib', 7)).reduce((a, b) => a + b, 0)
    const resultMul246 = await ws.call('mul', [2, 4, 6])
    console.log('Result: ' + await ws.call('sum',
        [
            resultSquare3,
            resultSquare54,
            resultMul
        ])
        + resultFib
        * resultMul246
    );
}