app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Dashboard/list",
            params: {
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingle = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Dashboard/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Dashboard/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Dashboard/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});