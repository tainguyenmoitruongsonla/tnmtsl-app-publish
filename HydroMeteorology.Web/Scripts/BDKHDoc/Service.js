app.service("myService", function ($http) {
    'use strict';
    //Lay tat ca van ban quy pham phap luat
    this.getData = function (TypeId, Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BDKHDoc/list",
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
            url: "/api/BDKHDoc/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/BDKHDoc/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/BDKHDoc/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteFile = function (FileName, FolderName) {
        var response = $http({
            method: "post",
            url: "/api/BDKHDoc/deletefile",
            params: {
                FileName: FileName,
                FolderName: FolderName
            }
        });
        return response;
    }

    this.UploadFile = function (Id, FolderName, data) {
        var response = $.ajax({
            type: "POST",
            url: "/api/BDKHDoc/upload?Id=" + Id + "&FolderName=" + FolderName,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: data,
        });
        return response;
    }
});