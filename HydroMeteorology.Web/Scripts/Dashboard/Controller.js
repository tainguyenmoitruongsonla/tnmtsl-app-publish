app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();

    var pt = angular.element(document.getElementById("portalval"));

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
        , $scope.Keyword = '';

    $scope.Dashboards = [];
    //console.log($scope.Sexs);

    $scope.testDate = new Date(2013, 9, 22);
    $scope.day = $scope.testDate
    //console.log($scope.testDate);

    function GetAllItems() {
        GetData()
    }
    GetAllItems();

    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
            //console.log($scope.myitem);
        })
    }

    $scope.Save = function () {
        var getAction = $scope.Action;
        myService.Save($scope.myitem).then(function (msg) {
            toastr.success(msg.data, 'Update');
            GetData();
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
    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll($scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Dashboards = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function ClearFields() {
        $scope.myitem = {};
    }
});