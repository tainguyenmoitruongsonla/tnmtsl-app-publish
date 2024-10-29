app.service("licenseService", function ($http) {
    'use strict';

    this.getData = function (Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicenseKTTV/list",
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
            url: "/api/LicenseKTTV/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.SaveLicense = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseKTTV/save",
            data: JSON.stringify(Item),
            datatype: "json"
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

    this.SaveLicenseKTTVStation = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseKTTVStation/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.Delete = function (item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseKTTV/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteLicenseFile = function (FileName1, FileName2, FileName3) {
        var response = $http({
            method: "post",
            url: "/api/LicenseKTTV/deletefile",
            params: {
                FileName1: FileName1,
                FileName2: FileName2,
                FileName3: FileName3
            }
        });
        return response;
    }

    this.UploadFile = function (Id, data) {
        var response = $.ajax({
            type: "POST",
            url: "/api/LicenseKTTV/upload?Id=" + Id,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: data,
        });
        return response;
    }

    this.getAllLicensingTypes = function (PortalId, IssueState, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicensingType/list",
            params: {
                PortalId: PortalId,
                IssueState: IssueState,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

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

    this.getSingleCommune = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Commune/getbyid",
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

    this.getTypeOfStation = function (ParentId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/StationType/list",
            params: {
                ParentId: ParentId,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});