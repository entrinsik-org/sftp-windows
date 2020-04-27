'use strict';
const path = require('path');
exports.register = function (server, opts, next) {
    server.drivers('smart-job:action', require('./lib')(server));
    server.drivers('smart-job:action-builder', require('./detectives'));
    server.injector().inject(server.bundle('sftp').scan(__dirname, 'public'));
    server.select('content').route({
        method: 'GET', path: '/assets/sftp/images/{path*}', config: {
            auth: false,
            handler: {
                directory: {
                    path: path.resolve(__dirname, './public/images'),
                    listing: false,
                    index: false
                }
            }
        }
    });
    next();
};

exports.register.attributes = { name: 'sftp-smart-job' };