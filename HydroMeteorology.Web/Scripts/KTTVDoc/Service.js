app.service("myService", function ($http) {
    'use strict';
    //Lay tat ca van ban quy pham phap luat
    this.getDataKTTVDoc = function (TypeId, AgencyIssued, TuNgay, DenNgay, Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/KTTVDoc/list",
            params: {
                TypeId: TypeId,
                AgencyIssued: AgencyIssued,
                TuNgay: TuNgay,
                Keyword: Keyword,
                Status: Status,
                DenNgay: DenNgay,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingle = function (id) {
        var response = $http({
            method: "get",
            url: "/api/KTTVDoc/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.Save = function (item) {
        var response = $http({
            method: "post",
            url: "/api/KTTVDoc/save",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/KTTVDoc/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.UploadFile = function (Id, FolderName, Data) {
        var response = $.ajax({
            type: "POST",
            url: "/api/KTTVDoc/upload?Id=" + Id + "&FolderName=" + FolderName,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: Data,
        });
        return response;
    }

    this.DeleteFile = function (FileName, FolderName) {
        var response = $http({
            method: "post",
            url: "/api/KTTVDoc/deletefile",
            params: {
                FileName: FileName,
                FolderName: FolderName
            }
        });
        return response;
    }

    this.getNotificationKTTV = function (PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/NotificationKTTV/list",
            params: {
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});