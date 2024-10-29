app.controller('myCtrl', function ($scope, myService, toastr) {
    'use strict'
    $scope.getDatetime = new Date();

    var Status = true, asideId = 'aside';
    $scope.Keyword = '',
    $scope.currentPage = 1,
    $scope.numPerPage = 20;

    init();
    function init() {
        getDataGreenhouseGas();
    }

    function getDataGreenhouseGas() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getData($scope.Keyword, Status, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Data = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            alert('Lỗi lấy dữ liệu');
        });
        myService.getData('', Status, 0, 0).then(function (items) {
            $scope.ItemForSearch = items.data.ListData;
        });
    }

    $scope.Search = function () {
        getDataGreenhouseGas();
    }

    $scope.SetKeyword = function (name) {
        $scope.Keyword = name
    }

    $scope.Add = function () {
        $scope.item = {};
        $scope.Action = "Add";
        openAside()
    }

    $scope.Edit = function (item) {
        $scope.item = {};
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(item => $scope.item = item.data);
        openAside()
    }

    $scope.Save = function () {
        if ($scope.item.Organization == null || $scope.item.InventoryMethodology == null) {
            toastr.warning("Vui lòng nhập đủ thông tin", "Cảnh báo")
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
                    myService.DeleteFile($scope.item.FilePDF); // xoa file cu khi update file moi
                }
                myService.Save($scope.item).then(function (msg) {
                    var Id = msg.data.Id;
                    myService.UploadFile(Id, data).then(function (msg) {
                        toastr.success("Lưu thành công", "Thành công");
                        getDataGreenhouseGas();
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
                        getDataGreenhouseGas();
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        document.getElementById('fileAttachs').value = null;
        closeAside();
    }

    $scope.Delete = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            myService.Delete(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
                getDataGreenhouseGas();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
            if (item.FilePDF != null && item.FilePDF != '') {
                myService.DeleteFile(item.FilePDF).then(function (msg) {
                    toastr.success('Xóa File thành công', 'Thành công');
                }, function () {
                    toastr.error('Có lỗi khi xóa File', 'Lỗi');
                });
            }
        }
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

    $scope.closeAside = function () {
        closeAside();
    }

    function closeAllNav() {
        closeAsideFile();
        let sidenavs = document.getElementsByClassName('sidenav-open-w50');
        for (let sidenav of sidenavs) {
            sidenav.classList.remove('sidenav-open-w50');
        }
    }

    // Lấy file pdf
    $scope.openAsideFile = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/BienDoiKhiHau/GreenhouseGas/' + item.FilePDF;
    }
});