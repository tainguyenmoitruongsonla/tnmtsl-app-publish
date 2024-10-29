app.controller('myCtrl', function ($scope, myService, toastr) {
    init();
    function init() {
        let pathName = location.pathname;
        if (pathName != '/quan-ly-tai-lieu') {
            myService.getSingle(pathName).then(item => $scope.FilePDF = item.data);
            return;
        }
        GetData()
    }
    function GetData() {
        myService.getAll().then(items => $scope.FilePDF = items.data.ListData)
    }
    $scope.Edit = function (item) {
        $scope.Action = "Update";
        $scope.item = {};
        myService.getSingle(item.Id).then(function (i) {
            $scope.item = i.data;
        })
    }

    $scope.Save = function () {
        var files = document.getElementById('file').files;
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
                        document.getElementById('file').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }

        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                if ($scope.Action === "Update") {
                    myService.DeleteFile($scope.item.FileName); // xoa file cu khi update file moi
                }
                myService.Save($scope.item).then(function (msg) {
                    var Id = msg.data.Id;
                    myService.UploadFile(Id, data).then(function (msg) {
                        toastr.success("Lưu thành công", "Thành công");
                        GetData();
                    }, function () {
                        toastr.error("Lỗi khi tải file", "Lỗi");
                    });
                }, function () {
                    toastr.error("Lỗi khi Lưu", "Lỗi");
                });
            }
        }
        document.getElementById('file').value = null;
    }
});