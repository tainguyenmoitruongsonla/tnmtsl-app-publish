app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Speciality/list",
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
    this.getSingle = function (Id) {
        var response = $http({
            method: "get",
            url: "/api/Speciality/getbyid",
            params: {
                Id: Id
            }
        });
        return response;
    }

    // Update Doc type 
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Speciality/save",
            data: JSON.stringify(Item),
            Speciality: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Speciality/delete",
            data: item,
            Speciality: "json"
        });
        return response;
    }

});