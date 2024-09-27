app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var RoleId = '';
    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0,
        $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.IsApproved = true
        , $scope.BusinessName = ''
        , $scope.BusinessId = 0
        , $scope.Business = {}
        , $scope.Keyword = '';
    $scope.Years = [];
    $scope.Users = [];
    var ThisYear = document.getElementById("tbxYear").value;
    for (var y = 2019; y <= ThisYear; y++) {
        var item = { Id: y.toString(), Name: 'Năm ' + y.toString() };
        $scope.Years.push(item);
    }
    function GetAllItems() {
        GetData();
        GetRoles();
    }
    GetAllItems();

    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(RoleId, $scope.IsApproved, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Users = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    $scope.Search = function () {
        GetData();
    }
    function GetPositions() {
        myService.getPositions($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllPositions = items.data.ListData;
        });
    }

    GetBusiness()
    function GetBusiness() {
        myService.getAllBusiness(true, '', 1, 0).then(function (items) {
            $scope.Busineses = items.data.ListData;
        });
    }

    $scope.SetBusiness = function (e) {
        if (e == 0) {
            $scope.BusinessName = '';
        } else {
            $scope.BusinessName = e.Name;
            $scope.Business = e;
        }
    }

    function GetRoles() {
        myService.getRoles($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllRoles = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        });
    }
    $scope.drlRoleChanged = function (item) {
        RoleId = '';
        if (item !== null) {
            RoleId = item;
        }
        GetData();
    }
    $scope.CreateUser = function (item) {
        $scope.myitem = item;
        $scope.myitem.FullName = $scope.BusinessName;
        $scope.Business.Name = $scope.BusinessName;
        $scope.Business.UserName = $scope.myitem.UserName;
        $scope.Business.LicenseId = 0;
        if ($scope.myitem.Password === $scope.myitem.ConfirmPassword) {
            myService.createUser($scope.myitem).then(function (msg) {
                //myService.SaveBusiness($scope.Business).then(function (msg) {
                //    if ($scope.Action === "Update") {
                //        toastr.success('Chỉnh sửa thành công', 'Tổ chức/cá nhân');
                //    }
                //    else {
                //        toastr.success('Thêm mới thành công', 'Tổ chức/cá nhân');
                //    }
                //}, function (msg) {
                //    if ($scope.Action === "Update") {
                //        toastr.error('Lỗi cập nhật', 'Error');
                //    }
                //    else {
                //        toastr.error('Lỗi thêm mới', 'Error');
                //    }
                //});
                toastr.success(msg.data, 'Success');
                GetData();
            }, function () {
                toastr.error('Lỗi thêm mới', 'Error');
            })
        }
    }
    $scope.ChangePassword = function (item) {
        $scope.myitem = item;
    }

    $scope.SaveChangePassword = function (item) {
        $scope.myitem = item;
        if ($scope.myitem.NewPassword === $scope.myitem.ConfirmNewPassword) {
            myService.SaveChangePassword($scope.myitem).then(function (msg) {
                toastr.success(msg.data, 'Success');
                GetData();
            })
        }
    }

    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
            $scope.BusinessName = item.data.FullName;
            myService.getSingleBusiness(item.data.UserName).then(function (item) {
                $scope.Business = item.data
            })
        })
    }

    $scope.Save = function () {
        $scope.myitem.FullName = $scope.BusinessName;
        $scope.Business = {};
        myService.Save($scope.myitem).then(function (msg) {
            toastr.success(msg.data, 'Update');
            $scope.Business.Name = $scope.BusinessName;
            $scope.Business.UserName = $scope.myitem.UserName;
            myService.SaveBusiness($scope.Business).then(function (msg) {
                if ($scope.Action === "Update") {
                    toastr.success('Chỉnh sửa thành công', 'Tổ chức/cá nhân');
                }
                else {
                    toastr.success('Thêm mới thành công', 'Tổ chức/cá nhân');
                }
            }, function () {
                if ($scope.Action === "Update") {
                    toastr.error('Lỗi cập nhật', 'Error');
                }
                else {
                    toastr.error('Lỗi thêm mới', 'Error');
                }
            });
            GetData();
            $scope.divFrm = false;
        }, function () {
            if ($scope.Action === "Update") {
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
    $scope.CheckRole = function (role, myitem) {
        $scope.userrole = {};
        $scope.userrole.RoleId = role.Id;
        $scope.userrole.UserId = myitem.Id;
        if (role.IsUserInRole === true) {
            myService.SaveUserRole($scope.userrole).then(function (msg) {
                toastr.success(msg.data, 'Update');
                GetData();
                $scope.divFrm = false;
            }, function () {
                toastr.error('Lỗi cập nhật', 'Error');
            });
        }
        else {
            myService.DeleteUserRole($scope.userrole).then(function (msg) {
                GetData();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    $scope.OpenSyncUser = function (navId) {
        openAside(navId);
    }
    $scope.SyncUser = function (AdmissionYear) {
        myService.SyncUser(AdmissionYear).then(function (items) {
            $scope.syncError = items.data.ListData;
            $scope.TotalErr = items.data.TotalCount;
            $scope.TotalStudent = items.data.TotalCountMore;
        })
    }//.
    $scope.openAside = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        myService.getSingle(item.Id).then(function (user) {
            $scope.myitem = user.data;
            myService.getRoles('', 0, 0).then(function (items) {
                $scope.AllRoles = items.data.ListData;
                $scope.AllRoles.forEach(function (role) {
                    role.IsUserInRole = false;
                    $scope.myitem.MyRoles.forEach(function (myrole) {
                        if (role.Id === myrole.Id) {
                            role.IsUserInRole = true;
                        }
                    })
                });
            });
        })
        openAside(navId);
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }

    function openAside(navId) {
        document.getElementById(navId).classList.add('sidenav-open');
    }
    function closeAside(navId) {
        document.getElementById(navId).classList.remove('sidenav-open');
    }

    function ClearFields() {
        $scope.myitem = {};
    }
});