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
        , $scope.Keyword = '';

    $scope.AllFiles = [];
    $scope.DataEntries = [];

    function GetAllItems() {
        GetData()
    }
    GetAllItems();
    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll($scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataEntries = items.data.ListData;
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
        myService.getSingle(item.ID).then(function (item) {
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
    $scope.DeleteDataFile = function (item) {
        if (confirm('Item will be deleted?')) {
            myService.deleteDataFile(item).then(function (msg) {
                GetDataFile($scope.myitem.ID);
                toastr.error('Xóa thành công', 'Delete');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    $scope.loadFile = function (files) {
        //console.log($scope.myitem);
        //console.log(files);
        for (var i = 0; i < files.length; i++) {
            (function (file) {
                //if (file.type.indexOf("image") === 0)
                //{
                var fileReader = new FileReader();
                fileReader.onload = function (f) {
                    //console.log(file);
                    $scope.item = { DataId: $scope.myitem.ID, base64Content: f.target.result, FileName: file.name, ContentType: file.type, FileSize: file.size, filePath: '' }
                    //console.log($scope.item);
                    //return;
                    myService.uploadFile($scope.item).then(function (msg) {
                        GetDataFile($scope.myitem.ID);
                    })
                };
                fileReader.readAsDataURL(file);
                //}
            })(files[i]);
        }
    }

    function GetDataFile(DataId) {
        myService.getDataFile(DataId, 0, 0).then(function (items) {
            $scope.AllFiles = items.data.ListData;
        })
    }
    function GetDataFeedback(DataId) {
        myService.getDataFeedback(DataId, '', 0, 0).then(function (items) {
            $scope.AllFeedBacks = items.data.ListData;
        })
    }
    $scope.ViewFiles = function (navId, item) {
        $scope.myitem = item;
        GetDataFile(item.ID)
        openAside(navId);
    }
    $scope.ViewFeedback = function (navId, item) {
        $scope.myitem = item;
        GetDataFeedback($scope.myitem.ID);
        openAside(navId);
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }

    function openAside(navId) {
        document.getElementById(navId).style.width = "50%";
    }
    function closeAside(navId) {
        document.getElementById(navId).style.width = "0";
    }

    function ClearFields() {
        $scope.myitem = {};
    }
});