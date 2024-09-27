app.service("constructionService", function ($http) {
    'use strict';

    this.getAllConstructions = function (TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, BasinId, StartDate, Status, LicensingAuthorities, Keyword, PageIndex, PageSize) {
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
                PageSize: PageSize
            }
        });
        return response;
    }

    this.countConstruction = function () {
        var response = $http({
            method: "get",
            url: "/api/Construction/count"
        });
        return response;
    }


    this.getSingleConstruction = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Construction/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
    //Save
    this.SaveConstruction = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Construction/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.SaveConstructionLicenses = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/ConstructionLicenses/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteConstruction = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Construction/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //ConstructionDetail
    this.getConsItems = function (ConstructionId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/ConstructionDetail/list",
            params: {
                ConstructionId: ConstructionId,
                Keyword: Keyword,
                Status: Status,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    // Save construction detail
    this.SaveConstructionDetail = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/ConstructionDetail/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    // delete construction detail
    this.DeleteConsItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/ConstructionDetail/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //Province
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
    //District
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
    //Commune
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