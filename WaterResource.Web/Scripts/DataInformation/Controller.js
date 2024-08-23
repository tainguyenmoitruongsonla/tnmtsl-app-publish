app.controller("myCntrl", function ($scope, datainfoService, basinService, toastr, $window) {
    'use strict'
    $scope.getDatetime = new Date();
    $scope.DataYear = [];
    var d = new Date;
    $scope.StartYear = (d.getFullYear() - 9);
    $scope.EndYear = d.getFullYear();
    for (let i = 1975; i <= d.getFullYear(); i++) {
        $scope.DataYear.push(i);
    }
    $scope.TotalItem = 0, $scope.myitem = {};

    var Status = true,
        isDetail = false,
        TypeOfConstructionId = 0,
        CityCode = '',
        DistrictCode = '';
    $scope.Keyword = '', $scope.currentPage = 1, $scope.numPerPage = 12;

    //datepicker
    datePicker()
    function datePicker() {
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            formatDayTitle: 'MM - yyyy',
            maxDate: false,
            minDate: false,
            showWeeks: false,
            startingDay: 1,
        };

        $scope.openDatepicker = function (id) {
            var idDatePicker = id;
            $scope[idDatePicker] = {
                opened: false
            };
            $scope[idDatePicker].opened = true;
        };

        $scope.format = 'dd/MM/yyyy';

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    }

    //Mo form them moi
    $scope.Add = function (asideId) {
        ClearFields();
        $scope.Action = "Add";
        $scope.HeaderAction = "THÊM MỚI";
        $scope.divFrm = true;
        openAside(asideId);
    }

    $scope.SetKeyword = function (keyword) {
        $scope.Keyword = keyword;
    }

    // Lay du lieu thong tin khao sát địa chất
    function getDataThongTinKhaoSatDiaChat() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getDataThongTinKhaoSatDiaChat(0, $scope.Keyword, true, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataThongTinKhaoSatDiaChat = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });

            datainfoService.getDataThongTinKhaoSatDiaChat(0, '', true, 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }
    // Tìm kiếm
    $scope.SearchThongTinKhaoSatDiaChat = function () {
        getDataThongTinKhaoSatDiaChat();
    }
    // chức năng chỉnh sửa
    $scope.EditThongTinKhaoSatDiaChat = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        openAside(asideId)
    }
    // chức năng ghi dữ liệu
    $scope.SaveDataThongTinKhaoSatDiaChat = function () {
        var getAction = $scope.Action;
        datainfoService.SaveDataThongTinKhaoSatDiaChat($scope.item).then(function (msg) {
            toastr.success('Lưu thành công', 'Thành công');
            getDataThongTinKhaoSatDiaChat();
            closeAside(asideId)
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
        closeAllAside();
    }
    // chức năng xóa
    $scope.DeleteDataThongTinKhaoSatDiaChat = function (item) {
        if (confirm('Item will be deleted?')) {
            datainfoService.DeleteDataThongTinKhaoSatDiaChat(item).then(function (msg) {
                getDataThongTinKhaoSatDiaChat();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }

    // Lay du lieu thong tin tiềm năng nước ngầm
    function getDataThongTinDanhGiaTiemNangNuoc() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getDataThongTinDanhGiaTiemNangNuoc($scope.Keyword, true, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataThongTinDanhGiaTiemNangNuoc = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
            datainfoService.getDataThongTinDanhGiaTiemNangNuoc('', true, 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    $scope.SearchThongTinDanhGiaTiemNangNuoc = function () {
        getDataThongTinDanhGiaTiemNangNuoc();
    }
    // chức năng chỉnh sửa
    $scope.EditThongTinDanhGiaTiemNangNuoc = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        openAside(asideId)
    }
    // chức năng ghi dữ liệu
    $scope.SaveDataThongTinDanhGiaTiemNangNuoc = function () {
        var getAction = $scope.Action;
        datainfoService.SaveDataThongTinDanhGiaTiemNangNuoc($scope.item).then(function (msg) {
            toastr.success('Lưu thành công', 'Thành công');
            getDataThongTinDanhGiaTiemNangNuoc();
            closeAllAside();
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
    }
    // chức năng xóa
    $scope.DeleteDataThongTinDanhGiaTiemNangNuoc = function (item) {
        if (confirm('Item will be deleted?')) {
            datainfoService.DeleteDataThongTinDanhGiaTiemNangNuoc(item).then(function (msg) {
                getDataThongTinDanhGiaTiemNangNuoc();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }

    // Lay du lieu thong tin ho so tram quan trac nuoc mat
    function getDataThongTinDuLieuHoSoTram(LoaiHoSoTram) {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getDataThongTinDuLieuHoSoTram(LoaiHoSoTram, true, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.getDataThongTinDuLieuHoSoTram = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
            datainfoService.getDataThongTinDuLieuHoSoTram(LoaiHoSoTram, true, '', 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    $scope.SearchThongTinDuLieuHoSoTram = function (typeid) {
        getDataThongTinDuLieuHoSoTram(typeid);
    }
    $scope.EditThongTinDuLieuHoSoTram = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        openAside(asideId);
    }

    $scope.SaveThongTinDuLieuHoSoTram = function (asideCloseId, typeId) {
        var files = document.getElementById('fileAttachs').files;
        var myfileAttach = files;

        var data = new FormData();
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("UploadedFile", files[i]);
                    }
                    else {
                        $scope.item.FilePDF = undefined;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }
        $scope.item.LoaiHoSoTram = typeId
        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                for (var i = 0; i < myfileAttach.length; i++) {
                    (function (file) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (f) {
                            $scope.item.TypeId = 2;
                            if ($scope.Action === "Update") {
                                datainfoService.DeleteFileThongTinDuLieuHoSoTram($scope.item.FilePDF); // xoa file cu khi update file moi
                            }
                            datainfoService.SaveThongTinDuLieuHoSoTram($scope.item).then(function (msg) {
                                var docId = msg.data.Id;
                                $.ajax({
                                    type: "POST",
                                    url: "/api/ThongTinDuLieuHoSoTram/upload?Id=" + docId,
                                    contentType: false,
                                    processData: false,
                                    dataType: 'JSON',
                                    data: data,
                                    success: function (data) {
                                        toastr.success("Lưu thành công", "Thành công");
                                        getDataThongTinDuLieuHoSoTram(typeId);
                                    },
                                    error: function (data) {
                                        toastr.error("Lỗi khi tải file", "Lỗi");
                                    }
                                });
                            }, function () {
                                toastr.error("Lỗi khi Lưu", "Lỗi");
                            });
                            document.getElementById('fileAttachs').value = null;
                        };
                        fileReader.readAsDataURL(file);
                    })(myfileAttach[i]);
                }
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Cảnh báo");
                    return;
                }
                if ($scope.Action === "Update") {
                    datainfoService.SaveThongTinDuLieuHoSoTram($scope.item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        getDataThongTinDuLieuHoSoTram(typeId);
                        document.getElementById('fileAttachs').value = null;
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        closeAside(asideCloseId);
    }

    $scope.DeleteThongTinDuLieuHoSoTram = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            datainfoService.DeleteFileThongTinDuLieuHoSoTram(item.FilePDF, 'DiaPhuong').then(function (msg) {
                if (msg) {
                    datainfoService.DeleteThongTinDuLieuHoSoTram(item).then(function (msg) {
                        toastr.success('Xóa thành công', 'Thành công');
                        getDataThongTinDuLieuHoSoTram(typeId);
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

    // Lay du lieu thong tin danh muc song noi tin
    function getDataDanhMucSongNoiTinh() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getDataDanhMucSongNoiTinh(true, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.getDataDanhMucSongNoiTinh = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
            datainfoService.getDataDanhMucSongNoiTinh(true, '', 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    $scope.SearchDanhMucSongNoiTinh = function () {
        getDataDanhMucSongNoiTinh();
    }

    $scope.EditDanhMucSongNoiTinh = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        openAside(asideId);
    }

    $scope.SaveDanhMucSongNoiTinh = function (asideId) {
        var getAction = $scope.Action;
        datainfoService.SaveDanhMucSongNoiTinh($scope.item).then(function (msg) {
            if (getAction === "Update")
                toastr.success('Cập nhập thành công', 'Thành công');
            else
                toastr.success('Lưu thành công', 'Thành công');
            getDataDanhMucSongNoiTinh();
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Lỗi');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Lỗi');
            }
        });
        closeAside(asideId);
    }

    $scope.DeleteDanhMucSongNoiTinh = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            datainfoService.DeleteDanhMucSongNoiTinh(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
                getDataDanhMucSongNoiTinh();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
        }
    }

    // Lay du lieu thong tin danh muc ao ho
    function getDataDanhMucAoHo() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getDataDanhMucAoHo(true, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.getDataDanhMucAoHo = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
            datainfoService.getDataDanhMucAoHo(true, '', 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    $scope.SearchDanhMucAoHo = function () {
        getDataDanhMucAoHo();
    }

    $scope.EditDanhMucAoHo = function (asideId, item) {
        $scope.item = ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        openAside(asideId);
    }

    $scope.SaveDanhMucAoHo = function (asideID) {
        var getAction = $scope.Action;
        datainfoService.SaveDanhMucAoHo($scope.item).then(function (msg) {
            if (getAction === "Update")
                toastr.success('Cập nhập thành công', 'Thành công');
            else
                toastr.success('Lưu thành công', 'Thành công');
            getDataDanhMucAoHo();
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Lỗi');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Lỗi');
            }
        });

        closeAside(asideID);
    }

    $scope.DeleteDanhMucAoHo = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            datainfoService.DeleteDanhMucAoHo(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
                getDataDanhMucAoHo();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
        }
    }

    GetProvince();
    function GetProvince() {

        datainfoService.getAllProvince($scope.Keyword, 0, 0).then(function (items) {
            $scope.Provinces = items.data.ListData;
        });
    }
    function GetDistricts(CityId) {
        datainfoService.getDistrict(CityId, CityCode, '', 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetCommune(DistrictId) {
        datainfoService.getCommunes(DistrictId, CityCode, DistrictCode, '', 0, 0).then(function (items) {
            $scope.Communes = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.ProvinceChange = function (CityId) {
        if (CityId !== null) {
            GetDistricts(1);
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

    init();
    function init() {
        AllLicense();
        GetBasins();
        WaterResourcesData();
        $scope.Keyword = '';
        $scope.currentPage = 1;

        let pathName = location.pathname.split('/');

        switch (pathName[2]) {
            case 'van-ban-quy-pham-phap-luat': getDataDocument(); break;
            case 'so-lieu-dieu-tra':
                if (pathName[3] === 'nuoc-duoi-dat') {
                    if (pathName[4] === 'khao-sat-dia-chat') {
                        getDataThongTinKhaoSatDiaChat();
                    }
                    else if (pathName[4] === 'tiem-nang-nuoc-ngam') {
                        getDataThongTinDanhGiaTiemNangNuoc();
                    }
                }
                else if (pathName[3] === 'nuoc-mat')
                    getSurveyfiguresSurfacewater();
                else if (pathName[3] === 'xa-thai')
                    getSurveyfiguresDischargewater();
                break;
            case 'ho-so-ky-thuat':
                if (pathName[3] == 'nuoc-mat') {
                    getDataThongTinDuLieuHoSoTram(1);
                }
                else if (pathName[3] === 'nuoc-duoi-dat') {
                    getDataThongTinDuLieuHoSoTram(2);
                }
                break;
            case 'danh-muc-song-suoi':
                if (pathName[3] === 'noi-tinh') {
                    getDataDanhMucSongNoiTinh();
                }
                else if (pathName[3] === 'ao-ho') {
                    getDataDanhMucAoHo();
                }
                break;
        }
    }

    $scope.EditDocument = function (item, asideId) {
        $scope.item = {};
        $scope.Action = "Update";
        $scope.divFrm = true;
        datainfoService.getSingleDocument(item.Id).then(function (doc) {
            $scope.item = doc.data;
            
            if (doc.data.IssuedDate != null && doc.data, IssuedDate != undefined)
                $scope.item.IssuedDate = new Date(doc.data.IssuedDate);
            if (doc.data.EffectDate != null && doc.data, EffectDate != undefined)
                $scope.item.EffectDate = new Date(doc.data.EffectDate);
        });
        openAside(asideId);
    }

    function getDataDocument() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getDocument(2, true, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataDocument = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
            datainfoService.getDocument(2, true, '', 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    function getFolderVanBanQuyPhamPhapLuat(typeid) {
        switch (typeid) {
            case 1: return "TrungUong";
            case 2: return "DiaPhuong";
            default: return "";
        }
    }

    $scope.SearchDocument = function () {
        getDataDocument();
    }

    $scope.SaveDocument = function (asideCloseId) {
        var files = document.getElementById('fileAttachs').files;
        var myfileAttach = files;

        var data = new FormData();
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("UploadedFile", files[i]);
                    }
                    else {
                        $scope.item.FilePDF = undefined;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }

        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                for (var i = 0; i < myfileAttach.length; i++) {
                    (function (file) {
                        var fileReader = new FileReader();
                        fileReader.onload = function (f) {
                            $scope.item.TypeId = 2;
                            if ($scope.Action === "Update") {
                                datainfoService.DeleteFileDocument($scope.item.FilePDF, 'DiaPhuong'); // xoa file cu khi update file moi
                            }
                            datainfoService.SaveDocument($scope.item).then(function (msg) {
                                var docId = msg.data.Id;
                                $.ajax({
                                    type: "POST",
                                    url: "/api/Document/upload?Id=" + docId + "&FolderName=DiaPhuong",
                                    contentType: false,
                                    processData: false,
                                    dataType: 'JSON',
                                    data: data,
                                    success: function (data) {
                                        toastr.success("Lưu thành công", "Thành công");
                                        getDataDocument();
                                    },
                                    error: function (data) {
                                        toastr.error("Lỗi khi tải file", "Lỗi");
                                    }
                                });
                            }, function () {
                                toastr.error("Lỗi khi Lưu", "Lỗi");
                            });
                            document.getElementById('fileAttachs').value = null;
                        };
                        fileReader.readAsDataURL(file);
                    })(myfileAttach[i]);
                }
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Cảnh báo");
                    return;
                }
                if ($scope.Action === "Update") {
                    datainfoService.SaveDocument($scope.item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        getDataDocument();
                        document.getElementById('fileAttachs').value = null;
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        closeAside(asideCloseId);
    }

    $scope.DeleteDocument = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            datainfoService.DeleteFileDocument(item.FilePDF, 'DiaPhuong').then(function (msg) {
                if (msg) {
                    datainfoService.DeleteDocument(item).then(function (msg) {
                        toastr.success('Xóa thành công', 'Thành công');
                        getDataDocument();
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

    //SurveyfiguresSurfacewater start
    function getSurveyfiguresSurfacewater() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getSurveyfiguresSurfacewater($scope.Keyword, true, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataSurveyfiguresSurfacewater = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });

            datainfoService.getSurveyfiguresSurfacewater('', true, 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    $scope.SearchSurveyfiguresSurfacewater = function () {
        getSurveyfiguresSurfacewater();
    }

    $scope.EditSurveyfiguresSurfacewater = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        datainfoService.getSingleSurveyfiguresSurfacewater(item.Id).then(item => $scope.item = item.data)
        openAside(asideId)
    }

    $scope.SaveSurveyfiguresSurfacewater = function () {
        var getAction = $scope.Action;
        datainfoService.SaveSurveyfiguresSurfacewater($scope.item).then(function (msg) {
            toastr.success('Lưu thành công', 'Thành công');
            getSurveyfiguresSurfacewater();
            closeAside(asideId)
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
        closeAllAside();
    }

    $scope.DeleteSurveyfiguresSurfacewater = function (item) {
        if (confirm('Item will be deleted?')) {
            datainfoService.DeleteSurveyfiguresSurfacewater(item).then(function (msg) {
                getSurveyfiguresSurfacewater();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    //SurveyfiguresSurfacewater end

    //SurveyfiguresDischargewater start
    function getSurveyfiguresDischargewater() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getSurveyfiguresDischargewater($scope.Keyword, true, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataSurveyfiguresDischargewater = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });

            datainfoService.getSurveyfiguresDischargewater('', true, 0, 0).then(function (items) {
                $scope.ItemsForSearch = items.data.ListData;
            });
        });
    }

    $scope.SearchSurveyfiguresDischargewater = function () {
        getSurveyfiguresDischargewater();
    }

    $scope.EditSurveyfiguresDischargewater = function (asideId, item) {
        ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        datainfoService.getSingleSurveyfiguresDischargewater(item.Id).then(item => $scope.item = item.data)
        openAside(asideId)
    }

    $scope.SaveSurveyfiguresDischargewater = function () {
        var getAction = $scope.Action;
        datainfoService.SaveSurveyfiguresDischargewater($scope.item).then(function (msg) {
            toastr.success('Lưu thành công', 'Thành công');
            getSurveyfiguresDischargewater();
            closeAside(asideId)
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
        closeAllAside();
    }

    $scope.DeleteSurveyfiguresDischargewater = function (item) {
        if (confirm('Item will be deleted?')) {
            datainfoService.DeleteSurveyfiguresDischargewater(item).then(function (msg) {
                getSurveyfiguresDischargewater();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    //SurveyfiguresDischargewater end

    $scope.closeModal = function () {
        $scope.myitem = {
            LicenseId: null,
            TypeOfConstructionId: null,
        };
    }

    $scope.openAsideV2 = function (asideV2Id, asideV1Id) {
        openAside(asideV2Id);
        closeAside(asideV1Id);
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }
    $scope.closeAsideV2 = function (asideV2Id, asideV1Id) {
        closeAside(asideV2Id);
        openAside(asideV1Id);
    }

    // Lấy file pdf
    $scope.openAsideFileLicense = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/Licenses/' + GetFolderLicense(item.ParentConstructionId) + '/' + item.LicenseFile;
    }

    $scope.openAsideFileConstruction = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/Licenses/' + item.ParentConstructionTypeSlug + '/' + item.LicenseFile;
    }

    $scope.openAsideInspection = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/ThanhTra/' + getFolderThanhTraKiemTra(TypeOfConstructionId) + '/' + item.FilePDF;
    }

    $scope.openAsideFileStation = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/StationFile/' + item.FilePDF;
    }

    // Lấy file tien cap quyen pdf
    $scope.openLicenseFeeFile = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/LicenseFee/' + item.LicenseFee[0].File;
    }

    $scope.openDocumentFile = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/VanBanQuyPhamPhapLuat/DiaPhuong/' + item.FilePDF;
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

    function closeAllAside() {
        closeAsideFile();
        let sidenavs = document.getElementsByClassName('sidenav-open-w50');
        for (let sidenav of sidenavs) {
            sidenav.classList.remove('sidenav-open-w50');
        }
    }

    function openAside(asideId) {
        closeAllAside();
        document.getElementById(asideId).classList.add('sidenav-open-w50');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-w50');
    }

    function ClearFields() {
        $scope.item = {};
    }

    function checkNum(data) {
        if (data != null || data != undefined) {
            return parseInt(data);
        } else {
            return 0;
        }
    }

    function AllLicense() {
        datainfoService.getAllLicense(0, 0, 0, 0, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, 0, 0, -1, 0, -1, false, true, $scope.Keyword, 1, 0).then(function (items) {
            $scope.AllLicenses = items.data.ListData;
        })
    }

    function GetBasins() {
        $scope.$watch('currentPage + numPerPage', function () {
            basinService.getAllBasins(Status, $scope.Keyword, isDetail, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Basins = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function GetFolderLicense(ParentConstructionId) {
        switch (ParentConstructionId) {
            case 1: return 'NuocMat';
            case 2: return 'NuocDuoiDat';
            case 3: return 'XaThai';
            default: return '';
        }
    }

    // Filter construction by name keyword
    $scope.filterCons = function () {
        $scope.currentPage = 1;

        AllLicense();
    }

    // Thong tin tieu vung tnn
    WaterResourcesData();
    function WaterResourcesData() {
        $scope.$watch('currentPage + numPerPage', function () {
            datainfoService.getWaterResourcesData(Status, $scope.Keyword, isDetail, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.WaterResourcesData = items.data.ListData;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
        
    }

    $scope.EditWaterResourcesData = function (asideId, item) {
        $scope.item = ClearFields();
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        openAside(asideId);
    }

    $scope.SaveWaterResourcesData = function (asideID) {
        var getAction = $scope.Action;
        datainfoService.SaveWaterResourcesData($scope.item).then(function (msg) {
            if (getAction === "Update")
                toastr.success('Cập nhập thành công', 'Thành công');
            else
                toastr.success('Lưu thành công', 'Thành công');
            WaterResourcesData();
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Lỗi');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Lỗi');
            }
        });

        closeAside(asideID);
    }

    $scope.DeleteWaterResourcesData = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            datainfoService.DeleteWaterResourcesData(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
                WaterResourcesData();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
        }
    }
});