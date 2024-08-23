app.service("myService", function ($http) {
    'use strict';
    //GetAll Type
    this.getAllType = function (PortalId, ParentId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/TypeOfConstruction/list",
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
    //GetAll
    this.getAll = function (TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, StartDate, TotalCapacity, isDetail, isPreData, Status, OperatingStatus,LicensingAuthorities, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Construction/list",
            params: {
                TypeOfConstructionId: TypeOfConstructionId,
                LicenseId: LicenseId,
                ProvinceId: ProvinceId,
                DistrictId: DistrictId,
                CommuneId: CommuneId,
                StartDate: StartDate,
                TotalCapacity: TotalCapacity,
                isDetail: isDetail,
                isPreData: isPreData,
                Status: Status,
                OperatingStatus: OperatingStatus,
                LicensingAuthorities: LicensingAuthorities,
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
            url: "/api/Construction/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Construction/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Construction/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //Get Province
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
});