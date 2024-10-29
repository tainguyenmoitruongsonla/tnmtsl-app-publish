app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (Keyword, PageIndex, PageSize) {
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

    //GetSingle
    this.getSingle = function (id) {
        var response = $http({
            method: "get",
            url: "/api/RoleMan/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    this.getAllDashboardForRole = function (PortalId, RoleName) {
        var response = $http({
            method: "get",
            url: "/api/Dashboard/listforrole",
            params: {
                PortalId: PortalId,
                RoleName: RoleName
            }
        });
        return response;
    }
    // Update RoleDashboard
    this.SaveRoleDashboard = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/RoleDashboard/save",
            data: JSON.stringify(Item),
            datalevel: "json"
        });
        return response;
    }
    this.DeleteRoleDashboard = function (item) {
        var response = $http({
            method: "post",
            url: "/api/RoleDashboard/delete",
            data: JSON.stringify(item),
            datalevel: "json"
        });
        return response;
    }

    // get Permission
    this.getPermissions = function (PortalId, RoleName, UserName, DashboardId, PermitCode) {
        var response = $http({
            method: "get",
            url: "/api/Permission/list",
            params: {
                PortalId: PortalId,
                RoleName: RoleName,
                UserName: UserName,
                DashboardId: DashboardId,
                PermitCode: PermitCode
            }
        });
        return response;
    }

    // Save Permission
    this.SavePermission = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Permission/save",
            data: JSON.stringify(Item),
            datalevel: "json"
        });
        return response;
    }
    this.DeletePermitItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Permission/delete",
            data: JSON.stringify(item),
            datalevel: "json"
        });
        return response;
    }

    // Update Dashboard
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Dashboard/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Dashboard/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //Begin WorkFlow
    //get AllWorkFlow
    this.getAllWorkFlow = function (RoleId, UserId, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/WorkFlow/list",
            params: {
                RoleId: RoleId,
                UserId: UserId,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    //get Single RoleWork
    this.getSingleRoleWork = function (WorkFlowId, RoleId) {
        var response = $http({
            method: "get",
            url: "/api/WorkFlowRole/getbyrolebywfl",
            params: {
                WorkFlowId: WorkFlowId,
                RoleId: RoleId,
            }
        });
        return response;
    }
    this.saveRoleWork = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/WorkFlowRole/savefromwf",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    //Delete
    this.DeleteRoleWork = function (item) {
        var response = $http({
            method: "post",
            url: "/api/WorkFlowRole/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //End WorkFlow
});