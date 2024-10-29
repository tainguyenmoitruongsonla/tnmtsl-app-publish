app.service("myService", function ($http) {
    'use strict';

    //Get all type of cons
    this.getAllStation = function (DistrictId, CommuneId, StationTypeId, Status, Keyword, StartDate, EndDate, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Station/list",
            params: {
                DistrictId: DistrictId,
                CommuneId: CommuneId,
                StationTypeId: StationTypeId,
                Status: Status,
                Keyword: Keyword,
                StartDate: StartDate,
                EndDate: EndDate,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getAllStationWithMultiType = function (DistrictId, CommuneId, StationTypeIds, Status, Keyword, StartDate, EndDate, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Station/listwithmultitype",
            params: {
                DistrictId: DistrictId,
                CommuneId: CommuneId,
                StationTypeIds: StationTypeIds,
                Status: Status,
                Keyword: Keyword,
                StartDate: StartDate,
                EndDate: EndDate,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingleStation = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Station/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.getAllStationType = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/StationType/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.SaveStation = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Station/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.DeleteStation = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Station/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteFileStation = function (FileName1, FileName2, FolderName) {
        var response = $http({
            method: "post",
            url: "/api/Station/deletefile",
            params: {
                FileName1: FileName1,
                FileName2: FileName2,
                FolderName: FolderName
            }
        });
        return response;
    }
});