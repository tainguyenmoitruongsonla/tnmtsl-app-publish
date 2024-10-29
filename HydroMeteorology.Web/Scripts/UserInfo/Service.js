app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (RoleId, IsApproved, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/UserMan/list",
            params: {
                RoleId: RoleId,
                IsApproved: IsApproved,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingle = function (Id) {
        var response = $http({
            method: "get",
            url: "/api/UserMan/getbyid",
            params: {
                Id: Id
            }
        });
        return response;
    }
    // Create User
    this.createUser = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/UserMan/create",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    // Save User
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/UserMan/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/UserMan/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    // Sync User
    this.SyncUser = function (AdmissionYear) {
        var response = $http({
            method: "get",
            url: "/api/UserMan/syncuser",
            params: {
                AdmissionYear: AdmissionYear,
            }
        });
        return response;
    }
    //GetRoles
    this.getRoles = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/RoleMan/list",
            params: {
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.SaveUserRole = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/UserRole/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    //Delete
    this.DeleteUserRole = function (item) {
        var response = $http({
            method: "post",
            url: "/api/UserRole/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.saveChangePassword = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/UserMan/changepassword",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
});