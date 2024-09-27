app.service("typeOfConstructionService", function ($http) {
    'use strict';

    //GetAll
    this.getTypeOfConstructions = function (ParentId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/TypeOfConstruction/list",
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

    //GetSingle
    this.getSingleTypeOfConstruction = function (id) {
        var response = $http({
            method: "get",
            url: "/api/TypeOfConstruction/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc TypeOfConstruction
    this.SaveTypeOfConstruction = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/TypeOfConstruction/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteTypeOfConstruction = function (item) {
        var response = $http({
            method: "post",
            url: "/api/TypeOfConstruction/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //Settings
    //GetAll LicenseFile
    this.getLicenseFile = function (PortalId, LicensingTypeId, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicenseFile/list",
            params: {
                PortalId: PortalId,
                LicensingTypeId: LicensingTypeId,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    //LicensingType
    this.getLicensingType = function (PortalId, IssueState, Keyword, PageIndex, PageSize) {
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
    //LicensingType Setting
    this.getLicensingTypeSetting = function (PortalId, TypeOfConstructionId, LicensingTypeId, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicensingTypeSetting/list",
            params: {
                PortalId: PortalId,
                TypeOfConstructionId: TypeOfConstructionId,
                LicensingTypeId: LicensingTypeId,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    // Save LicensingType Setting
    this.SaveLicensingTypeSetting = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/LicensingTypeSetting/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //GetAll LicenseFile Setting
    this.getLicenseFileSetting = function (TypeOfConstructionId, LicensingTypeId, LicenseFileId, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/LicenseFileSetting/list",
            params: {
                TypeOfConstructionId: TypeOfConstructionId,
                LicensingTypeId: LicensingTypeId,
                LicenseFileId: LicenseFileId,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    //Get single setting
    this.getSingleLicenseFileSetting = function (TypeOfConstructionId, LicensingTypeId, LicenseFileId) {
        var response = $http({
            method: "get",
            url: "/api/LicenseFileSetting/getsingle",
            params: {
                TypeOfConstructionId: TypeOfConstructionId,
                LicensingTypeId: LicensingTypeId,
                LicenseFileId: LicenseFileId
            }
        });
        return response;
    }
    // Update SaveFileSetting
    this.SaveFileSetting = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/LicenseFileSetting/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.uploadFile = function (item) {
        var response = $http({
            method: "post",
            url: "/api/AttachmentFile/uploadfiles",
            data: JSON.stringify(item),
            datatype: "json"
        });
        return response;
    }//.
});