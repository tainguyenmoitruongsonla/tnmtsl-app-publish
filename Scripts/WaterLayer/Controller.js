app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();

    var pt = angular.element(document.getElementById("portalval"));
    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.ParentTypes = []
        , $scope.AllStatus = [{ Id: true, Name: 'Hiển thị' }, { Id: false, Name: 'Chưa hiển thị' }]
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    var PortalId = 0, ParentId = 0, Status = true, TypeId = 0, ProvinceId = 0, DistrictId = 0, CommuneId = 0, CityCode = '', DistrictCode = '';
    $scope.Positions = [];

    $scope.testDate = new Date(2013, 9, 22);
    $scope.day = $scope.testDate

    function GetAllItems() {
        myService.getAllType(PortalId, ParentId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
            items.data.ListData.forEach(function (row) {
                $scope.ParentTypes.push(row);
                row.Childrent.forEach(function (row1) {
                    row1.TypeName = '|--' + row1.TypeName
                    $scope.ParentTypes.push(row1);
                })
            })
        });
        GetData()
    }
    GetAllItems();

    $scope.AddItem = function () {
        ClearFields();
        $scope.Districts = [];
        $scope.Communes = [];
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
            if ($scope.myitem.ProvinceId > 0) {
                GetDistricts($scope.myitem.ProvinceId);
                if ($scope.myitem.DistrictId > 0) {
                    GetCommune($scope.myitem.DistrictId);
                }
            }
        })
    }
    $scope.StatusChange = function (statusid) {
        Status = true;
        if (statusid === false) {
            Status = statusid;
        }
        GetData();
    }
    $scope.ParentChange = function (parentId) {
        //console.log(parentId);
        TypeId = 0;
        if (parentId > 0) {
            TypeId = parentId;
        }
        GetData();
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
            myService.getAll(0, -1, 1, 0, 0, -1, 0, false, false, true, -1, -1, '', $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.AllConstructions = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
                //console.log($scope.AllConstructions);
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.ProvinceChange = function (CityId) {
        if (CityId !== null) {
            GetDistricts(CityId);
        }
        else {
            $scope.Districts = [];
            $scope.Communes = [];
        }
    }
    $scope.DistrictChange = function (DistrictId) {
        if (DistrictId !== null) {
            GetCommune(DistrictId);
        }
        else {
            $scope.Communes = [];
        }
    }

    GetProvince();
    function GetProvince() {
        myService.getAllProvince($scope.Keyword, 0, 0).then(function (items) {
            $scope.Provinces = items.data.ListData;
        });
    }
    function GetDistricts(CityId) {
        myService.getDistrict(CityId, CityCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetCommune(DistrictId) {
        myService.getCommunes(DistrictId, CityCode, DistrictCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Communes = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function ClearFields() {
        $scope.myitem = {};
    }
});