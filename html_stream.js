const trumpet = require('trumpet');
const through = require('through2');

const tr = trumpet();

const loudStream = tr.select('.loud').createStream();

loudStream.pipe(through(function (buffer, _, next) {
    this.push(buffer.toString().toUpperCase());
    next();
})).pipe(loudStream);

process.stdin.pipe(tr).pipe(process.stdout);

/*

tr         - receives an input, and then sends output as a result.
loudStream - sends an output, and waits for input to arrive as a result.

loudStream absolutely does know that when it receives input it should pass it back to tr.

*/
