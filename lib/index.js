'use strict';

const _ = require('lodash');
const NodeSSH = require('node-ssh');
const path = require('path');
const eu = require('ent-utils');

module.exports = server => ({
    id: 'sftp',
    name: 'SFTP',
    imageSvg: '/assets/sftp/images/sftp.svg',
    editorComponent: 'sftpActionEditor',
    validate: function (opts) {
        opts.connection = opts.connection || {};
        //clear out irrelevant settings
        const authMode = opts.authMode || 'none';
        opts.connection = _.omit(opts.connection, (v, k) => {
            return  k === 'password' ? authMode !== 'password' :
                    k === 'rawPrivateKey' ? authMode !== 'key' :
                    k === 'privateKeyPath' ? authMode !== 'path' : false;
        });
        if (opts.authMode === 'password') opts.connection.password = server.app.encrypt(_.get(opts, 'connection.password'));
        if (opts.connection.rawPrivateKey && opts.connection.rawPrivateKey.indexOf('encrypted:') < 0) {
            opts.connection.rawPrivateKey = server.app.encrypt(opts.connection.rawPrivateKey);
        }
        opts.connection.host = opts.connection.host || 'localhost';
        return opts;
    },
    progressLabel: opts => `Uploading files`,
    invoke: function ({ attachments = [], opts }) {
        const connection = _(opts.connection)
            .defaults({ host: 'localhost' })
            .value();
        const { password, privateKeyPath, rawPrivateKey } = connection;
        delete connection.password;
        delete connection.privateKeyPath;
        delete connection.rawPrivateKey;
        if (opts.authMode === 'password') connection.password = server.app.decrypt(password)
        if (opts.authMode === 'path') connection.privateKey = privateKeyPath;
        if (opts.authMode === 'key') connection.privateKey = server.app.decrypt(rawPrivateKey)
        const ssh = new NodeSSH();
        return ssh.connect(connection)
            .then(() => {
                return ssh.requestSFTP();
            })
            .then(sftp => {
                return ssh.putFiles(attachments.map(a => {
                    //ftp dest paths always posix format?
                    let remotePath = connection.remoteDir ? path.posix.join(connection.remoteDir, path.basename(a)) : path.basename(a);
                    return { local: path.resolve(a), remote: remotePath };
                }), { sftp: sftp });
            })
            .then(() => {
                try {
                    ssh.end();
                } catch (e) {
                }
                return `Uploaded ${attachments.length} ${eu.singlePlural(attachments.length, 'document', 'documents')} to ${opts.connection.host}`;
            })
            .catch(error => {
                try {
                    ssh.end();
                } catch (e) {
                }
                throw new Error(error);
            });
    }
});