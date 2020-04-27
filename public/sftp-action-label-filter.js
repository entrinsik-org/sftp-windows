(function () {
    'use strict';

    function ftpActionLabelFilter () {
        return function (input) {
            var count = input.attachments.length;
            return 'Upload ' + count + (count === 1 ? ' file' : ' files');
        };
    }

    angular.module('informer')
        .filter('sftpActionLabel', ftpActionLabelFilter);
})();

