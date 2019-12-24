const concat = require('concat-stream');

process.stdin.pipe(concat(function (content) {
    console.log(content.toString().split('').reverse().join(''));
}));