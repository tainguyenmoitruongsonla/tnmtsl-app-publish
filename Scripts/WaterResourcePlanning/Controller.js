app.controller('myCntrl', function ($scope, myService, toastr) {
    'use strict'
    $scope.getDatetime = new Date();

    var Status = true, isDetail = false, asideId = 'aside', TypeId;
    $scope.Keyword = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 12,
        $scope.TableCol = '';

    init();
    function init() {
        TypeId = 0;
        let pathName = location.pathname.split('/');
        switch (pathName[3]) {
            case 'nong-nghiep': TypeId = 1; $scope.TableCol = 'Yêu cầu nước nông nghiệp hàng tháng (10^6m3)'; break;
            case 'cong-nghiep': TypeId = 2; $scope.TableCol = 'Yêu cầu nước cho công nghiệp hàng tháng (10^6m3)'; break;
            case 'sinh-hoat': TypeId = 3; $scope.TableCol = 'Yêu cầu nước sinh hoạt hàng tháng (10^6m3)'; break;
            case 'chan-nuoi': TypeId = 4; $scope.TableCol = 'Yêu cầu nước chăn nuôi hàng tháng (10^6m3)'; break;
            case 'nuoi-trong-thuy-san': TypeId = 5; $scope.TableCol = 'Yêu cầu nước cho nuôi trồng thủy sản hàng tháng (10^6m3)'; break;
            case 'y-te': TypeId = 6; $scope.TableCol = 'Yêu cầu nước cho dịch vụ y tế hàng tháng (10^6m3)'; break;
            case 'du-lich': TypeId = 7; $scope.TableCol = 'Yêu cầu nước dịch vụ du lịch hàng tháng (10^6m3)'; break;
            case 'moi-truong': TypeId = 8; $scope.TableCol = 'Yêu cầu nước môi trường hàng tháng (10^6m3)'; break;
            case 'tong': TypeId = 9; $scope.TableCol = 'Tổng yêu cầu nước cho các ngành kinh tế hàng tháng (10^6m3)'; break;
            case 'nuoc-mat': TypeId = 10; break;
            case 'nuoc-duoi-dat': TypeId = 11; break;
            case 'nuoc-mua': TypeId = 14; break;
        }
        if (pathName[2] == 'muc-nuoc-lon-nhat-khai-thac')
            TypeId = 15;
        else if (pathName[2] == 'kha-nang-dap-ung-nguon-nuoc')
            TypeId = 16;
        getDataWaterResourcePlanning();
    }

    $scope.ChangeAside = function (aside, typeId) {
        asideId = aside;
        TypeId = typeId;
        getDataWaterResourcePlanning();
    }

    function getDataWaterResourcePlanning() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getData(TypeId, $scope.Keyword, Status, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.WaterResourcePlannings = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
                console.log($scope.WaterResourcePlannings);
            });
        }, function () {
            alert('Lỗi lấy dữ liệu');
        });
        myService.getData(TypeId, '', Status, 0, 0).then(function (items) {
            $scope.ItemsForSearch = items.data.ListData;
        });
    }

    $scope.Search = function () {
        getDataWaterResourcePlanning();
    }

    $scope.SetKeyword = function (keyword) {
        $scope.Keyword = keyword
    }

    $scope.Add = function () {
        $scope.item = {};
        $scope.item.TypeId = TypeId;
        $scope.HeaderAction = "THÊM MỚI"
        $scope.Action = "Add";
        openAside()
    }

    $scope.Edit = function (item) {
        myService.getSingle(item.Id).then(item => $scope.item = item.data);
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        openAside()
    }

    $scope.Save = function () {
        myService.Save($scope.item).then(function (msg) {
            toastr.success("Lưu thành công", "Thành công");
            getDataWaterResourcePlanning();
        }, function () {
            toastr.error("Lỗi khi Lưu", "Lỗi");
        });
        closeAside();
    }

    $scope.Delete = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            myService.Delete(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thành công');
                getDataWaterResourcePlanning();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Lỗi');
            });
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
});