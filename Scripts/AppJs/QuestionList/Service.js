app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/QuestionList/list",
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
            url: "/api/QuestionList/getbyid",
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
            url: "/api/QuestionList/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/QuestionList/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

});