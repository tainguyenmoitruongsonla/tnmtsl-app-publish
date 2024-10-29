app.service("dataTransmissionService", function ($http) {
    'use strict';

    //Get all data
    this.getAllTransmissions = function (DataType, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/DataTransmission/list",
            params: {
                DataType: DataType,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleDataTransmission = function (id) {
        var response = $http({
            method: "get",
            url: "/api/DataTransmission/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.SaveTransmission = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/DataTransmission/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteTransmission = function (item) {
        var response = $http({
            method: "post",
            url: "/api/DataTransmission/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.getAllUser = function (RoleId, IsApproved, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/UserMan/list",
            params: {
                RoleId: RoleId,
                IsApproved: IsApproved,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});