app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/DataEntry/list",
            params: {
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
            url: "/api/DataEntry/getbyid",
            params: {
                Id: Id
            }
        });
        return response;
    }

    // Save DataEntry
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/DataEntry/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/DataEntry/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //Get Data Feedback
    this.getDataFeedback = function (DataId, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/DataFile/list",
            params: {
                DataId: DataId,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    //Get Data File
    this.getDataFile = function (DataId, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/DataFile/list",
            params: {
                DataId: DataId,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    // Save DataFile
    this.SaveDataFile = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/DataFile/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    //Delete
    this.deleteDataFile = function (item) {
        var response = $http({
            method: "post",
            url: "/api/DataFile/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    this.uploadFile = function (item) {
        var response = $http({
            method: "post",
            url: "/api/DataEntry/uploadfiles",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }//.
});