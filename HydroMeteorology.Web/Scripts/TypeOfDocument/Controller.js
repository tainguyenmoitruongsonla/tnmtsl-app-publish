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
        , $scope.myitem = {};
        , $scope.currentPage = 1
        , $scope.numPerPage = 20
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    var PortalId = 0, ParentId = 0, Status = true, IssueState=-1;

    var TypeOfDocumentId = 0;
    var LicenseFileId = 0;
    $scope.testDate = new Date(2013, 9, 22);
    $scope.day = $scope.testDate

    function GetAllItems() {
        myService.getAll(PortalId, ParentId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
            items.data.ListData.forEach(function (row) {
                $scope.ParentTypes.push(row);
            })
        });
        GetData()
    }
    GetAllItems();

    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAll(PortalId, ParentId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.AllTypes = items.data.ListData;
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
            //console.log($scope.myitem);
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
        ParentId = 0;
        if (parentId > 0) {
            ParentId = parentId;
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

    $scope.SaveFileSetting = function (typeId, LicensingTypeId, FilesItems) {
        FilesItems.forEach(function (row) {
            if (row.IsAttach === true) {
                $scope.LicenseFileSettingItem.TypeOfDocumentId = typeId;
                $scope.LicenseFileSettingItem.LicensingTypeId = LicensingTypeId;
                $scope.LicenseFileSettingItem.LicenseFileId = row.Id;
                $scope.LicenseFileSettingItem.FileTemplate = row.FileTemplate;
                $scope.LicenseFileSettingItem.TemplateName = row.FileName;
                myService.SaveFileSetting($scope.LicenseFileSettingItem).then(function (msg) {
                    GetLicenseFile();
                })
            }
        })
    }
    $scope.loadFile = function (files, itemId, itemValue, LicensingTypeId, FileTemp, typeitemId) {
        //console.log(files, itemId, itemValue, LicensingTypeId, typeitemId);
        //return;
        for (var i = 0; i < files.length; i++) {
            (function (file) {
                var fileReader = new FileReader();
                fileReader.onload = function (f) {
                    $scope.item = {
                        base64Content: f.target.result,
                        AttachmentType: 6,
                        DocumentId: itemId,
                        FileName: file.name,
                        FileDescription: 'Template',
                        Notation: FileTemp,
                        FileOrder: typeitemId,
                        ContentType: file.type,
                        FileSize: file.size,
                        filePath: itemValue
                    }
                    //console.log($scope.item);
                    //console.log($scope.item.base64Content.length);
                    //return;
                    myService.uploadFile($scope.item).then(function (msg) {
                        if (msg.data === 'FAIL') {
                            alert('Chọn và tải lên file (.pdf)');
                            return;
                        }
                        else {
                        }
                    })
                };
                fileReader.readAsDataURL(file);
            })(files[i]);
        }
    }
    //-----------
    $scope.openSetting = function (navId, item) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        $scope.typeitem = item;
        GetLicensingType(item);
        GetLicenseFile();
        openAside(navId);
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }
    //------------
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