app.service("licenseService", function ($http) {
    'use strict';
    ///-----Begin License-----///
    //License
    this.getAllLicenses = function (ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, isDetail, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/License/list",
            params: {
                ParentId: ParentId,
                ConstructionId: ConstructionId,
                BusinessId: BusinessId,
                LicensingTypeId: LicensingTypeId,
                TypeOfConstructionId: TypeOfConstructionId,
                StartYear: StartYear,
                EndYear: EndYear,
                DistrictId: DistrictId,
                BasinId: BasinId,
                AquiferId: AquiferId,
                Effect: Effect,
                LicensingAuthorities: LicensingAuthorities,
                isDetail: isDetail,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.countLicenseForChart = function (ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities) {
        var response = $http({
            method: "get",
            url: "/api/License/count-for-chart",
            params: {
                ConstructionId: ConstructionId,
                BusinessId: BusinessId,
                LicensingTypeId: LicensingTypeId,
                TypeOfConstructionId: TypeOfConstructionId,
                StartYear: StartYear,
                EndYear: EndYear,
                DistrictId: DistrictId,
                BasinId: BasinId,
                AquiferId: AquiferId,
                Effect: Effect,
                LicensingAuthorities: LicensingAuthorities
            }
        });
        return response;
    }

    this.countLicense = function () {
        var response = $http({
            method: "get",
            url: "/api/License/count"
        });
        return response;
    }

    // Get single lincese info
    this.getSingleLicense = function (id) {
        var response = $http({
            method: "get",
            url: "/api/License/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Save license
    this.SaveLicense = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/License/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    this.SaveLicenseLicenseFee = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseLicenseFee/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    // Delete license
    this.DeleteLicense = function (item) {
        var response = $http({
            method: "post",
            url: "/api/License/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    this.DeleteLicenseLicenseFee = function (item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseLicenseFee/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.DeleteLicenseFile = function (FileName1, FileName2, FolderName) {
        var response = $http({
            method: "post",
            url: "/api/License/deletefile",
            params: {
                FileName1: FileName1,
                FileName2: FileName2,
                FolderName: FolderName
            }
        });
        return response;
    }

    //Aquifers
    this.getAquifers = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Aquifer/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    // Save MiningPurpose
    this.SaveMiningPurpose = function (item) {
        var response = $http({
            method: "post",
            url: "/api/MiningPurpose/save",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }

    //Delete MiningPurpose
    this.DeleteMiningPurpose = function (item) {
        var response = $http({
            method: "post",
            url: "/api/MiningPurpose/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

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
    this.DeleteConsItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/ConstructionDetail/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //LicensingType
    this.getLicensingType = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicensingType/list",
            params: {
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

    this.getBasins = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Basin/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                isDetail: false,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingleBasin = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Basin/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    //Get My Work
    this.getMyWorkflows = function (UserName) {
        var response = $http({
            method: "get",
            url: "/api/WorkFlowUser/getmyworkflow",
            params: {
                UserName: UserName
            }
        });
        return response;
    }
    //Construction Type
});