(function () {
    'use strict';

    function ftpConnectionLabelFilter () {
        return function (conn) {
            return 'SFTP on ' + [(conn.host || 'localhost'), (conn.port || '22')].join(':');
        };
    }

    angular.module('informer')
        .filter('sftpConnectionLabel', ftpConnectionLabelFilter);
})();

