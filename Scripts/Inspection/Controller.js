app.controller("myCntrl", function ($scope, inspectionService, constructionService, $window, toastr) {
    'use strict'

    var ConstructionId = -1, Status = true;
    $scope.Keyword = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 10;

    getDataInspection();
    function getDataInspection() {
        $scope.$watch('currentPage + numPerPage', function () {
            inspectionService.getAllInspections(ConstructionId, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataInspection = items.data.ListData;
                items.data.ListData.forEach(function (e) {
                    constructionService.getSingleConstruction(e.ConstructionId).then(function (item) {
                        e.ConstructionName = item.data.ConstructionName;
                    })
                })
                $scope.totalInspection = items.data.TotalCount
            });
        });
    }

    constructionService.getAllConstructions(0, -1, 0, 0, 0, 0, -1, true, -1, '', 1, 0).then(function (items) {
        $scope.AllConstruction = items.data.ListData;
    });

    
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

    const now = new Date().getUTCFullYear();
    $scope.listYears = Array(now - (now - 22)).fill('').map((v, idx) => now - idx);

    $scope.selectYear = function (yearData) {
        BieuMau9(yearData);
    }

    //thêm mới dữ liệu biểu mẫu 19
    $scope.SearchThanhTra = function () {
        //console.log("search")
        getDataInspection();
    }

    $scope.SetKeyword = function (keyword) {
        $scope.Keyword = keyword;
    }

    $scope.AddThanhTra = function (asideId) {
        $scope.item = {};
        $scope.construction_name = null;
        $scope.Action = "Add";
        $scope.HeaderAction = "THÊM MỚI";

        openAside(asideId)
    }
    $scope.SetConsId = function (Id, consName, typeId) {
        SetConsId(Id, consName, typeId);
    }
    function SetConsId(Id, consName, typeId) {
        $scope.item.ConstructionId = Id;
        $scope.item.TypeOfConstructionId = typeId;
        $scope.construction_name = consName;
    }

    $scope.EditThanhTra = function (asideId, item) {
        $scope.item = {};
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        inspectionService.getSingleInspection(item.Id).then(item => $scope.item = item.data);
        SetConsId(item.ConstructionId, item.ConstructionName, item.TypeOfConstructionId);
        openAside(asideId)
    }

    function getFolderThanhTra(id) {
        //console.log(id);
        if (id == 4 || id == 5 || id == 6 || id == 11 || id == 12 || id == 13 || id == 14 || id == 15)
            return 'NuocMat';
        else if (id == 8 || id == 9 || id == 10 || id == 16 || id == 24)
            return 'NuocDuoiDat';
        else if (id == 17 || id == 18 || id == 19 || id == 20 || id == 21 || id == 22 || id == 23)
            return 'XaThai';
        return '';
    }

    //convert date from dd-mm-yyyy to yyyy-mm-dd when save to db
    function reformatDateString(s) {
        if (s != undefined) {
            var b = s.split(/\D/);
            return b.reverse().join('-');
        } else {
            return null;
        }
    }

    $scope.SaveThanhTra = function (asideId) {
        console.log($scope.item.InspectionDate)
        if ($scope.item.InspectionDate != undefined) {
            //$scope.item.InspectionDate = reformatDateString($scope.item.InspectionDate)
        } else {
            toastr.warning("Ngày thanh tra không được để trống", "Cảnh báo");
        }
        var files = document.getElementById('fileAttachs').files;
        var myfileAttach = files;

        //if ($scope.item.ConstructionId == null || $scope.item.ConstructionId == undefined) {
        //    toastr.warning("Vui lòng chọn công trình phù hợp", "Cảnh báo");
        //    return;
        //}

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
                        document.getElementById('fileAttachs').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }

        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                if ($scope.Action === "Update") {
                    inspectionService.DeleteFileInspection($scope.item.FilePDF, getFolderThanhTra($scope.item.TypeOfConstructionId)); // xoa file cu khi update file moi
                }
                inspectionService.SaveInspection($scope.item).then(function (msg) {
                    var docId = msg.data.Id;
                    $.ajax({
                        type: "POST",
                        url: "/api/Inspection/upload?Id=" + docId + "&FolderName=" + getFolderThanhTra($scope.item.TypeOfConstructionId),
                        contentType: false,
                        processData: false,
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            toastr.success("Lưu thành công", "Thành công");
                            getDataInspection();
                        },
                        error: function (data) {
                            toastr.error("Lỗi khi tải file", "Lỗi");
                        }
                    });
                }, function () {
                    toastr.error("Lỗi khi Lưu", "Lỗi");
                });
                document.getElementById('fileAttachs').value = null;
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Cảnh báo");
                    return;
                }
                if ($scope.Action === "Update") {
                    inspectionService.SaveInspection($scope.item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        getDataInspection();
                        document.getElementById('fileAttachs').value = null;
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        closeAside(asideId);
    }

    $scope.DeleteThanhTra = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            inspectionService.DeleteFileInspection(item.FilePDF, getFolderThanhTra(item.TypeOfConstructionId)).then(function (msg) {
                if (msg) {
                    inspectionService.DeleteInspection(item).then(function (msg) {
                        toastr.success('Xóa thành công', 'Thành công');
                        getDataInspection();
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
    // show file license fee
    $scope.openThanhTraFile = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/ThanhTra/' + getFolderThanhTra(item.TypeOfConstructionId) + '/' + item.FilePDF;
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

    $scope.openAside = function (asideId) {
        $scope.currentPage = 1;
        $scope.Keyword = '';

        openAside(asideId);
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-withmenu');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-withmenu');
    }
});