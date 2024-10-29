var app = angular.module('myApp', []);
app.controller("myCntrl", function ($scope, myService) {
    'use strict'
    $scope.send = function () {
        myService.SendMultiMail('KTTV', ["nguyenthienxuanloc12@gmail.com"],"CẢNH BÁO GIÁM SÁT VẬN HÀNH","Gửi công trình thủy điện A",true)
    }
});