app.controller('myCtrl', function ($scope, myService, toastr) {
    'use strict'
    $scope.getDatetime = new Date();

    var Status = true,
        TypeId = 0,
        tuNgay = NaN,
        denNgay = NaN,
        asideId = 'aside';

        $scope.Keyword = '',
        $scope.CoQuanBanHanh = '',
        $scope.DenNgay = '', $scope.TuNgay = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 20;

    //datepicker
    datePicker()
    function datePicker() {
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: false,
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: false,
            minDate: false,
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

    init()

    function init() {
        let pathName = location.pathname.split('/');
        if (pathName[2] == 'thong-bao') {
            getNotification();
            return;
        }
        if (pathName[1] == 'van-ban-phap-luat') {
            if (pathName[2] == 'kttv') TypeId = 24;
            else if (pathName[2] == 'bdkh') TypeId = 25;
        }
        else {
            switch (pathName[2] + '/' + pathName[3]) {
                case 'thoi-tiet/han-cuc-ngan': TypeId = 1; break;
                case 'thoi-tiet/han-ngan': TypeId = 2; break;
                case 'thoi-tiet/han-vua': TypeId = 3; break;
                case 'khi-hau/han-dai': TypeId = 4; break;
                case 'khi-hau/han-mua': TypeId = 5; break;
                case 'khi-hau/han-nam': TypeId = 6; break;
                case 'thuy-van/han-cuc-ngan': TypeId = 7; break;
                case 'thuy-van/han-ngan': TypeId = 8; break;
                case 'thuy-van/han-vua': TypeId = 9; break;
                case 'thuy-van/han-dai': TypeId = 10; break;
                case 'thuy-van/han-mua': TypeId = 11; break;
                case 'nguon-nuoc/han-ngan': TypeId = 12; break;
                case 'nguon-nuoc/han-vua': TypeId = 13; break;
                case 'nguon-nuoc/han-dai': TypeId = 14; break;
                case 'nguon-nuoc/han-mua': TypeId = 15; break;
                case 'nguon-nuoc/han-nam': TypeId = 16; break;
                case 'khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep':
                    if (pathName[4] == 'han-ngan')
                        TypeId = 17;
                    else if (pathName[4] == 'han-vua')
                        TypeId = 18;
                    else if (pathName[4] == 'han-dai')
                        TypeId = 19;
                    else if (pathName[4] == 'han-mua')
                        TypeId = 20;
                    break;
                case 'khi-tuong-thuy-van-khac/khong_khi-lanh': TypeId = 21; break;
                case 'khi-tuong-thuy-van-khac/tong-hop': TypeId = 22; break;
                case 'khi-tuong-thuy-van-khac/chuyen-de': TypeId = 23; break;
                case 'thien-tai/bao-ap-thap': TypeId = 26; break;
                case 'thien-tai/mua-lu': TypeId = 27; break;
                case 'thien-tai/giong-loc': TypeId = 28; break;
                case 'thien-tai/ret-suong-muoi': TypeId = 29; break;
            }
        }
        $scope.Keyword = location.search.slice(1);
        GetDataKTTVDoc();
    }
    var Notification = $.connection.Notification;
    Notification.client.Send = function (Status) {
        if (Status == true)
            getNotification();
    };
    function getNotification() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getNotificationKTTV($scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.NotificationKTTV = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.DateTimeConvert = function (dt) {
        let date = new Date(dt)
        let diff = new Date() - date;
        if (diff < 60 * 1000)
            return (diff / 1000).toFixed() + " giây trước";
        else if (diff < 60 * 60 * 1000)
            return (diff / (60 * 1000)).toFixed() + " phút trước";
        else if (diff < 24 * 60 * 60 * 1000)
            return (diff / (60 * 60 * 1000)).toFixed() + " giờ trước";
        else if (diff < 5 * 24 * 60 * 60 * 1000)
            return (diff / (24 * 60 * 60 * 1000)).toFixed() + " ngày trước";

        return addZeroNumber(date.getHours()) + ':' + addZeroNumber(date.getMinutes()) + '    ' + addZeroNumber(date.getDate()) + '/' + addZeroNumber(date.getMonth()) + '/' + date.getFullYear();
    } 
    function addZeroNumber(num) {
        if (num / 10 < 1)
            return '0' + num;
        return num;
    }

    $scope.Link = function (typeId) {
        switch (typeId) {
            case 1: return '/ban-tin-du-bao/thoi-tiet/han-cuc-ngan';
            case 2: return '/ban-tin-du-bao/thoi-tiet/han-ngan';
            case 3: return '/ban-tin-du-bao/thoi-tiet/han-vua';
            case 4: return '/ban-tin-du-bao/khi-hau/han-dai';
            case 5: return '/ban-tin-du-bao/khi-hau/han-mua';
            case 6: return '/ban-tin-du-bao/khi-hau/han-nam';
            case 7: return '/ban-tin-du-bao/thuy-van/han-cuc-ngan';
            case 8: return '/ban-tin-du-bao/thuy-van/han-ngan';
            case 9: return '/ban-tin-du-bao/thuy-van/han-vua';
            case 10: return '/ban-tin-du-bao/thuy-van/han-dai';
            case 11: return '/ban-tin-du-bao/thuy-van/han-mua';
            case 12: return '/ban-tin-du-bao/nguon-nuoc/han-ngan';
            case 13: return '/ban-tin-du-bao/nguon-nuoc/han-vua';
            case 14: return '/ban-tin-du-bao/nguon-nuoc/han-dai';
            case 15: return '/ban-tin-du-bao/nguon-nuoc/han-mua';
            case 16: return '/ban-tin-du-bao/nguon-nuoc/han-nam';
            case 17: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-ngan';
            case 18: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-ngan';
            case 19: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-ngan';
            case 20: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-ngan';
            case 21: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/khong_khi-lanh';
            case 22: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/tong-hop';
            case 23: return '/ban-tin-du-bao/khi-tuong-thuy-van-khac/chuyen-de';
            case 26: return '/ban-tin-du-bao/thien-tai/bao-ap-thap';
            case 27: return '/ban-tin-du-bao/thien-tai/mua-lu';
            case 28: return '/ban-tin-du-bao/thien-tai/giong-loc';
            case 29: return '/ban-tin-du-bao/thien-tai/ret-suong-muoi';
        }
    }

    $scope.Search = function () {
        tuNgay = Date.parse($scope.TuNgay);
        denNgay = Date.parse($scope.DenNgay);
        GetDataKTTVDoc();
    }

    $scope.SetKeyword = function (name) {
        $scope.Keyword = name
    }

    function GetDataKTTVDoc() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getDataKTTVDoc(TypeId, $scope.CoQuanBanHanh, tuNgay, denNgay, $scope.Keyword, Status, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataKTTVDoc = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });

        myService.getDataKTTVDoc(TypeId, '', NaN, NaN,'',true, 0, 0).then(function (items) {
            $scope.DocForSearch = items.data.ListData;
        });
    }

    $scope.closeAside = function () {
        closeAside();
    }

    function closeAllNav() {
        let sidenavs = document.getElementsByClassName('sidenav-open-w50');
        for (let sidenav of sidenavs) {
            sidenav.classList.remove('sidenav-open-w50');
        }
    }

    // Lấy folder loại dự báo

    function GetFolderTypeId(typeid) {
        switch (typeid) {
            case 1: return 'thoi-tiet/han-cuc-ngan';
            case 2: return 'thoi-tiet/han-ngan';
            case 3: return 'thoi-tiet/han-vua';
            case 4: return 'khi-hau/han-dai';
            case 5: return 'khi-hau/han-mua';
            case 6: return 'khi-hau/han-nam';
            case 7: return 'thuy-van/han-cuc-ngan';
            case 8: return 'thuy-van/han-ngan';
            case 9: return 'thuy-van/han-vua';
            case 10: return 'thuy-van/han-dai';
            case 11: return 'thuy-van/han-mua';
            case 12: return 'nguon-nuoc/han-ngan';
            case 13: return 'nguon-nuoc/han-vua';
            case 14: return 'nguon-nuoc/han-dai';
            case 15: return 'nguon-nuoc/han-mua';
            case 16: return 'nguon-nuoc/han-nam';
            case 17: return 'khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-ngan';
            case 18: return 'khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-vua';
            case 19: return 'khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-dai';
            case 20: return 'khi-tuong-thuy-van-khac/phuc-vu-nong-nghiep/han-mua';
            case 21: return 'khi-tuong-thuy-van-khac/khong_khi-lanh';
            case 22: return 'khi-tuong-thuy-van-khac/tong-hop';
            case 23: return 'khi-tuong-thuy-van-khac/chuyen-de';
            case 24: return 'van-ban-phap-luat/kttv';
            case 25: return 'van-ban-phap-luat/bdkh';
            default: return '';
        }
    }

    $scope.Add = function () {
        $scope.item = {};
        $scope.item.IssuedTime = new Date();
        $scope.item.EffectDate = new Date();
        $scope.item.TypeId = TypeId;
        $scope.Action = "Add";
        $scope.HeaderAction = "THÊM MỚI";
        openAside();
    }

    $scope.Edit = function (item) {
        $scope.item = {};
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        myService.getSingle(item.Id).then(item => {
            $scope.item = item.data;
            if ($scope.item.IssuedTime != null)
                $scope.item.IssuedTime = new Date($scope.item.IssuedTime);
            if ($scope.item.EffectDate != null)
                $scope.item.EffectDate = new Date($scope.item.EffectDate);
        });
        openAside();
    }

    $scope.ChangeDateTime = function convertDate() {
        $scope.item.IssuedTime = $('#IssuedTime').val();
    }

    $scope.Save = function () {
        if ($scope.item.Name == null || $scope.item.DocNumber == null) {
            toastr.warning("Vui lòng nhập Tên và Số văn bản");
            return;
        }

        var files = document.getElementById('fileAttachs').files;
        var myfileAttach = files;
        var data = new FormData();
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4) || str.includes("doc", str.length - 4)) {
                        data.append("UploadedFile", files[i]);
                    } else {
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        document.getElementById('fileAttachs').value = null;
                        return;
                    }
                }
            }
        }
        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                if ($scope.Action === "Update") {
                    myService.DeleteFile($scope.item.FilePDF, GetFolderTypeId(TypeId)); // xoa file cu khi update file moi
                }
                myService.Save($scope.item).then(function (msg) {
                    let Id = msg.data.Id
                    myService.UploadFile(Id, GetFolderTypeId(TypeId), data).then(function (msg) {
                        if ($scope.Action === "Update") {
                            toastr.success("Cập nhật thành công", "Thành công");
                        }
                        else {
                            toastr.success("Lưu thành công", "Thành công");
                        }
                        GetDataKTTVDoc();
                    }, function () {
                        toastr.error("Lỗi khi tải File", "Lỗi");
                    });
                }, function () {
                    if ($scope.Action === "Update") {
                        toastr.error("Lỗi khi cập nhật", "Lỗi");
                    }
                    else {
                        toastr.error("Lỗi khi lưu", "Lỗi");
                    }
                });
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Cảnh báo");
                    return;
                }
                if ($scope.Action === "Update") {
                    myService.Save($scope.item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        GetDataKTTVDoc();
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
            document.getElementById('fileAttachs').value = null;
        }
        closeAside();
    }

    $scope.Delete = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            if (item.FilePDF != null && item.FilePDF != '') {
                myService.DeleteFile(item.FilePDF, GetFolderTypeId(TypeId)).then(function (msg) {
                    if (msg) {
                        toastr.success('Xóa thành công File', 'Thành công');
                    }
                    else {
                        toastr.error('Có lỗi khi xóa File', 'Lỗi');
                    }
                });
            }
            myService.Delete(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
            GetDataKTTVDoc();
        }
    }

    // Lấy file pdf
    $scope.openAsideFile = function (item) {
        openAsideFile();
        $scope.folderTypeId = GetFolderTypeId(item.TypeId);

        //chỉ copy else if
        $scope.fileSource = '/LocalFiles/pdf/DuBaoKTTV/' + $scope.folderTypeId + '/' + item.FilePDF;
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

    function openAside() {
        document.getElementById(asideId).classList.add('sidenav-open-w50');
    }
    function closeAside() {
        document.getElementById(asideId).classList.remove('sidenav-open-w50');
    }
});