app.service("businessService", function ($http) {
    'use strict';

    //GetAll
    this.getAllBusinesses = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Business/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleBusiness = function (id) {
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
    this.getSingleBusinessByUserName = function (UserName) {
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
    this.SaveBusiness = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Business/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteBusiness = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Business/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //Get My Work
    this.getMyWorkflows = function (UserName) {
        var response = $http({
            method: "get",
            url: "/api/WorkFlowUser/getmyworkflow",
            params: {
                UserName: UserName
            }
        });
        return response;
    }
});