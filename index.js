'use strict';

exports.register = function (server, opts, next) {
    server.drivers('smart-job:action', require('./lib')(server));
    server.drivers('smart-job:action-builder', require('./detectives'));
    next();
};

exports.register.attributes = { name: 'sftp-smart-job' };