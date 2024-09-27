app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();

    var pt = angular.element(document.getElementById("portalval"));
    $scope.divFrm = false;
    //To Get All Records  
    $scope.TotalItem = 0
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.Keyword='';
    var Status = 1;

    function GetAllItems() {
        GetData()
    }
    GetAllItems();
    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.AllSpeciality = items.data.ListData;
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
    
    function ClearFields() {
        $scope.myitem = {};
    }
});