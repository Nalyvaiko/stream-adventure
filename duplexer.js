const duplexer2 = require('duplexer2');
const spawn = require('child_process').spawn;

module.exports = function (cmd, args) {
    // spawn the process and return a single stream
    // joining together the stdin and stdout here
    const childProcess = spawn(cmd, args);
    return duplexer2(childProcess.stdin, childProcess.stdout);
};
