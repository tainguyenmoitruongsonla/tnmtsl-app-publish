app.service("licenseFeeService", function ($http) {
    'use strict';

    //GetAll
    this.getAllLicenseFee = function (LicensingAuthorities, StartYear, EndYear, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicenseFee/list",
            params: {
                LicensingAuthorities: LicensingAuthorities,
                StartYear: StartYear,
                EndYear: EndYear,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleLicenseFee = function (id) {
        var response = $http({
            method: "get",
            url: "/api/LicenseFee/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.SaveLicenseFee = function (Item, LicenseId) {
        var response = $http({
            method: "post",
            url: "/api/LicenseFee/save?LicenseId=" + LicenseId,
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteLicenseFee = function (item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseFee/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //DeleteIdInLicenseFk
    this.SetNullIdInLicenseFk = function (LicenseId, LicenseFeeId) {
        var response = $http({
            method: "post",
            url: "/api/LicenseFee/SetNullIdInLicenseFk",
            params: {
                LicenseId: LicenseId,
                LicenseFeeId: LicenseFeeId
            }
        });
        return response;
    }

    this.DeleteLicenseFeeFile = function (FileName) {
        var response = $http({
            method: "post",
            url: "/api/LicenseFee/deletefile",
            params: {
                FileName: FileName
            }
        });
        return response;
    }

    
});