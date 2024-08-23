app.service("myService", function ($http) {
    'use strict';

    //GetAll
     //Basin
     this.getAllBasins = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Basin/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                isDetail: false,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    //GetAll
    this.getAll = function (BasinId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/River/list",
            params: {
                BasinId: BasinId,
                Status: Status,
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
            url: "/api/River/getbyid",
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
            url: "/api/River/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/River/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});