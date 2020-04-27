(function () {
    'use strict';

    function SftpActionCtrl ($scope, icons) {
        $scope.icons = icons;
    }

    SftpActionCtrl.prototype.$onInit = function () {
        this.showMore = true;
        _.defaults(this.opts, {
            attachments: [],
            connection: {
                protocol: 'sftp',
            },
            authMode: 'password'
        });
    };

    function infSftpAction () {
        return {
            restrict: 'E',
            controller: SftpActionCtrl,
            controllerAs: 'ctrl',
            bindToController: true,
            scope: {
                opts: '=ngModel'
            },
            templateUrl: '/assets/sftp/inf-sftp-action-tpl.html'
        };
    }

    angular.module('informer')
        .directive('infSftpAction', infSftpAction);
})();

