const rpcWSS = require('rpc-websockets').Server;
const server = new rpcWSS({ port: 4000, host: 'localhost' });

server.setAuth((l) => {
    console.log(l)
    return (l.login == 'aaaa' && l.password == 'aaaa')
})

server.register('square', (params) => {
    return params.length === 2 ? params[0] * params[1] : Math.pow(params[0], 2) * Math.PI
}).public();

server.register('sum', (params) => {
    return add(params)
}).public

server.register('mul', (params) => {
    return mult(params)
}).public

server.register('fib', (n) => {
    console.log(n)
    return fib(n);
}).protected

server.register('fact', (n) => {
    return factorial(n);
}).protected

add = function (arr) {
    return arr.reduce((a, b) => a + b, 0);
};

mult = function (arr) {
    return arr.reduce((a, b) => a * b, 1);
};

function fib(n) {
    if(n===1){
        return [0]
    }
    const fibonacci = [0, 1]; 

    for (i = 2; i < n; i ++) {
        fibonacci[i] = fibonacci[i-1] + fibonacci[i-2];
    }

    return fibonacci;
}

factorial = function (n) {
    return n ? n * factorial(n - 1) : 1;
}