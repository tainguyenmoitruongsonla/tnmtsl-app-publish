app.controller("myCntrl", function ($scope, licenseFeeService, licenseService, toastr) {
    'use strict'

    $scope.LicenseFee = [],
        $scope.TotalItem = 0,
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.Keyword = '',
        $scope.item = {},
        $scope.ItemsForSearch = [],
        $scope.fileSource = '',
        $scope.sumTotalMoney = 0,
        $scope.license = '',
        $scope.DataYear = [],
        $scope.item.Licenses = [],
        $scope.TotalBTNMT = 0,
        $scope.TotalUBND = 0;
    var Status = true, LicensingAuthorities = -1, d = new Date(), asideId = 'aside';

    //using for filter
    $scope.StartYearFilter = 'Từ năm: ' + (d.getFullYear() - 25);
    $scope.EndYearFilter = 'Đến năm: ' + d.getFullYear();
    $scope.StartYear = (d.getFullYear() - 25);
    $scope.EndYear = d.getFullYear();
    for (let i = 1975; i <= d.getFullYear(); i++) {
        $scope.DataYear.push({ Year: i });
    }

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

    init();
    function init() {
        let pathName = location.pathname.split('/');
        let param = location.search;

        if (param.split('sy=').length > 1)
            $scope.StartYear = param.split('sy=')[1];
        else
            $scope.StartYear = d.getFullYear() - 25;

        if (param.split('ey=').length > 1)
            $scope.EndYear = param.split('ey=')[1];
        else
            $scope.EndYear = d.getFullYear();

        if (param.split('kw=').length > 1)
            $scope.Keyword = param.split('kw=')[1];
        else
            $scope.Keyword = '';


        switch (pathName[2]) {
            case 'bo-cap':
                LicensingAuthorities = 0;
                getDataLicenseFee();
                getDataLicense();
                break;
            case 'tinh-cap':
                LicensingAuthorities = 1;
                getDataLicenseFee();
                getDataLicense();
                break;
            default:
                countLicenseFee();
                getTotalLicenseFee();
                LicensingAuthorities = -1;
                break;
        }
    }

    function getTotalLicenseFee() {
        licenseFeeService.getAllLicenseFee(0, 0, 0, false, '', 0, 0).then(function (items) {
            items.data.ListData.forEach(row => $scope.TotalBTNMT += row.TotalMoney);
        });
        licenseFeeService.getAllLicenseFee(1, 0, 0, false, '', 0, 0).then(function (items) {
            items.data.ListData.forEach(row => $scope.TotalUBND += row.TotalMoney);
        });
    }

    $scope.Fillter = function () {
        if ($scope.LicensingAuthorities == undefined || $scope.LicensingAuthorities == '')
            LicensingAuthorities = -1;
        else
            LicensingAuthorities = $scope.LicensingAuthorities;
        countLicenseFee();
    }

    $scope.filterLicenseFeeByDataYear = function (StartYear, EndYear) {
        $scope.StartYearFilter = 'Từ năm: ' + StartYear;
        $scope.EndYearFilter = 'Đến năm: ' + EndYear;
        $scope.StartYear = StartYear;
        $scope.EndYear = EndYear;
    }

    function countLicenseFee() {
        let dataForChart = {}
        licenseFeeService.getAllLicenseFee(LicensingAuthorities, $scope.StartYear, $scope.EndYear, Status, '', 1, 0).then(function (items) {
            items.data.ListData.forEach(function (row) {
                if (row.SignDate != '' && row.SignDate != null) {
                    if (dataForChart[new Date(row.SignDate).getFullYear()] == undefined) {
                        if (row.LicensingAuthorities == 0)
                            dataForChart[new Date(row.SignDate).getFullYear()] = [row.TotalMoney, 0];
                        else if (row.LicensingAuthorities == 1)
                            dataForChart[new Date(row.SignDate).getFullYear()] = [0, row.TotalMoney];
                    }
                    else {
                        if (row.LicensingAuthorities == 0)
                            dataForChart[new Date(row.SignDate).getFullYear()][0] += row.TotalMoney;
                        else if (row.LicensingAuthorities == 1)
                            dataForChart[new Date(row.SignDate).getFullYear()][1] += row.TotalMoney;
                    }
                }
            });

            let Year = Object.keys(dataForChart);

            let BTNMT = [];
            let UBND = [];

            Object.values(dataForChart).forEach(function (e) {
                BTNMT.push(e[0]);
                UBND.push(e[1]);
            });

            let Series = [], Colors = [];
            if (LicensingAuthorities == 0) {
                Series = [{
                    name: 'Bộ Tài nguyên và môi trường',
                    data: BTNMT
                }];
                Colors = ['#32abda'];
            }
            else if (LicensingAuthorities == 1) {
                Series = [{
                    name: 'Ủy ban nhân dân Tỉnh',
                    data: UBND
                }];
                Colors = ['#fed4a4'];
            }
            else {
                Series = [{
                    name: 'Bộ Tài nguyên và môi trường',
                    data: BTNMT
                },
                {
                    name: 'Ủy ban nhân dân Tỉnh',
                    data: UBND
                }];
                Colors = ['#32abda', '#fed4a4'];
            }

            var options = {
                series: Series,
                chart: {
                    type: 'bar',
                    height: 333,
                },
                grid: {
                    show: false,
                },
                colors: Colors,
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%',
                        endingShape: 'rounded',
                        dataLabels: {
                            orientation: 'vertical',
                            position: 'bottom', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (value) {
                        return getNumberWithCommas(value);
                    },
                    style: {
                        fontFamily: '"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                        fontSize: '14px',
                        colors: ["#000000"]
                    }
                },
                stroke: {
                    show: true,
                    width: 2,
                },
                xaxis: {
                    categories: Year,
                },
                legend: {
                    position: 'bottom',
                },
                yaxis: {
                    labels: {
                        formatter: function (value) {
                            return getNumberWithCommas(value);
                        }
                    },
                    axisBorder: {
                        show: true,
                        color: '#d0d0d0',
                    },
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (value) {
                            if (value == null)
                                return "Số tiền 0 ₫"
                            return "Số tiền " + value.toLocaleString('tr-TR') + ' ₫';
                        }
                    }
                }
            };

            setTimeout(function () {
                var chart = new ApexCharts(document.querySelector("#chart"), options);
                chart.render();
                chart.updateOptions({
                    series: Series,
                    colors: Colors
                });
            }, 300);
        });
    }

    function getNumberWithCommas(num) {
        if (num == null || num == 0)
            return '0 ₫'
        let len = num.toLocaleString('en-US').split(',').length
        if (len == 1)
            return '~ ' + round(num) + " ₫";
        else if (len == 2)
            return '~ ' + round(num / 1000) + " ngàn ₫";
        else if (len == 3)
            return '~ ' + round(num / 1000000) + " triệu đ";
        else if (len == 4)
            return '~ ' + round(num / 1000000000) + " tỷ ₫";
        else
            return '~ ' + round(num / 1000000000000) + " nghìn tỷ ₫";
    }

    function round(num) {
        return (Math.round(num * 100) / 100).toLocaleString('tr-TR');
    }

    function getDataLicenseFee() {
        $scope.$watch('currentPage + numPerPage', function () {
            licenseFeeService.getAllLicenseFee(LicensingAuthorities, $scope.StartYear, $scope.EndYear, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.LicenseFee = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        });
        licenseFeeService.getAllLicenseFee(LicensingAuthorities, $scope.StartYear, $scope.EndYear, false, '', 0, 0).then(function (items) {
            items.data.ListData.forEach(row => $scope.sumTotalMoney += row.TotalMoney);
            $scope.ItemsForSearch = items.data.ListData;
        });
    }

    //add license
    $scope.AddLicenses = function (licenseItem) {
        if ($scope.item.Licenses === null || $scope.item.Licenses == undefined || $scope.item.Licenses.length == 0) {
            $scope.item.Licenses = [];
        }
        var item = { Id: licenseItem.Id, LicenseNumber: licenseItem.LicenseNumber }
        $scope.item.Licenses.push(item);
    }

    //remove license
    $scope.RemoveLicenses = function (index, item, lfId) {
        if (lfId != null || lfId != undefined) {
            if (confirm('Xoá giấy phép ' + item.LicenseNumber + ' khỏi quyết định cấp quyền này ?')) {
                var item = {
                    LicenseId: item.Id,
                    LicenseFeeId: lfId
                }
                licenseService.DeleteLicenseLicenseFee(item).then(function (msg) {
                    toastr.success('Xóa thành công', 'Giấy phép');
                    $scope.item.Licenses.splice(index, 1);
                }, function () {
                    toastr.error('Có lỗi khi xóa', 'Giấy phép');
                });
            }
            getDataLicenseFee();
        }

    }

    $scope.SetKeyword = function (keyword) {
        $scope.Keyword = keyword;
    }

    $scope.Search = function () {
        getDataLicenseFee();
    }

    $scope.Delete = function (item) {
        if (confirm(`Xóa ${item.LicenseFeeNumber} này?`)) {
            if (item.FilePDF != null)
                licenseFeeService.DeleteLicenseFeeFile(item.FilePDF).then(msg => {
                    if (msg) {
                        toastr.success("Xóa thành công", "File PDF");
                    }
                    else {
                        toastr.error("Xóa thất bại", "File PDF");
                    }
                });
            licenseFeeService.DeleteLicenseFee(item).then(msg => {
                if (msg) {
                    toastr.success("Xóa thành công", "Tiền cấp quyền");
                    getDataLicenseFee();
                }
                else {
                    toastr.error("Xóa thất bại", "Tiền cấp quyền");
                }
            });
        }
    }

    $scope.Add = function () {
        $scope.Action = "Add";
        ClearField();
        openAside();
    }

    $scope.Edit = function (licensefee) {
        ClearField();
        $scope.Action = "Update";
        licenseFeeService.getSingleLicenseFee(licensefee.Id).then(function (item) {
            $scope.item = item.data;
            if (item.data.SignDate !== null || item.data.SignDate !== '') {
                $scope.item.SignDate = new Date(item.data.SignDate);
            } else {
                $scope.item.SignDate = new Date();
            }
            if ($scope.item.SupplementLicenseFee !== null && $scope.item.ChildrenId !== null && $scope.item.ChildrenId !== 0) {
                $scope.item.SupplementLicenseFee.SignDate = new Date(item.data.SupplementLicenseFee.SignDate);
            }
        })
        openAside();
    }

    $scope.AddSupplementLicenseFee = function () {
        $scope.item.SupplementLicenseFee = {};
    }

    $scope.DeleteSupplementLicenseFee = function (item, Id) {
        if (confirm(`Xóa ${item.LicenseFeeNumber} này?`)) {
            if (item.FilePDF != null)
                licenseFeeService.DeleteLicenseFeeFile(item.FilePDF).then(msg => {
                    if (msg) {
                        toastr.success("Xóa thành công", "File PDF");
                    }
                    else {
                        toastr.error("Xóa thất bại", "File PDF");
                    }
                });
            licenseFeeService.DeleteLicenseFee(item).then(msg => {
                if (msg) {
                    toastr.success("Xóa thành công", "Tiền cấp quyền");
                    licenseFeeService.getSingleLicenseFee(Id).then(function (item) {
                        $scope.item = item.data;
                        $scope.item.SignDate = new Date(item.data.SignDate);
                        if (item.data.License != null) {
                            $scope.item.License = item.data.License;
                            $scope.license = item.data.License.LicenseNumber;
                        }
                    })
                }
                else {
                    toastr.error("Xóa thất bại", "Tiền cấp quyền");
                }
            });
        }
    }

    $scope.Save = function () {
        let fileSupplemenAttachs = document.getElementById('fileSupplemenAttachs').files;
        let myfileSupplemenAttachs = fileSupplemenAttachs;
        let dataSupp = new FormData();

        if ($scope.item.SupplementLicenseFee != undefined) {
            if (Object.keys($scope.item.SupplementLicenseFee).length == 0) {
                $scope.item.SupplementLicenseFee = null;
            }
            else {
                if (fileSupplemenAttachs !== undefined) {// veryfile type pdf or png or ..
                    // Add the uploaded file to the form data collection
                    if (fileSupplemenAttachs.length > 0) {
                        for (let i = 0; i < fileSupplemenAttachs.length; i++) {
                            let str = fileSupplemenAttachs[i].name.toLowerCase();
                            if (str.includes("pdf", str.length - 4)) {
                                dataSupp.append("UploadedFile", fileSupplemenAttachs[i]);
                            }
                            else {
                                document.getElementById('fileSupplemenAttachs').value = null;
                                toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                                return;
                            }
                        }
                    }
                }
                $scope.item.SupplementLicenseFee.LicensingAuthorities = LicensingAuthorities;
                if ($scope.item.SupplementLicenseFee.SignDate != null && $scope.item.SupplementLicenseFee.SignDate != undefined) {
                    $scope.item.SupplementLicenseFee.SignDate = formatDate($scope.item.SupplementLicenseFee.SignDate);
                }
            }
        }
        if ($scope.item.Licenses.Id == undefined || $scope.item.Licenses.Id == null) {
            //toastr.warning("Hãy chọn giấy phép", "Cảnh báo");
            //return;
            $scope.item.Licenses.Id = 0;
        }

        if ($scope.item.SignDate != null && $scope.item.SignDate != undefined) {
            $scope.item.SignDate = formatDate($scope.item.SignDate);
        }
        let files = document.getElementById('fileAttachs').files;
        let myfileAttach = files;

        let data = new FormData();
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    let str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("UploadedFile", files[i]);
                    }
                    else {
                        document.getElementById('fileAttachs').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }
        $scope.item.LicensingAuthorities = LicensingAuthorities;
        if ($scope.item.SignDate != null && $scope.item.SignDate != undefined) {
            $scope.item.SignDate = new Date($scope.item.SignDate);
        }
        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                for (let i = 0; i < myfileAttach.length; i++) {
                    if ($scope.Action == "Update") {
                        licenseFeeService.DeleteLicenseFeeFile($scope.item.FilePDF); // xoa file cu khi update file moi
                    }
                    licenseFeeService.SaveLicenseFee($scope.item, 0).then(function (msg) {
                        let Id = msg.data.Id;
                        let Name = msg.data.LicenseFeeNumber.split('/').join('_');
                        $.ajax({
                            type: "POST",
                            url: "/api/LicenseFee/upload?Id=" + Id + "&Name=" + Name,
                            contentType: false,
                            processData: false,
                            dataType: 'JSON',
                            data: data,
                            success: function (data) {
                                toastr.success("Lưu thành công", "Thành công");
                            },
                            error: function (data) {
                                toastr.error("Lỗi khi tải file", "Lỗi");
                            }
                        });
                        if (myfileSupplemenAttachs.length > 0) {
                            UpLoadFile(msg.data.SupplementLicenseFee.Id, msg.data.SupplementLicenseFee.LicenseFeeNumber, dataSupp);
                        }
                        getDataLicenseFee();
                    }, function () {
                        toastr.error("Lỗi khi Lưu", "Lỗi");
                    });
                    document.getElementById('fileAttachs').value = null;
                }
            }
            else {
                if ($scope.Action == "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Cảnh báo");
                    return;
                }
                if ($scope.Action == "Update") {
                    licenseFeeService.SaveLicenseFee($scope.item, 0).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        document.getElementById('fileAttachs').value = null;
                        if (myfileSupplemenAttachs.length > 0) {
                            UpLoadFile(msg.data.SupplementLicenseFee.Id, msg.data.SupplementLicenseFee.LicenseFeeNumber, dataSupp);
                        }
                        getDataLicenseFee();
                    }, function () {
                        toastr.error("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        getDataLicenseFee();
        closeAside();
    }

    function UpLoadFile(id, name, data) {
        let Name = name.split('/').join('_');
        $.ajax({
            type: "POST",
            url: "/api/LicenseFee/upload?Id=" + id + "&Name=" + Name,
            contentType: false,
            processData: false,
            dataType: 'JSON',
            data: data,
            success: function (data) {
                toastr.success("Bổ sung quyết định thành công", "Thành công");
                document.getElementById('fileSupplemenAttachs').value = null;
            },
            error: function (data) {
                toastr.error("Lỗi khi tải file", "Lỗi");
            }
        });
    }

    function getDataLicense() {
        licenseService.getAllLicenses(0, 0, 0, 0, 0, $scope.StartYear, $scope.EndYear, 0, 0, -1, 0, -1, false, true, '', 1, 0).then(function (items) {
            $scope.License = items.data.ListData;
        });
    }

    // Lấy file pdf

    $scope.LicenseLink = function (typeId) {
        switch (typeId) {
            case 1: return 'nuoc-mat';
            case 3: return 'xa-thai';
            case 8: return 'khai-thac-nuoc-duoi-dat';
            case 9: return 'tham-do-nuoc-duoi-dat';
            case 10: return 'hanh-nghe-khoan-nuoc-duoi-dat';
        }
    }

    $scope.ConsLink = function (typeId) {
        switch (typeId) {
            case 1: return 'nuoc-mat';
            case 3: return 'xa-thai';
            case 2: return 'nuoc-duoi-dat';
        }
    }

    $scope.openLicenseFeeFile = function (FilePDF) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/LicenseFee/' + FilePDF;
    }

    $scope.closeAside = function () {
        closeAside();
    }

    function closeAllAside() {
        closeAsideFile();
        let sidenavs = document.getElementsByClassName('sidenav-open-w50');
        for (let sidenav of sidenavs) {
            sidenav.classList.remove('sidenav-open-w50');
        }
    }

    function openAside() {
        closeAllAside();
        document.getElementById(asideId).classList.add('sidenav-open-w50');
    }

    function closeAside() {
        ClearField();
        document.getElementById(asideId).classList.remove('sidenav-open-w50');
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

    function formatDate(t) {
        var d = new Date(t);
        let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
        let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        var datestring = d.getFullYear() + "-" + month + "-" + date;
        return datestring;
    }

    function ClearField() {
        $scope.item = {};
        $scope.item.Licenses = [];
        $scope.license = '';
        $scope.item.SupplementLicenseFee = null;
    }
});