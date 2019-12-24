const duplexer2 = require('duplexer2');
const { Writable } = require('readable-stream');

module.exports = function(counter) {
    const countries = {};
    const writableStream = Writable({ objectMode: true });

    writableStream._write = function _write(data, enc, next) {
        countries[data.country] = (countries[data.country] || 0) + 1;
        next();
    };

    writableStream.on('finish', function() { counter.setCounts(countries); });

    return duplexer2({objectMode: true}, writableStream, counter);
};


// -----------------------------
// Here's the reference solution:

var duplexer = require('duplexer2');
var through = require('through2').obj;

function (counter) {
    var counts = {};
    var input = through(write, end);
    return duplexer({objectMode: true}, input, counter);
    
    function write (row, _, next) {
        counts[row.country] = (counts[row.country] || 0) + 1;
        next();
    }
    function end (done) {
        counter.setCounts(counts);
        done();
    }
};
