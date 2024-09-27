app.service("basinService", function ($http) {
    'use strict';

    //GetAll
    this.getAllBasins = function (Status, Keyword, isDetail, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Basin/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                isDetail: isDetail,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleBasin = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Basin/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.SaveBasin = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Basin/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteBasin = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Basin/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});