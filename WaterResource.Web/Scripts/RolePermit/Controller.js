app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var PortalId = 0;

    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.Permission = {}
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.IsApproved = true
        , $scope.Keyword = '';
    var RoleId = '', UserId = '';
    var DepartmentId = 0;
    $scope.Roles = [];

    function GetAllItems() {
        GetAll()
    }
    GetAllItems();

    $scope.Search = function () {
        GetAllRoleMan()
    }

    function GetAll() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll($scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Roles = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    GetAllRoleMan()
    function GetAllRoleMan() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllRoleMan($scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Roles = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    //$scope.EditItem = function (item) {
    //    $scope.Action = "Update";
    //    myService.getSingle(item.Id).then(function (item) {
    //        $scope.myitem = item.data;
    //        //console.log($scope.myitem);
    //    })
    //}

    $scope.Save = function () {
        var getAction = $scope.Action;
        myService.Save($scope.myitem).then(function (msg) {
            toastr.success(msg.data, 'Update');
            GetAll();
            $scope.divFrm = false;
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
    }
    $scope.DeleteItem = function (item) {
        if (confirm('Item will be deleted?')) {
            myService.DeleteItem(item).then(function (msg) {
                GetData();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    $scope.CheckDashAccess = function (rdash) {
        if (rdash.PermitAccess === false) {
            rdash.PermitAccess = true;
            myService.SaveRoleDashboard(rdash).then(function (msg) {
                toastr.success('Đã cập nhật quyền truy cập dashboard', 'Success');
                GetDashboardForRole(rdash.RoleName);
            })
        }
        else {
            myService.DeleteRoleDashboard(rdash).then(function (msg) {
                toastr.warning('Removed dashboard', 'Success');
                GetDashboardForRole(rdash.RoleName);
            })
        }
    }
    $scope.CheckDashByRole = function (rdash) {
        if (rdash.PermitByRole === false) {
            rdash.PermitByRole = true;
        }
        else {
            rdash.PermitByRole = false;
        }
        myService.SaveRoleDashboard(rdash).then(function (msg) {
            toastr.success('Đã cập nhật quyền truy cập dashboard', 'Success');
            GetDashboardForRole(rdash.RoleName);
        })
    }

    $scope.CheckDashByPortal = function (rdash) {
        if (rdash.PermitByPortal === false) {
            rdash.PermitByPortal = true;
        }
        else {
            rdash.PermitByPortal = false;
        }
        myService.SaveRoleDashboard(rdash).then(function (msg) {
            toastr.success('Đã cập nhật quyền truy cập dashboard', 'Success');
            GetDashboardForRole(rdash.RoleName);
        })
    }
    $scope.CheckFunction = function (role, dash, func) {
        $scope.func = func;
        $scope.Permission.PortalId = PortalId;
        $scope.Permission.RoleId = role.Id;
        $scope.Permission.RoleName = role.Name;
        $scope.Permission.DashboardId = dash.Id;
        $scope.Permission.RightId = func.Id;
        $scope.Permission.PermitValue = true;
        $scope.Permission.function = $scope.func;
        if (func.Status === true) {
            //console.log($scope.Permission);
            myService.SavePermission($scope.Permission).then(function (msg) {
                toastr.success('Đã cập nhật chức năng của người dùng', 'Success');
            }, function () {
                toastr.error('Lỗi cập nhật', 'Error');
            });
        }
        else {
            myService.getPermissions(PortalId, $scope.Permission.RoleName, '', $scope.Permission.DashboardId, $scope.func.PermitCode).then(function (items) {
                if (items.data.length > 0) {
                    $scope.itemToDel = items.data[0];
                    //console.log($scope.itemToDel);
                    myService.DeletePermitItem($scope.itemToDel).then(function (msg) {
                        toastr.success('Đã cập nhật chức năng của người dùng', 'Success');
                    })
                }
            });
        }
    }

    function GetDashboardForRole(RoleName) {
        myService.getAllDashboardForRole(PortalId, RoleName).then(function (items) {
            $scope.dashforroles = items.data;
        })
    }
    //-----------Role Work
    function GetRoleWork(RoleId) {
        myService.getAllWorkFlow(RoleId, '', '', 0, 0).then(function (items) {
            $scope.WorkFlows = items.data.ListData
        })
    }
    $scope.SaveRoleWork = function (roledto, WorkFlows) {
        //console.log(roledto);
        WorkFlows.forEach(function (row) {
            row.RoleId = roledto.Id;
            if (row.IsViewByRole === true) {
                myService.SaveRoleWork(row).then(function (msg) {
                    toastr.success('Đã cập nhật luồng công việc cho role', 'Success');
                    GetRoleWork(roledto.Id);
                })
            }
            else {
                myService.getSingleRoleWork(row.Id, roledto.Id).then(function (item) {
                    if (item.data.Id > 0) {
                        myService.DeleteRoleWork(row).then(function (msg) {
                            //console.log('Xóa thành công role work', 'Delete');
                        }, function () {
                            toastr.error('Có lỗi khi xóa', 'Error');
                        });
                    }
                })
                GetRoleWork(roledto.Id);
            }
        })
    }
    $scope.CheckIsView = function (flowdto) {
        flowdto.IsViewByRole = true;
    }
    $scope.openAsideWork = function (navId, item) {
        $scope.role = item;
        openAside(navId);
        RoleId = item.Id;
        GetRoleWork(RoleId);
    }
    $scope.closeAsideWork = function (navId) {
        closeAside(navId);
    }
    //-----------
    $scope.openAside = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        $scope.role = item;
        openAside(navId);
        $scope.role.dashboards.forEach(function (dashrow) {
            var curentDashId = dashrow.Id;
            myService.getPermissions(PortalId, $scope.role.Name, '', curentDashId, '').then(function (items) {
                $scope.myPermits = items.data;
                if ($scope.myPermits !== null) {
                    $scope.myPermits.forEach(function (permitRow) {
                        dashrow.Functions.forEach(function (funcRow) {
                            if (permitRow.RightId === funcRow.Id) {
                                funcRow.Status = true;
                            }
                        })
                    });
                };
            });
        })
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }
    //-------------
    $scope.openAsideDash = function (navId, item) {
        $scope.role = item;
        GetDashboardForRole(item.Name);
        openAside(navId)
    }
    $scope.closeAsideDash = function (navId) {
        closeAside(navId);
    }
    //------------
    function openAside(navId) {
        document.getElementById(navId).classList.add('sidenav-open-withmenu');
    }
    function closeAside(navId) {
        document.getElementById(navId).classList.remove('sidenav-open-withmenu');
    }

    function ClearFields() {
        $scope.myitem = {};
    }
});