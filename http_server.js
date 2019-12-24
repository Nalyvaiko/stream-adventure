const http = require('http');
const through = require('through2');

http.createServer(function(req, res) {
    if (req.method === 'POST') {
        req.pipe(through(function (buffer, _, next) {
            this.push(buffer.toString().toUpperCase());
            next();
        })).pipe(res);
    }
    else res.end('send me a POST\n');
}).listen(process.argv[2]);