app.service("myService", function ($http) {
    'use strict';
    this.getNotification = function (IsError, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/NotificationTNN/list",
            params: {
                IsError: IsError,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});