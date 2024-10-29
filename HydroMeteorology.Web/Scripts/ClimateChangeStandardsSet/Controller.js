app.controller("myCtrl", function ($scope, myService) {
    'use strict'

    $scope.AllTypeOfStandardsSet = [
        { Id: 1, Name: 'Nhiệt độ không khí trung bình tháng và năm(°C)' },
        { Id: 2, Name: 'Độ ẩm tuyệt đối của không khí trung bình tháng và năm (%)' },
        { Id: 3, Name: 'Vận tốc gió trung bình tháng và năm (m/s)' },
        { Id: 4, Name: 'Lượng mưa trung bình tháng và năm (mm)' },
        { Id: 5, Name: 'Tổng số giờ nắng trung bình tháng và năm (giờ)' }
    ]

    var Status = true, asideId = 'aside';
    $scope.Keyword = '',
    $scope.currentPage = 1,
    $scope.numPerPage = 20;
    //init();
    //function init() {
    //    getDataLicenseKTTV();
    //}

    $scope.ChangeTypeOfStandardsSet = function (TypeOfStandardsSet) {
        if (TypeOfStandardsSet == undefined || TypeOfStandardsSet == null) {
            TypeOfStandardsSet = 1;
        }
        getData(TypeOfStandardsSet)
    }

    getData(1)
    function getData(TypeOfStandardsSet) {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getData(TypeOfStandardsSet, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Data = items.data.ListData;
                $scope.TotalData = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.SetKeyword = function (name) {
        $scope.Keyword = name
    }

    $scope.Add = function (asideId) {
        $scope.item = {};
        $scope.Action = "Add";
        openAside(asideId);
    }

    $scope.Edit = function (item) {
        $scope.item = {};
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(item => {
            $scope.item = item.data
            $scope.LicenseType = item.data.LicenseType + '';
        });
        openAside()
    }

    $scope.Save = function () {
        if ($scope.item.LicenseNumber == '' || $scope.item.LicenseHolderName == '') {
            toastr.warning("Vui lòng nhập đủ thông tin", "Cảnh báo")
            return;
        }
        var myfileAttach = [];
        var data = new FormData();
        for (let i = 0; i < 5; i++) {
            let files = document.getElementById('fileAttachs' + i).files;
            if (files.length > 0) {
                myfileAttach.push(files);
                for (var j = 0; j < files.length; j++) {
                    var str = files[j].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append(i, files[j]);
                    }
                    else {
                        document.getElementById('fileAttachs' + i).value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
            else {
                data.append("UploadedFile" + i, null);
            }
        }

        if (myfileAttach.length > 0) {
            myService.Save($scope.item).then(function (msg) {
                var Id = msg.data.Id;
                myService.UploadFile(Id, data).then(function (msg) {
                    toastr.success("Lưu thành công", "Thành công");
                    getDataLicenseKTTV();
                }, function () {
                    toastr.error("Lỗi khi tải file", "Lỗi");
                });
            }, function () {
                toastr.error("Lỗi khi Lưu", "Lỗi");
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
                    getDataLicenseKTTV();
                }, function () {
                    toastr.success("Lỗi khi cập nhật", "Lỗi");
                });
            }
        }
        for (let i = 0; i < 5; i++) {
            let files = document.getElementById('fileAttachs' + i).files;
            if (files.length > 0)
                document.getElementById('fileAttachs' + i).value = null;
        }
        closeAside();
    }

    $scope.Delete = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            myService.Delete(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
                getDataLicenseKTTV();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });

            myService.DeleteFile(item.Id).then(function (msg) {
                toastr.success('Xóa File thành công', 'Thành công');
            }, function () {
                toastr.error('Có lỗi khi xóa File', 'Lỗi');
            });
        }
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