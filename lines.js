const through2 = require("through2");
const split = require("split2");

let lineCount = 1;

process.stdin
    .pipe(split())
    .pipe(
        through2(function(chunk, enc, next) {
            const line = chunk.toString();
            this.push(
                lineCount % 2 === 0
                ? line.toUpperCase() + "\n"
                : line.toLowerCase() + "\n"
            );
            lineCount++;
            next();
        })
    )
    .pipe(process.stdout);
