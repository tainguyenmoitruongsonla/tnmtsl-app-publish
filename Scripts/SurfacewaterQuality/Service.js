app.service("waterQualityService", function ($http) {
    'use strict';

    //GetAll
    this.getAllWaterQualitties = function (LimitType) {
        var response = $http({
            method: "get",
            url: "/api/SurfacewaterQuality/list",
            params: {
                LimitType: LimitType,
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleSurfacewaterQuality = function (id) {
        var response = $http({
            method: "get",
            url: "/api/SurfacewaterQuality/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.SaveSurfacewaterQuality = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/SurfacewaterQuality/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteSurfacewaterQuality = function (item) {
        var response = $http({
            method: "post",
            url: "/api/SurfacewaterQuality/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});