var socket = require('socket.io');
let io: any = null;

exports.io = function() {
    return io;
}

exports.initialize = function(server: any) {
    return io = socket(server);
}