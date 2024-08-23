app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAllProvince = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Province/list",
            params: {
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    this.getDistrict = function (CityId, CityCode, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/District/list",
            params: {
                CityId: CityId,
                CityCode: CityCode,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    this.getCommunes = function (DistrictId, CityCode, DistrictCode, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Commune/list",
            params: {
                DistrictId: DistrictId,
                CityCode: CityCode,
                DistrictCode: DistrictCode,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    this.getEnthics = function () {
        var response = $http({
            method: "get",
            url: "/api/Enthic/list",
            params: {}
        });
        return response;
    }
    this.getReligions = function () {
        var response = $http({
            method: "get",
            url: "/api/Religion/list",
            params: {}
        });
        return response;
    }
    //GetSingle WebGis
    this.getWebGisByCode = function (StudentCode) {
        var response = $http({
            method: "get",
            url: "/api/StudentWebGis/getbyid",
            params: {
                StudentCode: StudentCode
            }
        });
        return response;
    }
    //Get WebGis Files
    this.getWebGisFiles = function (StudentCode, Notation, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/StudentDocumentAttachment/list",
            params: {
                StudentCode: StudentCode,
                Notation: Notation,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    this.getWebGisFileByCode = function (StudentCode, Notation) {
        var response = $http({
            method: "get",
            url: "/api/StudentDocumentAttachment/getbycode",
            params: {
                StudentCode: StudentCode,
                Notation: Notation,
            }
        });
        return response;
    }
    // Update Doc type 
    this.SaveStudentWebGisProfile = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/StudentWebGis/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Get Data File
    this.getDataFile = function (DataId, PageIndex, PageSize) {
        //var response = $http({
        //    method: "get",
        //    url: "/api/DataFile/list",
        //    params: {
        //        DataId: DataId,
        //        PageIndex: PageIndex,
        //        PageSize: PageSize
        //    }
        //});
        //return response;
    }

    // Save DataFile 
    this.exportProfileToPdf = function (StudentCode) {
        var response = $http({
            method: "get",
            //responseType: "arraybuffer",
            url: "/api/FileAttachment/exporttopdf",
            params: {
                StudentCode: StudentCode
            }
        });
        return response;
    }
    
    this.uploadFile = function (item) {
        var response = $http({
            method: "post",
            url: "/api/StudentDocumentAttachment/uploadfiles",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }//.

});