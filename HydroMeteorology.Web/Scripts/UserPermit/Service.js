app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getAll = function (DepartmentId, RoleId, IsApproved, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/UserMan/list",
            params: {
                DepartmentId: DepartmentId,
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
            url: "/api/UserMan/getuserinfobyid",
            params: {
                Id: Id
            }
        });
        return response;
    }

    this.getAllDashboardForUser = function (PortalId, UserName) {
        var response = $http({
            method: "get",
            url: "/api/Dashboard/listforuser",
            params: {
                PortalId: PortalId,
                UserName: UserName
            }
        });
        return response;
    }

    //GetDepartment
    this.getDepartments = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Department/list",
            params: {
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    this.getPositions = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Position/list",
            params: {
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
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
    // Update UserDashboard
    this.SaveUserDashboard = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/UserDashboard/save",
            data: JSON.stringify(Item),
            datalevel: "json"
        });
        return response;
    }
    this.DeleteUserDashboard = function (item) {
        var response = $http({
            method: "post",
            url: "/api/UserDashboard/delete",
            data: JSON.stringify(item),
            datalevel: "json"
        });
        return response;
    }//.

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
    this.getSingleUserWork = function (WorkFlowId, UserId) {
        var response = $http({
            method: "get",
            url: "/api/WorkFlowUser/getbyrolebywfl",
            params: {
                WorkFlowId: WorkFlowId,
                UserId: UserId,
            }
        });
        return response;
    }
    this.saveUserWork = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/WorkFlowUser/savefromwf",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
    //Delete
    this.DeleteUserWork = function (item) {
        var response = $http({
            method: "post",
            url: "/api/WorkFlowUser/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //End WorkFlow
});