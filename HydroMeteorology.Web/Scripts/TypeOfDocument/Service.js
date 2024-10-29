app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (PortalId, ParentId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/TypeOfDocument/list",
            params: {
                PortalId: PortalId,
                ParentId: ParentId,
                Status: Status,
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
            url: "/api/TypeOfDocument/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc TypeOfDocument
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/TypeOfDocument/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/TypeOfDocument/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //Settings
    //GetAll LicenseFile

    this.uploadFile = function (item) {
        var response = $http({
            method: "post",
            url: "/api/AttachmentFile/uploadfiles",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }//.
});