'use strict';

module.exports = {
    discover: function () {
        return {
            group: '__top',
            name: 'Send to SFTP (Windows)',
            action: {
                type: 'sftp'
            }
        };
    }
};