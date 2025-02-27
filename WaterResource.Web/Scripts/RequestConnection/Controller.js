﻿app.controller("myCntrl", function ($scope, dataTransmissionService, constructionService, mapService, licenseService, toastr) {
    'use strict'

    $scope.userName = document.getElementById('userName').value.split('.').join("");

    var Status = true,
        TypeOfConstructionId = 0;

    $scope.licenseTitle = '';
    $scope.ConstructionName = '';
    $scope.ConstructionCode = '';
    $scope.license = {};
    $scope.dataTransmission = {};

    // $scope use in html file
    $scope.Keyword = '';
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;

    $scope.disabledButton = true;

    // Initial map
    mapService.initMap('Map_RequestConnection');

    //console.log(mapService.customMap);

    function makePassworkRandom(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%\/';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    GetDataTransmission();
    function GetDataTransmission() {
        dataTransmissionService.getAllTransmissions('TNN', Status, $scope.userName, 1, 0).then(function (items) {
            $scope.DataTransmission = items.data.ListData;
            $scope.CountDataTransmission = items.data.TotalCount;

            $scope.checkAccount = function () {
                return ($scope.CountDataTransmission > 0) ? false : true;
            }
        });
    }

    $scope.SaveDataTransmission = function () {
        if ($scope.licenseTitle !== '') {
            $scope.dataTransmission.DataType = 'TNN';
            $scope.dataTransmission.UserName = $scope.ConstructionCode;
            $scope.dataTransmission.Password = makePassworkRandom(10);
            $scope.dataTransmission.WorkingDirectory = '/' + $scope.ConstructionCode;
            dataTransmissionService.SaveTransmission($scope.dataTransmission).then(function (msg) {
                if (msg.data == null) {
                    toastr.error('Công trình này đã được đăng ký kết nối', 'Error');
                } else {
                    toastr.success('Thành công', 'Created');
                }
            }, function () {
                toastr.error('Lỗi gửi yêu cầu, liên hệ quản trị viên để chỉnh sửa lại', 'Error');
            });
        } else {
            toastr.error('Bạn chưa chọn công trình cần kết nối', 'Error');
        }
    }

    $scope.cameraLink = function (item) {
        if (item != null) {
            return item.CameraLink;
        } else {
            return "<a href='" + item.CameraLink + "'>xem</a>"
        }
    }

    GetDataConstruction()
    function GetDataConstruction() {
        //TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, StartDate, TotalCapacity, isDetail, isPreData, Status, Keyword, PageIndex,PageSize
        constructionService.getAllConstructions(TypeOfConstructionId, -1, -1, -1, -1, -1, -1, true, -1, '', 1, 0).then(function (items) {
            $scope.DataConstruction = items.data.ListData;
            console.log(items.data.ListData);
        });
    }

    $scope.selectCons = function (cons) {
        $scope.licenseTitle = '';
        $scope.license = {};
        $scope.ConstructionName = cons.ConstructionName;
        $scope.ConstructionCode = cons.ConstructionCode;
        $scope.Construction = cons;

        GetAllLicense(cons.Id)
        GetDataTransmission();
        $scope.disabledButton = false;
        console.log(cons);
    }

    function GetAllLicense(ConstructionId) {
        //ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, isDetail, Status, Keyword, PageIndex, PageSize
        licenseService.getAllLicenses(-1, ConstructionId, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, false, true, '', 1, 0).then(function (items) {
            $scope.Licenses = items.data.ListData;
        });
    }

    $scope.selectLicense = function (license) {
        console.log(license)
        $scope.licenseTitle = license.LicenseNumber;
        $scope.license = license;
        $scope.license.Construction = $scope.Construction;
        GetDataTransmission();
        $scope.disabledButton = false;
    }

    $scope.zoomConstruction = function (cons, lng, lat) {
        if (mymap) { mymap.remove(); }
        mapService.initMap('Map_RequestConnection');
        // Add marker for construction
        var geojsonFeature = {
            "type": "Feature",
            "properties": {
                "Content": "Công trình: ",
                "popupContent": cons.ConstructionName
            },
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            }
        }

        L.geoJson(geojsonFeature, {
            onEachFeature: onEachFeature
        }).addTo(mymap);

        // Zoom in the construction
        mymap.setView({ lng, lat }, 12);
    }

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }
});