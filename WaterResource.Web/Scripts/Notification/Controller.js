app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    $scope.currentPage = 1; $scope.numPerPage = 14;
    var IsError = false;    
    getNotification();
    function getNotification() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getNotification(IsError, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.NotificationTNN = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    $scope.GetData = function (isError) {
        IsError = isError;
        $scope.currentPage = 1;
        getNotification();
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
});