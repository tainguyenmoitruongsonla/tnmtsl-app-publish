app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (PortalId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Business/list",
            params: {
                PortalId: PortalId,
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
            url: "/api/Business/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
    //GetSingle
    this.getSingleUserName = function (UserName) {
        var response = $http({
            method: "get",
            url: "/api/Business/getbyusername",
            params: {
                UserName: UserName
            }
        });
        return response;
    }
    // Update Doc type
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Business/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Business/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});