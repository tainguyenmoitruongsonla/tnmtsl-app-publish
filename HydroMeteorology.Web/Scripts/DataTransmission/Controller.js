app.controller("myCntrl", function ($scope, dataTransmissionService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    $scope.divFrm = false;

    $scope.TotalItem = 0
        
        //$scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 20
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    $scope.Status = true;
    var ParentId = 0;
    $scope.Positions = [];

    GetDataTransmissions('TNN');
    function GetDataTransmissions(DataType) {
        $scope.$watch('currentPage + numPerPage', function () {
            dataTransmissionService.getAllTransmissions(DataType, $scope.Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataTransmissions = items.data.ListData;
                $scope.TotalItemTransAcc = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.RequestConnection = function () {
        if ($scope.Status == true) {
            $scope.Status = false;
        } else {
            $scope.Status = true;
        }
        GetDataTransmissions('TNN');
    }

    $scope.AddItem = function (asideId) {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
        $scope.HeaderAction = "THÊM MỚI";
        $scope.myitem.DataType = 'TNN';
        openAside(asideId);
    }
    $scope.EditItem = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CẬP NHẬT";
        dataTransmissionService.getSingleDataTransmission(item.Id).then(function (item) {
            $scope.myitem = item.data;
        })
        openAside(asideId);
    }

    $scope.Save = function (asideId) {
        var getAction = $scope.Action;
        dataTransmissionService.SaveTransmission($scope.myitem).then(function (msg) {
            toastr.success("Thao tác thành công", 'Update');
            GetDataTransmissions('TNN');
            $scope.divFrm = false;
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
        closeAside(asideId);
    }

    $scope.DeleteItem = function (item) {
        if (confirm('Item will be deleted?')) {
            dataTransmissionService.DeleteTransmission(item).then(function (msg) {
                GetDataTransmissions('TNN');
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }

    GetAllUser();
    function GetAllUser() {
        dataTransmissionService.getAllUser('', true, '', 1, 0).then(function (items) {
            $scope.Users = items.data.ListData;
        });
    }

    function ClearFields() {
        $scope.myitem = {};
    }

    function openAside(asideId) {
        closeAllAside();
        document.getElementById(asideId).classList.add('sidenav-open-w50');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-w50');
        ClearFields();
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }

    function closeAllAside() {
        let sidenavs = document.getElementsByClassName('sidenav-open-w50');
        for (let sidenav of sidenavs) {
            sidenav.classList.remove('sidenav-open-w50');
        }
    }
});