app.service("inspectionService", function ($http) {
    'use strict';

    this.getAllInspections = function (ConstructionId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Inspection/list",
            params: {
                ConstructionId: ConstructionId,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //save or update
    this.SaveInspection = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Inspection/save",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }

    // delete file
    this.DeleteFileInspection = function (FileName, FolderName) {
        var response = $http({
            method: "post",
            url: "/api/Inspection/deletefile",
            params: {
                FileName: FileName,
                FolderName: FolderName
            }
        });
        return response;
    }

    //Delete Inspection
    this.DeleteInspection = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Inspection/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    this.getSingleInspection = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Inspection/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
    
});