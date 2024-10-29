app.controller('myCntrl', function ($scope, myService, toastr) {
    var BasinCode = 0, RiverCode = 0, ConstructionId = 0, DistrictCode = 0, CommuneCode = 0, StationTypeId = 0; Status = true;
    $scope.Keyword = '', $scope.currentPage = 1, $scope.numPerPage = 20, $scope.item = {};

    var StationTypeId = 0, asideId = 'aside';

    init();
    function init() {
        let pathName = location.pathname.split('/');
        switch (pathName[2]) {
            case 'quoc-gia':
                if (pathName[3] == 'mua')
                    StationTypeId = 3;
                else if (pathName[3] == 'thuy-van')
                    StationTypeId = 4;
                else if (pathName[3] == 'khi-tuong')
                    StationTypeId = 24;
                break;
            case 'chuyen-dung':
                switch (pathName[3]) {
                    case 'san-bay': StationTypeId = 14; break;
                    case 'thuy-dien': StationTypeId = 9; break;
                    case 'thuy-loi': StationTypeId = 10; break;
                    case 'cau': StationTypeId = 21; break;
                    case 'thu-phat-song': StationTypeId = 22; break;
                    case 'cap-treo': StationTypeId = 11; break;
                    case 'cang-thuy-noi-dia': StationTypeId = 13; break;
                    case 'duong-cao-toc': StationTypeId = 20; break;
                    case 'khi-tuong': StationTypeId = 6; break;
                    case 'thuy-van': StationTypeId = 7; break;
                    case 'mua': StationTypeId = 8; break;
                }
                break;
            case 'ho-so-tram-bdkh': StationTypeId = 23; break;
        }
        if(location.pathname === '/ho-so-tram-bdkh')
            StationTypeId = 23;
        getDataStation();
    }
    function getDataStation() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllStation(0, 0, StationTypeId, Status, $scope.Keyword, 0, 0, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataStation = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        });

        myService.getAllStation(0, 0, StationTypeId, Status, '', 0, 0, 0, 0).then(function (items) {
            $scope.AllStation = items.data.ListData;
        });
    }

    $scope.SetKeyword = function (keyword) {
        $scope.Keyword = keyword;
    }

    $scope.Search = function () {
        getDataStation();
    }
    $scope.Add = function () {
        $scope.item = {};
        $scope.item.StationTypeId = StationTypeId;
        $scope.Action = "Add";
        $scope.HeaderAction = "THÊM MỚI";
        openAside();
    }

    $scope.Edit = function (item) {
        $scope.item = {};
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        myService.getSingleStation(item.Id).then(item => $scope.item = item.data);
        openAside();
    }

    $scope.Save = function () {
        if ($scope.item.Name == null || $scope.item.Name == undefined || $scope.item.StationCode == null || $scope.item.StationCode == undefined || $scope.item.StationTypeId == null || $scope.item.StationTypeId == undefined) {
            toastr.warning("Vui lòng nhập đầy đủ thông tin", "Cảnh báo")
            return;
        }
        var files1 = document.getElementById('fileAttachsHSHD').files;
        var files2 = document.getElementById('fileAttachsHSTL').files;

        var myfileAttach1 = files1;
        var myfileAttach2 = files2;

        var data = new FormData();
        if (files1 !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files1.length > 0) {
                for (var i = 0; i < files1.length; i++) {
                    let str = files1[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("HoSoHD", files1[i]);
                    }
                    else {
                        document.getElementById('fileAttachsHSHD').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }
        if (files2 !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files2.length > 0) {
                for (var i = 0; i < files2.length; i++) {
                    let str = files2[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("HoSoTL", files2[i]);
                    }
                    else {
                        document.getElementById('fileAttachsHSTL').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }

        if (myfileAttach1 !== undefined || myfileAttach2 !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach1.length > 0 || myfileAttach2.length > 0) {
                if ($scope.Action === "Update") {
                    myService.DeleteFileStation($scope.item.HoSoThanhLap, $scope.item.HoSoHoatDong, $scope.item.StationCode); // xoa file cu khi update file moi
                }
                myService.SaveStation($scope.item).then(function (msg) {
                    var docId = msg.data.Id;
                    $.ajax({
                        type: "POST",
                        url: "/api/Station/upload?Id=" + docId + "&FolderName=" + $scope.item.StationCode,
                        contentType: false,
                        processData: false,
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            toastr.success("Lưu thành công", "Thành công");
                            getDataStation();
                        },
                        error: function (data) {
                            toastr.error("Lỗi khi tải file", "Lỗi");
                        }
                    });
                }, function () {
                    toastr.error("Lỗi khi Lưu", "Lỗi");
                });
                document.getElementById('fileAttachsHSHD').value = null;
                document.getElementById('fileAttachsHSHD').value = null;
            }
            if (myfileAttach1.length === 0 || myfileAttach2.length === 0) {
                if ($scope.Action === "Update") {
                    myService.SaveStation($scope.item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        getDataStation();
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        closeAside();
    }

    $scope.Delete = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            if ((item.HoSoThanhLap == null || item.HoSoThanhLap == '') && (item.HoSoHoatDong == null || item.HoSoHoatDong == '')) {
                myService.DeleteStation(item).then(function (msg) {
                    toastr.success('Xóa thành công', 'Thành công');
                    getDataStation();
                }, function () {
                    toastr.error('Có lỗi khi xóa', 'Lỗi');
                });
                return;
            }
            myService.DeleteFileStation(item.HoSoThanhLap, item.HoSoHoatDong, item.StationCode).then(function (msg) {
                if (msg) {
                    myService.DeleteStation(item).then(function (msg) {
                        toastr.success('Xóa thành công', 'Thành công');
                        getDataStation();
                    }, function () {
                        toastr.error('Có lỗi khi xóa', 'Lỗi');
                    });
                }
                else {
                    toastr.error('Có lỗi khi xóa', 'Lỗi');
                }
            });
        }
    }

    $scope.closeAside = function () {
        closeAside();
    }

    function openAside() {
        document.getElementById(asideId).classList.add('sidenav-open-w75');
    }
    function closeAside() {
        document.getElementById(asideId).classList.remove('sidenav-open-w75');
    }
    $scope.openAsideFile = function (folder, filePDF) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/HoSoCacTram/' + folder + '/' + filePDF;
    }
    $scope.closeAsideFile = function () {
        closeAsideFile();
    }

    function openAsideFile() {
        document.getElementById("sideViewFile").classList.add('sideViewFile');
    }

    function closeAsideFile() {
        document.getElementById("sideViewFile").classList.remove('sideViewFile');
    }
    // hết Lấy file pdf
});