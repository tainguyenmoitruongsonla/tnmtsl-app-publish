app.controller("myCntrl", function ($scope, businessService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();

    var pt = angular.element(document.getElementById("portalval"));
    $scope.divFrm = false;
    var user = angular.element(document.getElementById("tbxUsername"));
    var UserName = user.val();
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.AllStatus = [{ Id: 1, Name: 'Đang làm việc' }, { Id: 2, Name: 'Đang nghỉ chế độ' }, { Id: 3, Name: 'Đã nghỉ việc' }]
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.Keyword = '';
    var PortalId = 0, Status = true;
    $scope.Positions = [];

    $scope.testDate = new Date(2013, 9, 22);
    $scope.day = $scope.testDate

    GetData();
    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            businessService.getAllBusinesses(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Busineses = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
            businessService.getSingleBusinessByUserName(UserName).then(function (items) {
                $scope.myitem = items.data;
            })
        }, function () {
            toastr.error('Error in getting records', 'Lỗi');
        });
    }

    $scope.Search = function () {
        GetData();
    }

    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.HeaderAction = "THÊM";
        $scope.divFrm = true;
    }

    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        $scope.HeaderAction = "CẬP NHẬT";
        businessService.getSingleBusiness(item.Id).then(function (item) {
            $scope.myitem = item.data;
        })
    }

    $scope.Save = function (item) {
        if (item.Name == null) {
            toastr.error('Không được để trống tên', 'Lỗi');
            return;
        }
        if (item.Address == null) {
            toastr.error('Không được để trống địa chỉ', 'Lỗi');
            return;
        }

        var getAction = $scope.Action;
        businessService.SaveBusiness(item).then(function (msg) {
            if (getAction === "Update") {
                toastr.success('Cập nhật thành công', 'Thành công');
            }
            else {
                toastr.success('Thêm mới thành công', 'Thành công');
            }
            GetData();
            $scope.divFrm = false;
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Lỗi');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Lỗi');
            }
        });
    }
    $scope.DeleteItem = function (item) {
        if (confirm('Item will be deleted?')) {
            businessService.DeleteBusiness(item).then(function (msg) {
                GetData();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
        }
    }

    function ClearFields() {
        $scope.myitem = {};
    }
    $scope.openAside = function (navId, action, data) {
        $scope.Action = action;
        if (action == "Add") {
            ClearFields();
        } else {
            $scope.myitem = data;
        }
        openAside(navId)
    }
    function openAside(navId) {
        document.getElementById(navId).classList.add('sidenav-open-withmenu');
    }
    $scope.closeAside = function (navId, action, data) {

        closeAside(navId)
    }
    function closeAside(navId) {
        document.getElementById(navId).classList.remove('sidenav-open-withmenu');
    }
});