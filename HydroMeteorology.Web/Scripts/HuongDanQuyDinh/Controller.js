var app = angular.module("myApp", ['ui.bootstrap']);
app.controller("myCntrl", function ($scope) {
    'use strict'

    $scope.openAside = function (asideId) {
        openAside(asideId);
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-w75');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-w75');
    };
    $scope.getDatetime = new Date().toJSON("yyyy/MM/dd HH:mm");
});