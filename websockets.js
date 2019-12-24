const websocket = require('websocket-stream');

const ws = websocket('ws://localhost:8099');
ws.end('hello\n');