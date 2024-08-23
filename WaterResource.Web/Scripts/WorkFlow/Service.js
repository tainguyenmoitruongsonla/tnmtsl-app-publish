app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (RoleId, UserId, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/WorkFlow/list",
            params: {
                RoleId: RoleId,
                UserId: UserId,
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
            url: "/api/WorkFlow/getbyid",
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
            url: "/api/WorkFlow/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/WorkFlow/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});