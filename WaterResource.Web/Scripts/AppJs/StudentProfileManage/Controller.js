app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();

    var pt = angular.element(document.getElementById("portalval"));
    $scope.divFrm = false;
    //To Get All Records  
    $scope.TotalItem = 0
        , $scope.myitem = {}
        , $scope.pageIndex = 1
        , $scope.pageSize = 10
        , $scope.maxSize = 10
        , $scope.Keyword = ''
        , $scope.AllStudents = [];
    $scope.CollectionDoc = [
        { Id: 1, Name: '1. Giấy khai sinh', Notation: 'GKS', FileName: '', ViewFileBrowser: true },
        { Id: 2, Name: '2. Chứng mình thư nhân dân/Căn cước công dân', Notation: '', FileName: '', ViewFileBrowser: false },
        { Id: 3, Name: '2.1 Mặt trước', Notation: 'CMT_Front', FileName: '', ViewFileBrowser: true },
        { Id: 4, Name: '2.2 Mặt sau', Notation: 'CMT_Back', FileName: '', ViewFileBrowser: true },
        { Id: 5, Name: '3. Ảnh màu 4x6cm', Notation: 'Anh4x6', FileName: '', ViewFileBrowser: true },
        { Id: 6, Name: '4. Học bạ THPT (bản chính)', Notation: '', FileName: '', ViewFileBrowser: false },
        { Id: 7, Name: '4.1 Trang đầu tiên có đóng dấu giáp lai vào ảnh', Notation: 'HocBa01', FileName: '', ViewFileBrowser: true },
        { Id: 8, Name: '4.2 Trang kết quả học tập lớp 10', Notation: 'Hocbalop10', FileName: '', ViewFileBrowser: true },
        { Id: 9, Name: '4.3 Trang kết quả học tập lớp 11', Notation: 'Hocbalop11', FileName: '', ViewFileBrowser: true },
        { Id: 10, Name: '4.4 Trang kết quả học tập lớp 12', Notation: 'Hocbalop12', FileName: '', ViewFileBrowser: true },
        { Id: 11, Name: '5 Bản gốc bằng tốt nghiệp THPT (nếu đã có)', Notation: '', FileName: '', ViewFileBrowser: false },
        { Id: 12, Name: '5.1 Mặt trước', Notation: 'BangTN_Front', FileName: '', ViewFileBrowser: true },
        { Id: 13, Name: '5.2 Mặt sau', Notation: 'BangTN_Back', FileName: '', ViewFileBrowser: true },
    ]
    $scope.Years = [];
    var ThisYear = document.getElementById("tbxYear").value;
    for (var y = ThisYear; y >= 2019; y--) {

        var item = { Id: y.toString(), Name: 'Năm ' + y.toString() };
        $scope.Years.push(item);
    }
    $scope.AdmissionYear = 0;
    $scope.ProvinceId = 0;
    $scope.DistrictId = 0;
    $scope.CommuneId = 0;
    var CityCode = '';
    var DistrictCode = '';

    GetProvince();
    GetData();
    
    function GetData() {
        $scope.$watch('pageIndex + pageSize', function () {
            console.log($scope.pageIndex, $scope.pageSize);
            myService.getAllShortProfile($scope.AdmissionYear, $scope.ProvinceId, $scope.DistrictId, $scope.CommuneId, $scope.Keyword, $scope.pageIndex, $scope.pageSize).then(function (items) {
                $scope.AllStudents = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function GetProvince() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllProvince($scope.Keyword, 0, 0).then(function (items) {
                $scope.Provinces = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetDistricts(CityId) {
        myService.getDistrict(CityId, CityCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetCommune(DistrictId) {
        myService.getCommunes(DistrictId, CityCode, DistrictCode, $scope.Keyword,0,0).then(function (items) {
            $scope.Communes = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetWebGisByCode(StudentCode) {
        myService.getWebGisByCode(StudentCode).then(function (item) {
            $scope.myprofile = item.data;
            GetWebGisFile(StudentCode, '', 0, 0);
        })
        
    }
    function GetWebGisFile(StudentCode, Notation, PageIndex, PageSize) {
        console.log(StudentCode);
        myService.getWebGisFiles(StudentCode, Notation, PageIndex, PageSize).then(function (items) {
            $scope.studentfiles = items.data.ListData;
            console.log($scope.studentfiles);
            if ($scope.studentfiles !== undefined) {
                $scope.studentfiles.forEach(function (row) {
                    $scope.CollectionDoc.forEach(function (docRow) {
                        if (docRow.Notation === row.Notation) {
                            docRow.FileName = row.FileName;
                        }
                    })
                })
            }
        })
    }
    $scope.Search = function () {
        GetData($scope.AdmissionYear, $scope.ProvinceId, $scope.DistrictId, $scope.CommuneId);
    }
    $scope.ViewImage = function (myprofile, f) {
        $scope.fileview = {};
        myService.getWebGisFileByCode(myprofile.student_code, f.Notation).then(function (items) {
            $scope.fileview = items.data;
            console.log($scope.fileview);
            if ($scope.fileview.FileUrl === null) {
                $scope.fileview.IsView = false;
            }
            console.log($scope.fileview);
        })
    }
    var angle = 0;
    $scope.RotateImage = function (item) {
        var img = document.getElementById(item);
        angle = (angle + 90) % 360;
        img.className = "rotate" + angle;
    }
    $scope.CloseImage = function (item) {
        var img = document.getElementById(item);
        img.className = "";
    }
    $scope.drlYearChange = function (AdmissionYear) {
        console.log(AdmissionYear);
        if (AdmissionYear !== null) {
            $scope.AdmissionYear = AdmissionYear;
        }
        else
        {
            $scope.AdmissionYear = 0;
        }
        GetData($scope.AdmissionYear, $scope.ProvinceId, $scope.DistrictId, $scope.CommuneId)
    }
    $scope.drlCityChange = function (ProvinceId) {
        console.log(ProvinceId);
        if (ProvinceId !== null) {
            $scope.ProvinceId = ProvinceId;
            GetDistricts(ProvinceId);
        }
        else {
            $scope.Districts = [];
            $scope.Communes = [];
            $scope.ProvinceId = 0;
        }
        GetData($scope.AdmissionYear, $scope.ProvinceId, $scope.DistrictId, $scope.CommuneId);
    }
    $scope.drlDistrictChange = function (DistrictId) {
        if (DistrictId !== null) {
            $scope.DistrictId = DistrictId;
            GetCommune(DistrictId)
            
        }
        else {
            $scope.Communes = [];
            $scope.DistrictId = 0;
        }
        GetData($scope.AdmissionYear, $scope.ProvinceId, $scope.DistrictId, $scope.CommuneId)
    }
    $scope.drlCommuneChange = function (CommuneId) {
        $scope.CommuneId = 0;
        if (CommuneId !== null) {
            $scope.CommuneId = CommuneId;
        }
        GetData($scope.AdmissionYear, $scope.ProvinceId, $scope.DistrictId, $scope.CommuneId)
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

    $scope.openAdmissionNav = function (navId, item) {
        console.log(item);
        GetWebGisByCode(item.student_code);
        
        openAside(navId);
    }
    $scope.openHomeNav = function (navId, item) {
        console.log(item);
        openAside(navId);
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }

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