﻿app.controller("myCtrl", function ($scope, profileService, toastr) {
    'use strict'
    var DepartmentId = 0;
    var RoleId = '';
    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.Sexs = [{ Id: 1, Name: 'Nam' }, { Id: 2, Name: 'Nữ' }, { Id: 3, Name: 'Khác' }]
        , $scope.AllStatus = [{ Id: 1, Name: 'Đang làm việc' }, { Id: 2, Name: 'Đang nghỉ chế độ' }, { Id: 3, Name: 'Đã nghỉ việc' }]
        //, $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 20
        , $scope.maxSize = 5
        , $scope.IsApproved = true
        , $scope.Keyword = '';
    //console.log($scope.myitem.Id)
    $scope.Users = [];

    function GetAllItems() {
        GetData();
        GetDepartments();
        //GetPositions();
        GetRoles();
    }
    GetAllItems();

    function GetData() {
        profileService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
            //console.log($scope.myitem);
        }, function () {
            toastr.error('Error in getting records', 'Error');
        })
    }

    function GetDepartments() {
        profileService.getDepartments($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllDepartments = items.data.ListData;
        });
    }
    function GetPositions() {
        profileService.getPositions($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllPositions = items.data.ListData;
        });
    }

    function GetRoles() {
        profileService.getRoles($scope.Keyword, 0, 0).then(function (items) {
            $scope.AllRoles = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        });
    }

    $scope.ChangePassword = function (item) {
        $scope.myitem = item;
    }

    $scope.SaveChangePassword = function (item) {
        $scope.myitem = item;
        if ($scope.myitem.NewPassword === $scope.myitem.ConfirmNewPassword) {
            profileService.SaveChangePassword($scope.myitem).then(function (msg) {
                toastr.success(msg.data, 'Success');
                GetData();
            })
        }
    }

    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        profileService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
            //console.log($scope.myitem);
        })
    }

    $scope.Save = function () {
        var getAction = $scope.Action;
        profileService.Save($scope.myitem).then(function (msg) {
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
});