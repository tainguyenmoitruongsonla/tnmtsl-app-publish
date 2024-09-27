app.controller("myCntrl", function ($scope, typeOfConstructionService, toastr) {
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
        , $scope.LicenseFileSettingItem = {}
        , $scope.LicensingTypeSettingItem = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 10
        , $scope.maxSize = 5
        , $scope.Keyword = '';

    var PortalId = 0, ParentId = 0, Status = true, IssueState = -1;
    var LicensingTypeId = 0;
    var TypeOfConstructionId = 0;
    var LicenseFileId = 0;
    $scope.testDate = new Date(2013, 9, 22);
    $scope.day = $scope.testDate

    function GetAllItems() {
        typeOfConstructionService.getTypeOfConstructions(ParentId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
            items.data.ListData.forEach(function (row) {
                $scope.ParentTypes.push(row);
            })
        });
        GetData()
    }
    GetAllItems();

    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            typeOfConstructionService.getTypeOfConstructions(ParentId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
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
        typeOfConstructionService.getSingle(item.Id).then(function (item) {
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
        typeOfConstructionService.Save($scope.myitem).then(function (msg) {
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
            typeOfConstructionService.DeleteItem(item).then(function (msg) {
                GetData();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    $scope.LicensingTypeChanged = function (ItemId) {
        LicensingTypeId = 0;
        if (ItemId > 0) {
            LicensingTypeId = ItemId;
        }
        GetLicenseFile();
    }
    function GetLicensingType(item) {
        typeOfConstructionService.getLicensingType(IssueState, $scope.Keyword, 0, 0).then(function (items) {
            $scope.LicensingTypes = items.data.ListData;
            typeOfConstructionService.getLicensingTypeSetting(item.Id, LicensingTypeId, 0, 0).then(function (items) {
                $scope.LicenseTypeSetting = items.data.ListData;
                $scope.LicensingTypes.forEach(function (row) {
                    $scope.LicenseTypeSetting.forEach(function (settingrow) {
                        if (settingrow.LicensingTypeId === row.Id && settingrow.TypeOfConstructionId == item.Id) {
                            row.IsSetting = true;
                        }
                    })
                })
            });
        });
    }
    $scope.SaveLicensingTypeSetting = function (typeitem, LicensingTypes) {
        //console.log(LicensingTypes);
        LicensingTypes.forEach(function (row) {
            if (row.IsSetting === true) {
                $scope.LicensingTypeSettingItem.TypeOfConstructionId = typeitem.Id;
                $scope.LicensingTypeSettingItem.TypeOfConstructionName = typeitem.TypeName;
                $scope.LicensingTypeSettingItem.LicensingTypeId = row.Id;
                $scope.LicensingTypeSettingItem.IssueState = row.IssueState;
                $scope.LicensingTypeSettingItem.LicensingTypeName = row.Name;
                typeOfConstructionService.SaveLicensingTypeSetting($scope.LicensingTypeSettingItem).then(function (msg) {
                    GetLicensingType();
                })
            }
        })
    }
    function GetLicenseFile() {
        typeOfConstructionService.getLicenseFile(LicensingTypeId, '', 0, 0).then(function (items) {
            $scope.LicenseFiles = items.data.ListData;
            typeOfConstructionService.getLicenseFileSetting(TypeOfConstructionId, LicensingTypeId, LicenseFileId, '', 0, 0).then(function (items) {
                $scope.LicenseFileSetting = items.data.ListData;
                $scope.LicenseFiles.forEach(function (row) {
                    $scope.LicenseFileSetting.forEach(function (settingrow) {
                        if (settingrow.LicenseFileId === row.Id) {
                            row.IsAttach = true;
                            row.FileTemplate = settingrow.FileTemplate;
                        }
                    })
                })
            });
        });
    }
    $scope.SaveFileSetting = function (typeId, LicensingTypeId, FilesItems) {
        FilesItems.forEach(function (row) {
            if (row.IsAttach === true) {
                $scope.LicenseFileSettingItem.TypeOfConstructionId = typeId;
                $scope.LicenseFileSettingItem.LicensingTypeId = LicensingTypeId;
                $scope.LicenseFileSettingItem.LicenseFileId = row.Id;
                $scope.LicenseFileSettingItem.FileTemplate = row.FileTemplate;
                $scope.LicenseFileSettingItem.TemplateName = row.FileName;
                typeOfConstructionService.SaveFileSetting($scope.LicenseFileSettingItem).then(function (msg) {
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
                    typeOfConstructionService.uploadFile($scope.item).then(function (msg) {
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