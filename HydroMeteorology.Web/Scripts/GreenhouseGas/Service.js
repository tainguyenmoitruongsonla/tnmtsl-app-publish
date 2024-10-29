app.service("myService", function ($http) {
    'use strict';
    //Lay tat ca van ban quy pham phap luat
    this.getData = function (Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/GreenhouseGas/list",
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
            url: "/api/GreenhouseGas/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/GreenhouseGas/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/GreenhouseGas/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteFile = function (FileName) {
        var response = $http({
            method: "post",
            url: "/api/GreenhouseGas/deletefile",
            params: {
                FileName: FileName,
            }
        });
        return response;
    }

    this.UploadFile = function (Id, data) {
        var response = $.ajax({
            type: "POST",
            url: "/api/GreenhouseGas/upload?Id=" + Id,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: data,
        });
        return response;
    }
});