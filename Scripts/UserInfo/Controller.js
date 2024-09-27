app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var RoleId = '';
    var getUser = $('#userName').val();
    //To Get All Records
    $scope.TotalItem = 0
    $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 0
        , $scope.maxSize = 5
        , $scope.IsApproved = true
        , $scope.Keyword = '';

    $scope.User = [];
    $scope.Users = [];
    $scope.IsUpdate = false;

    function GetAllItems() {
        GetData();
        GetRoles();
    }
    GetAllItems();

    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(RoleId, $scope.IsApproved, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                items.data.ListData.forEach(function (e) {
                    if (e.AccountType == 1) {
                        e.AccountTypeName = "Tổ chức"
                    } else {
                        e.AccountTypeName = "Cá nhân"
                    }
                    if (e.UserName == getUser) {
                        $scope.User.push(e);
                    }
                })
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
        if ($scope.myitem.Password === $scope.myitem.ConfirmPassword) {
            myService.createUser($scope.myitem).then(function (msg) {
                toastr.success(msg.data, 'Success');
                GetData();
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
    $scope.EditItem = function () {
        var item = $scope.User;
        $scope.Action = "Update";
        $scope.IsUpdate = true;
        myService.getSingle(item[0].Id).then(function (item) {
            $scope.myitem = item.data;
        })
    }
    $scope.Close = function () {
        $scope.IsUpdate = false;
    }
    $scope.Save = function () {
        var getAction = $scope.Action;
        myService.Save($scope.User[0]).then(function (msg) {
            toastr.success(msg.data, 'Update');
            GetData();
            $scope.IsUpdate = false;
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