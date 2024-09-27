app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();

    var pt = angular.element(document.getElementById("portalval"));
    $scope.divFrm = false;
    //To Get All Records
    $scope.TotalItem = 0
        , $scope.AllStatus = [{ Id: 1, Name: 'Hiển thị' }, { Id: 0, Name: 'Không hiển thị' }]
        , $scope.myitem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    var PortalId = 0, ParentId = 0, Status = 1;

    $scope.testDate = new Date(2013, 9, 22);
    $scope.day = $scope.testDate

    GetParent(ParentId);
    function GetParent(ParentId) {
        myService.getAll(PortalId, ParentId, Status, $scope.Keyword, 0, 0).then(function (items) {
            $scope.ParentItems = items.data.ListData;
            $scope.Parents = items.data.ListData;
        });
    }
    $scope.ParentChange = function (parentId) {
        ParentId = 0;
        if (parentId > 0) {
            ParentId = parentId;
        }
        GetData(ParentId);
    }
    $scope.StatusChange = function (mystatus) {
        Status = 1;
        if (mystatus >= 0) {
            Status = mystatus;
        }
        GetData(ParentId);
    }
    GetData();
    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(PortalId, ParentId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.NewsCategories = items.data.ListData;
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

    //-------------
    $scope.openAside = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        openAside(navId)
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }
    //------------
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