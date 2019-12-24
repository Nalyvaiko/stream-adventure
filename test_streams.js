const through2 = require("through2");
const { Readable } = require("readable-stream");

const stream = Readable({ objectMode: true });

stream._read = () => {};

setInterval(() => {
  stream.push({
    x: Math.random()
  });
}, 100);

const getX = through2.obj((data, enc, cb) => {
  cb(null, `${data.x.toString()}\n`);
});

stream.pipe(getX).pipe(process.stdout);

// const request = require('request');
// request('https://fettblog.eu').pipe(process.stdout);
// process.stdin.pipe(process.stdout);
