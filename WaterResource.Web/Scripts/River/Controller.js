app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'

    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 12
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    var Status = true;

    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
        })
    }

    $scope.Save = function () {
        var getAction = $scope.Action;
        myService.Save($scope.myitem).then(function (msg) {
            toastr.success(msg.data, 'Update');
            GetData(0);
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
    $scope.filterDataByBasin = function (BasinId) {
        //console.log(BasinId)

        if (BasinId != null || BasinId != undefined) {
            GetData(BasinId)
        } else {
            GetData(0)
        }
    }
    $scope.DeleteItem = function (item) {
        if (confirm('Item will be deleted?')) {
            myService.DeleteItem(item).then(function (msg) {
                GetData(0);
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    GetData(0)
    function GetData(BasinId) {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(BasinId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Rivers = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    GetBasins();
    function GetBasins() {
        myService.getAllBasins(Status, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Basins = items.data.ListData;
        });
    }

    $scope.openAside = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        openAside(navId)
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }
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