app.controller("myCntrl", function ($scope, basinService, toastr) {
    'use strict'

    $scope.TotalItem = 0
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 12
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    var Status = true, isDetail = false;

    GetBasins();
    function GetBasins() {
        $scope.$watch('currentPage + numPerPage', function () {
            basinService.getAllBasins(Status, $scope.Keyword, isDetail, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Basins = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    $scope.Search = function () {
        GetBasins();
    }
    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        basinService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
        })
    }

    $scope.Save = function () {
        var getAction = $scope.Action;
        basinService.Save($scope.myitem).then(function (msg) {
            toastr.success(msg.data, 'Update');
            GetBasins();
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
            basinService.DeleteItem(item).then(function (msg) {
                GetBasins();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }

    function ClearFields() {
        $scope.myitem = {};
    }
});