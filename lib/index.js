'use strict';

const _ = require('lodash');
const NodeSSH = require('node-ssh');
const path = require('path');
const eu = require('ent-utils');

module.exports = server => ({
    id: ' sftp',
    name: 'SFTP',
    imageSvg: '/assets/smart-job/images/ftp.svg',
    editorComponent: 'ftpActionEditor',
    validate: function(opts) {
        opts.connection = opts.connection || {};
        opts.connection.password = server.app.encrypt(_.get(opts, 'connection.password'));
        opts.connection.host = opts.connection.host || 'localhost';
        return opts;
    },
    progressLabel: opts => `Uploading files`,
    invoke: function ({ attachments = [], opts }) {
        const connection = _(opts.connection)
            .defaults({ host: 'localhost' })
            .assign({ password: server.app.decrypt(opts.connection.password) })
            .value();
        const ssh = new NodeSSH();
        return ssh.connect(connection)
            .then(() => {
                return ssh.requestSFTP();
            })
            .then(sftp => {
                return ssh.putFiles(attachments.map(a => {
                    //ftp dest paths always posix format?
                    let remotePath = connection.remoteDir ? path.posix.join(connection.remoteDir, path.basename(a)) : path.basename(a);
                    return {local: path.resolve(a), remote: remotePath};
                }),{sftp: sftp});
            })
            .then(() => {
                try {
                    ssh.end();
                } catch (e) {}
                return `Uploaded ${attachments.length} ${eu.singlePlural(attachments.length, 'document', 'documents')} to ${opts.connection.host}`;
            })
            .catch(error => {
                try {
                    ssh.end();
                } catch (e) {}
                throw new Error(error);
            });
    }
});