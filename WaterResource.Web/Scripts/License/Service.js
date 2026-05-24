app.service("licenseService", function ($http) {
    'use strict';
    ///-----Begin License-----///
    //License
    this.getAllLicenses = function (ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, CommuneId, CommuneCode, BasinId, AquiferId, Effect, LicensingAuthorities, isDetail, Status, Keyword, PageIndex, PageSize) {
        function numberOrDefault(value, defaultValue) {
            if (value === undefined || value === null || value === "") return defaultValue;
            var numberValue = Number(value);
            return isNaN(numberValue) ? defaultValue : numberValue;
        }

        function stringOrDefault(value, defaultValue) {
            return value === undefined || value === null ? defaultValue : value;
        }

        function boolOrDefault(value, defaultValue) {
            return value === undefined || value === null || value === "" ? defaultValue : value;
        }

        var response = $http({
            method: "get",
            url: "/api/License/list",
            params: {
                ParentId: numberOrDefault(ParentId, 0),
                ConstructionId: numberOrDefault(ConstructionId, 0),
                BusinessId: numberOrDefault(BusinessId, 0),
                LicensingTypeId: numberOrDefault(LicensingTypeId, 0),
                TypeOfConstructionId: numberOrDefault(TypeOfConstructionId, 0),
                StartYear: numberOrDefault(StartYear, 0),
                EndYear: numberOrDefault(EndYear, 0),
                CommuneId: numberOrDefault(CommuneId, 0),
                CommuneCode: stringOrDefault(CommuneCode, ""),
                BasinId: numberOrDefault(BasinId, 0),
                AquiferId: numberOrDefault(AquiferId, -1),
                Effect: numberOrDefault(Effect, 0),
                LicensingAuthorities: numberOrDefault(LicensingAuthorities, -1),
                isDetail: boolOrDefault(isDetail, true),
                Status: boolOrDefault(Status, true),
                Keyword: stringOrDefault(Keyword, ""),
                PageIndex: numberOrDefault(PageIndex, 1),
                PageSize: numberOrDefault(PageSize, 0)
            }
        });
        return response;
    }

    this.countLicenseForChart = function (ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, BasinId, AquiferId, Effect, LicensingAuthorities) {
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
    this.getCommunes = function () {
        return $http({
            method: "get",
            url: "/api/AdministrativeUnit/list"
        }).then(function (response) {
            var list = [];

            if (response && response.data) {
                if (Array.isArray(response.data.ListData)) {
                    list = response.data.ListData;
                } else if (Array.isArray(response.data)) {
                    list = response.data;
                }
            }

            list = list
                .filter(function (item) {
                    return item && item.Level === "Commune";
                })
                .map(function (item) {
                    item.displayText = (item.Name || "") + (item.OldCommuneName || "");
                    return item;
                });

            response.data.ListData = list;
            return response;
        });
    }

    this.getSingleCommune = function (id) {
        // AdministrativeUnit getbyid returns the admin unit (commune)
        var response = $http({
            method: "get",
            url: "/api/AdministrativeUnit/getbyid",
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
