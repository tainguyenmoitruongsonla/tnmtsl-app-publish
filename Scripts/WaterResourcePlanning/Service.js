app.service("myService", function ($http) {
    'use strict';
    //Lay tat ca van ban quy pham phap luat
    this.getData = function (TypeId, Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/WaterResourcePlanning/list",
            params: {
                TypeId: TypeId,
                Keyword: Keyword,
                Status: Status,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingle = function (id) {
        var response = $http({
            method: "get",
            url: "/api/WaterResourcePlanning/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/WaterResourcePlanning/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/WaterResourcePlanning/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});