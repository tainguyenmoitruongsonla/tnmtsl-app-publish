app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var PortalId = 0;
    var PositionId = 0;
    var DepartmentId = 0;
    var RoleId = '', UserId = '';
    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.Sexs = [{ Id: 1, Name: 'Nam' }, { Id: 2, Name: 'Nữ' }, { Id: 3, Name: 'Khác' }]
        , $scope.AllStatus = [{ Id: 1, Name: 'Đang làm việc' }, { Id: 2, Name: 'Đang nghỉ chế độ' }, { Id: 3, Name: 'Đã nghỉ việc' }]
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 20
        , $scope.maxSize = 5
        , $scope.IsApproved = true
        , $scope.Keyword = ''
        , $scope.Permission = {};
    $scope.Users = [];

    function GetAllItems() {
        GetData();
        //GetDepartments();
        //GetPositions();
        //GetRoles();
    }
    GetAllItems();

    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(DepartmentId, RoleId, $scope.IsApproved, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Users = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function GetDepartments() {
        myService.getDepartments($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllDepartments = items.data.ListData;
        });
    }
    function GetPositions() {
        //myService.getPositions($scope.Keyword, 0, 0).then(function (items) {
        //    $scope.AllPositions = items.data.ListData;
        //});
    }

    function GetRoles() {
        myService.getRoles($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllRoles = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        });
    }

    $scope.drlDepartmentChanged = function (item) {
        DepartmentId = 0;
        if (item !== null) {
            DepartmentId = item;
        }
        GetData();
    }
    $scope.drlRoleChanged = function (item) {
        RoleId = '';
        if (item !== null) {
            RoleId = item;
        }
        GetData();
    }

    $scope.CheckDashAccess = function (udash) {
        if (udash.PermitAccess === false) {
            udash.PermitAccess = true;
            myService.SaveUserDashboard(udash).then(function (msg) {
                toastr.success('Đã cập nhật quyền truy cập dashboard', 'Success');
                //console.log(PortalId, udash.UserName);
                GetDashboardForUser(PortalId, udash.UserName);
            })
        }
        else {
            myService.DeleteUserDashboard(udash).then(function (msg) {
                toastr.warning('Removed dashboard', 'Success');
                GetDashboardForUser(PortalId, udash.UserName);
            })
        }
    }

    $scope.CheckDashByUser = function (udash) {
        if (udash.PermitByUser === false) {
            udash.PermitByUser = true;
        }
        else {
            udash.PermitByUser = false;
        }
        myService.SaveUserDashboard(udash).then(function (msg) {
            toastr.success('Đã cập nhật quyền truy cập dashboard', 'Success');
            GetDashboardForUser(PortalId, udash.UserName);
        })
    }

    $scope.CheckDashByPortal = function (udash) {
        if (udash.PermitByPortal === false) {
            udash.PermitByPortal = true;
        }
        else {
            udash.PermitByPortal = false;
        }
        myService.SaveUserDashboard(udash).then(function (msg) {
            toastr.success('Đã cập nhật quyền truy cập dashboard', 'Success');
            GetDashboardForUser(PortalId, udash.UserName);
        })
    }
    $scope.CheckFunction = function (user, dash, func) {
        $scope.func = func;
        $scope.Permission.PortalId = PortalId;
        $scope.Permission.UserId = user.Id;
        $scope.Permission.UserName = user.UserName;
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
            myService.getPermissions(PortalId, '', $scope.Permission.UserName, $scope.Permission.DashboardId, $scope.func.PermitCode).then(function (items) {
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
    function GetDashboardForUser(PortalId, UserName) {
        myService.getAllDashboardForUser(PortalId, UserName).then(function (items) {
            $scope.dashforuser = items.data;
        })
    }
    //------------Start User Work
    function GetUserWork(UserId) {
        myService.getAllWorkFlow('', UserId, '', 0, 0).then(function (items) {
            $scope.WorkFlows = items.data.ListData
        })
    }
    $scope.SaveUserWork = function (userdto, WorkFlows) {
        //console.log(userdto);
        WorkFlows.forEach(function (row) {
            row.UserId = userdto.Id;
            if (row.IsViewByUser === true) {
                myService.SaveUserWork(row).then(function (msg) {
                    toastr.success('Đã cập nhật luồng công việc cho user', 'Success');
                    GetUserWork(userdto.Id);
                })
            }
            else {
                myService.getSingleUserWork(row.Id, userdto.Id).then(function (item) {
                    if (item.data.Id > 0) {
                        myService.DeleteUserWork(row).then(function (msg) {
                            //console.log('Xóa thành công user work', 'Delete');
                        }, function () {
                            toastr.error('Có lỗi khi xóa', 'Error');
                        });
                    }
                })
                GetUserWork(userdto.Id);
            }
        })
    }
    $scope.CheckIsView = function (flowdto) {
        flowdto.IsViewByUser = true;
    }
    $scope.openAsideWork = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        $scope.useritem = item;
        openAside(navId);
        UserId = item.Id;
        GetUserWork(UserId);
    }
    $scope.closeAsideWork = function (navId) {
        closeAside(navId);
    }
    //------------End User Work
    $scope.openAside = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        $scope.user = item;
        myService.getSingle(item.Id).then(function (user) {
            $scope.user = user.data;
            //console.log($scope.user);
            $scope.user.dashboards.forEach(function (dashrow) {
                var curentDashId = dashrow.Id;
                myService.getPermissions(PortalId, '', $scope.user.UserName, curentDashId, '').then(function (items) {
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
        })
        openAside(navId);
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }
    //-------------
    $scope.openAsideDash = function (navId, item) {
        $scope.useritem = item;
        GetDashboardForUser(PortalId, item.UserName);
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