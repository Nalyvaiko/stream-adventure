const combine = require('stream-combiner');
const split = require('split2');
const through = require('through2');
const zlib = require('zlib');

module.exports = function () {
    const genresBooks = {};
    return combine(
        split(),
        through(function(chunk, _, next) {
            const { type, name } = JSON.parse(chunk);

            if (type === 'genre') {
                if (Object.keys(genresBooks).length > 0) {
                    this.push(JSON.stringify(genresBooks) + '\n')
                }

                genresBooks.name = name;
                genresBooks.books = [];
            }

            if (type === 'book') {
                genresBooks.books.push(name);
            }

            next();
        }, function(cb) {
            cb(null, JSON.stringify(genresBooks));
        }),
        zlib.createGzip()
    );
}

/*
Your stream will be written a newline-separated JSON list of science fiction
genres and books. All the books after a `"type":"genre"` row belong in that
genre until the next `"type":"genre"` comes along in the output.

    {"type":"genre","name":"cyberpunk"}
    {"type":"book","name":"Neuromancer"}
    {"type":"book","name":"Snow Crash"}
    {"type":"genre","name":"space opera"}
    {"type":"book","name":"A Deepness in the Sky"}
    {"type":"book","name":"Void"}
    
Your program should generate a newline-separated list of JSON lines of genres,
each with a `"books"` array containing all the books in that genre. The input
above would yield the output:

    {"name":"cyberpunk","books":["Neuromancer","Snow Crash"]}
    { "name": "space opera", "books": ["A Deepness in the Sky", "Void"] }
    
*/

function officialSolution() {
    var grouper = through(write, end);
    var current;
    
    function write (line, _, next) {
        if (line.length === 0) return next();
        var row = JSON.parse(line);
        
        if (row.type === 'genre') {
            if (current) {
                this.push(JSON.stringify(current) + '\n');
            }
            current = { name: row.name, books: [] };
        }
        else if (row.type === 'book') {
            current.books.push(row.name);
        }
        next();
    }
    function end (next) {
        if (current) {
            this.push(JSON.stringify(current) + '\n');
        }
        next();
    }
    
    return combine(split(), grouper, zlib.createGzip());
};
