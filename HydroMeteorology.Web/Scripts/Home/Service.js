app.service("myService", function ($http) {
    'use strict';

    this.getAllConstructions = function (TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, BasinId, StartDate, Status, LicensingAuthorities, Keyword, PageIndex, PageSize, DamType) {
        var response = $http({
            method: "get",
            url: "/api/Construction/list",
            params: {
                TypeOfConstructionId: TypeOfConstructionId,
                LicenseId: LicenseId,
                ProvinceId: ProvinceId,
                DistrictId: DistrictId,
                CommuneId: CommuneId,
                BasinId: BasinId,
                StartDate: StartDate,
                Status: Status,
                LicensingAuthorities: LicensingAuthorities,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize,
                DamType: DamType
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

    this.getStationsForHomepage = function (StationTypeId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/StationsForHomepage/list",
            params: {
                StationTypeId: StationTypeId,
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

    this.getDataConstruction = function (TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, StartDate, TotalCapacity, isDetail, isPreData, Status, OperatingStatus, LicensingAuthorities, Keyword, PageIndex, PageSize) {
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
});