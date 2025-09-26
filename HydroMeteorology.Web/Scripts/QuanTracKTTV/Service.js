app.service("myService", function ($http) {
    'use strict';

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
    this.getSingleDistrict = function (id) {
        var response = $http({
            method: "get",
            url: "/api/District/getbyid",
            params: {
                id: id
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

    //Update Doc type
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Station/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Station/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.getStationData = function (StationCode, StartTime, EndTime) {
        var response = $http({
            method: "get",
            url: "/api/StationData/list",
            params: {
                StationCode: StationCode,
                StartTime: StartTime,
                EndTime: EndTime
            }
        });
        return response;
    }

    this.GetByYear = function (StationCode, Year) {
        var response = $http({
            method: "get",
            url: "/api/StationDataGetByYear/list",
            params: {
                StationCode: StationCode,
                Year: Year,
            }
        });
        return response;
    }

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

    this.getStorePreData = function (ConstructionCode, StartDate, EndDate, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/StoragePreData/getall",
            params: {
                ConstructionCode: ConstructionCode,
                StartDate: StartDate,
                EndDate: EndDate,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
})