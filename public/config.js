(function () {
    'use strict';

    function config (componentProvider) {
        componentProvider.component('sftpActionEditor', '<inf-sftp-action layout="column" flex ng-model="$component.ngModel"></inf-sftp-action>');
    }

    angular.module('informer')
        .config(config);
})();