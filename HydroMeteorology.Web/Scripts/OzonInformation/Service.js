app.service("myService", function ($http) {
    'use strict';

    this.getData = function (Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/OzonInformation/list",
            params: {
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
            url: "/api/OzonInformation/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/OzonInformation/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/OzonInformation/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteFile = function (Id) {
        var response = $http({
            method: "post",
            url: "/api/OzonInformation/deletefile",
            params: {
                Id: Id
            }
        });
        return response;
    }

    this.UploadFile = function (Id, data) {
        var response = $.ajax({
            type: "POST",
            url: "/api/OzonInformation/upload?Id=" + Id,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: data,
        });
        return response;
    }
});