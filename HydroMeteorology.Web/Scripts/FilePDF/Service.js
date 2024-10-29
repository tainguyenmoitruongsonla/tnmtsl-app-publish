app.service("myService", function ($http) {
    'use strict';
    this.getSingle = function (url) {
        var response = $http({
            method: "get",
            url: "/api/FilePDF/getbyid",
            params: {
                Url: url
            }
        });
        return response;
    }

    this.getAll = function (url) {
        var response = $http({
            method: "get",
            url: "/api/FilePDF/list",
        });
        return response;
    }

    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/FilePDF/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/FilePDF/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteFile = function (FileName) {
        var response = $http({
            method: "post",
            url: "/api/FilePDF/deletefile",
            params: {
                FileName: FileName
            }
        });
        return response;
    }

    this.UploadFile = function (Url,data) {
        var response = $.ajax({
            type: "POST",
            url: "/api/FilePDF/upload?Url=" + Url,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: data,
        });
        return response;
    }
});