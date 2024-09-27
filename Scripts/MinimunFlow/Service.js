app.service("myService", function ($http) {
    'use strict';

    this.getSingleCommune = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Commune/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
});