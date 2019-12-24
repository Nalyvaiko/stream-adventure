const through = require('through2');

process.stdin.pipe(through(function (buffer, enc, next) {
    this.push(buffer.toString().toUpperCase());
    next();
})).pipe(process.stdout);