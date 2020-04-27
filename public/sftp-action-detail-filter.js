(function () {
    'use strict';

    function ftpActionDetailFilter ($filter) {
        return function (input) {
            if (!input) return '';
            return [
                'Connect via ' + $filter('sftpConnectionLabel')(input.connection),
                'Upload: ' + $filter('plusMore')(_.pluck(input.attachments, 'filename'))
            ];
        };
    }

    angular.module('informer')
        .filter('sftpActionDetail', ftpActionDetailFilter);
})();

