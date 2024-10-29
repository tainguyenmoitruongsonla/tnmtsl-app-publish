//var app = angular.module('myApp', ['blockUI']);
app.controller("HomeCntrl", function ($scope, myService, $interval) {
    'use strict'

    var TypeOfConstructionId = 0,
        LicenseId = 0,
        LicenseId = -1,
        ProvinceId = 0,
        DistrictId = 0,
        BasinId = 0,
        CommuneId = 0,
        TotalCapacity = 0,
        StationTypeId = 0,
        Status = true,
        LicensingAuthorities = -1;
    $scope.Keyword = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 20,
        $scope.maxSize = 5;

    GetStationType();
    function GetStationType() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllStationType(true, '', 1, 0).then(function (items) {
                $scope.StationTypes = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.showAnnotateLayer = true;
    $scope.fncShowAnnotateLayer = function () {
        if ($scope.showAnnotateLayer == false) {
            $scope.showAnnotateLayer = true;
        } else {
            $scope.showAnnotateLayer = false;
        }
    }

    // Hàm định dạng ngày tháng
    function formatDateTimeWithSeconds(time) {
        var t = new Date(time);
        var year = t.getFullYear();
        var month = t.getMonth() + 1;
        var m = (month < 10) ? "0" + month : month;
        var day = (t.getDate() < 10) ? "0" + t.getDate() : t.getDate();
        var hour = (t.getHours() < 10) ? "0" + t.getHours() : t.getHours()
        var min = (t.getMinutes() < 10) ? "0" + t.getMinutes() : t.getMinutes()
        var sec = (t.getSeconds() < 10) ? "0" + t.getSeconds() : t.getSeconds()
        return day + '/' + m + '/' + year + ' ' + hour + ':' + min + ':' + sec;
    }

    $interval(function () {
        $scope.currentTime = formatDateTimeWithSeconds(Date.now());
    }, 100)

    // Show map
    var mymap = null;
    initMap();
    function initMap() {
        mymap = L.map('Map_Home', {
            maxZoom: 15
        }).setView([21.248632, 104.118988], 9);

        var layer = L.esri.basemapLayer('Imagery').addTo(mymap);
        var layerLabels = L.esri.basemapLayer('Imagery' + 'Labels');
        mymap.addLayer(layerLabels);

        var bounds = L.latLngBounds([[22.508433, 102.091449], [20.121384, 106.178362]]);
        mymap.setMaxBounds(bounds);
        mymap.on('drag', function () {
            mymap.panInsideBounds(bounds, { animate: false });
        });

        // Load kml file
        fetch('/LocalFiles/kml/Province.kml')
            .then(res => res.text())
            .then(kmltext => {
                // Create new kml overlay
                const parser = new DOMParser();
                const kml = parser.parseFromString(kmltext, 'text/xml');
                const track = new L.KML(kml);
                mymap.addLayer(track);
            });

        var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
        var bing = new L.BingLayer(BING_KEY);
        mymap.addLayer(bing);
    }

    GetDataConstruction();
    function GetDataConstruction() {
        var datas = [];
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getStationsForHomepage(StationTypeId, Status, $scope.Keyword, $scope.currentPage, -1).then(function (items) {
                $scope.DataStation = items.data.ListData;
                $scope.StationNum = items.data.TotalCount;
                showMarker();

                //mymap.on('popupopen', function (e) {
                //    getPreData(e.popup._source.feature.properties.Construction, yesterday, today, 'chartPreData_' + e.popup._source.feature.properties.Construction.ConstructionCode);
                //});
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function showMarker() {
        var markerGroups = {};
        var pointLayer;

        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });
        $scope.StationTypes.forEach(function (type) {
            markerGroups[type.TypeSlug] = [];
            $scope.StationNum = 0;
            // Loop through constructions, push data to show points on map push into array
            $scope.DataStation.forEach(function (e) {
                if (e.StationTypeSlug == type.TypeSlug) {
                    var marker =
                    {
                        "id": e.Id,
                        "type": "Feature",
                        "properties": {
                            "Content": popupContent(e),
                            "Name": e.Name,
                            "Station": e,
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [e.Lng, e.Lat]
                        }
                    };
                    markerGroups[type.TypeSlug].push(marker);

                }
                $scope.StationNum++;
                //console.log(e.StationTypeSlug);
            })
        });

        $scope.StationTypes.forEach(function (type) {
            pointLayer = L.geoJSON(markerGroups[type.TypeSlug], {
                pointToLayer: function (feature, latlng) {
                    var lay = L.marker(latlng, {
                        icon: L.divIcon({
                            html: checkWarningMarker(feature.properties.Station, feature),
                            className: 'text-marker marker-' + feature.properties.Station.StationTypeSlug + ' marker-' + feature.properties.Station.ParentStationTypeSlug,
                            id: feature.properties.Num
                        })
                    });
                    return lay;
                },
                onEachFeature: onEachFeature
            });
            mymap.addLayer(pointLayer);
        });
    }

    // Check operation status of monitoring works and show marker warning
    function checkWarningMarker(item, feat) {
        var marker = 'marker';

        if (item.StationTypeSlug == "khituongquocgia" || item.StationTypeSlug == "khituongchuyendung") {
            marker = "icon-khituong";
        } if (item.StationTypeSlug == "thuyvanquocgia" || item.StationTypeSlug == "thuyvanchuyendung") {
            marker = "icon-thuyvan";
        } if (item.StationTypeSlug == "muaquocgia" || item.StationTypeSlug == "muachuyendung") {
            marker = "icon-mua";
        }
        return '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/' + marker + '.png" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feat.properties.Name + '</div>'
    }

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }

    // Initialize the html object that will display on the map window
    function popupContent(station) {
        var html =
            `<div class="card-primary card-outline card-outline-tabs map-info-card w-100 border-0">
            <div class="card-header p-0 border-bottom-0">
            <ul class="nav nav-tabs" id="custom-tabs-three-tab" role="tablist">
            <li class="nav-item"><a class="nav-link py-1 px-2 active" id="custom-tabs-three-home-tab" data-toggle="pill" href="#custom-tabs-three-home" role="tab" aria-controls="custom-tabs-three-home" aria-selected="false">Thông tin</a></li>
            <li class="nav-item"> <a class="nav-link py-1 px-2" id="custom-tabs-three-profile-tab" data-toggle="pill" href="#custom-tabs-three-chart" role="tab" aria-controls="custom-tabs-three-chart" aria-selected="true">Số liệu vận hành</a> </li>
            </ul>
            </div>
            <div class="card-body p-0">
            <div class="tab-content" id="custom-tabs-three-tabContent">
            <div class="tab-pane fade active show" id="custom-tabs-three-home" role="tabpanel" aria-labelledby="custom-tabs-three-home-tab">
            <p class="m-0 p-2"><i>Cập nhật: `+ formatDateTime(station.Thoigiantruyendulieu) + `</i></p>
            <table class="table table-hover mb-1">`;
        if (station.StationTypeSlug == "khituongchuyendung" || station.StationTypeSlug == "khituongquocgia") {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-2 py-1"><span class="text-white">Nhiệt độ (<sup>o</sup>C)</span></th>
                    <th class="col-2 py-1"><span class="text-white">Tốc độ gió (km/h)</span></th>
                    <th class="col-2 py-1"><span class="text-white">Hướng gió</span></th>
                    <th class="col-2 py-1"><span class="text-white">Lượng mưa (mm)</span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.Name + `</span><p class="m-0"><i>` + station.LocationName + `</p></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Mucnuocho, station.UpstreamWL) + `"><span>` + $scope.checkValuePreData(station.Mucnuocho) + `</span><br><span>(m)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.MinimumFlow, station.Luuluongxatoithieu) + `"><span>` + $scope.checkValuePreData(station.Luuluongxatoithieu) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Luuluongxaquanhamay, station.MaximumFlow) + `"><span>` + $scope.checkValuePreData(station.Luuluongxaquanhamay) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Luuluongxaquatran, station.MaximumDischargeFlow) + `"><span>` + $scope.checkValuePreData(station.Luuluongxaquatran) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        if (station.StationTypeSlug == "thuyvanchuyendung" || station.StationTypeSlug == "thuyvanquocgia") {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-4 py-1"><span class="text-white">Mực nước</span></th>
                    <th class="col-4 py-1"><span class="text-white">Lưu lượng (m<sup>3</sup>/s)</span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.Name + `</span><p class="m-0"><i>` + station.LocationName + `</p></td>
                    <td class="col-4 py-1 text-center font-weight-bold `+ checkOperatingData(station.Mucnuocho, station.UpstreamWL) + `"><span>` + $scope.checkValuePreData(station.Mucnuocho) + `</span><br><span>(m)</span></td>
                    <td class="col-4 py-1 text-center font-weight-bold `+ checkOperatingData(station.MinimumFlow, station.Luuluongxatoithieu) + `"><span>` + $scope.checkValuePreData(station.Luuluongxatoithieu) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        if (station.StationTypeSlug == "muaquocgia" || station.StationTypeSlug == "muachuyendung") {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-8 py-1"><span class="text-white">Lượng mưa (mm)</span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.Name + `</span><p class="m-0"><i>` + station.LocationName + `</p></td>
                    <td class="col-8 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        html += `</table>
            </div>
            <div class="tab-pane fade" id="custom-tabs-three-chart" role="tabpanel" aria-labelledby="custom-tabs-three-chart-tab">
            <div id="chartPreData_`+ station.ConstructionCode + `" height="300"></div>
            </div>
            </div>
            </div>
            </div>`;
        return html;
    }

    function checkOperatingData(item1, item2) {
        if (item1 > item2) {
            return 'text-danger';
        }
        return '';
    }

    // Show/hide construction name on map
    $scope.toggleShow = function () {
        $(".title-of-marker").fadeToggle("slow");
    }

    $scope.toggleMarker = function (typeSlug) {
        if ($('#checkbox-' + typeSlug).is(':checked')) {
            $('#checkbox-' + typeSlug).parent().parent().children('ul').children('li').children('input').prop('checked', true);
            $('.marker-' + typeSlug).addClass('d-flex').removeClass('d-none').fadeIn('normal');
        }
        else {
            $('#checkbox-' + typeSlug).parent().parent().children('ul').children('li').children('input').prop('checked', false);
            $('.marker-' + typeSlug).addClass('d-none').removeClass('d-flex').fadeOut('normal');
        }
    }

    function formatDateTime(time) {
        var t;
        if (time == "" || time == null || time == undefined) {
            t = new Date();
        }
        else {
            t = new Date(time);
        }
        var year = t.getFullYear();
        var month = t.getMonth() + 1;
        var m = (month < 10) ? "0" + month : month;
        var day = (t.getDate() < 10) ? "0" + t.getDate() : t.getDate();
        var hour = (t.getHours() < 10) ? "0" + t.getHours() : t.getHours()
        var min = (t.getMinutes() < 10) ? "0" + t.getMinutes() : t.getMinutes()
        return day + '/' + m + '/' + year + ' ' + hour + ':' + min;
    }

    $scope.checkValuePreData = function (value) {
        if (value == -1) {
            return '<span title="Không có dữ liệu"> - </span>';
        } else if (value == null) {
            return '<span> ' + 0 + ' </span>';
        }
        else {
            return '<span>' + value + '</span>';
        }
    }

    function fromDateToString(date) {
        date = new Date(+date);
        date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
        let dateAsString = date.toISOString().substr(0, 19);
        return dateAsString;
    }

    countStation()
    function countStation() {
        var CountStations = {
            khituong: [0],
            thuyvan: [0],
            domua: [0],
            sanbaydandung: [0],
            hochuathuydien: [0],
            hochuathuyloi: [0],
            cau: [0],
            thapthuphatsong: [0],
            captreo: [0],
            tuyenduongcaotoc: [0],
            cangthuynoidia: [0],
        }
        var idQuocGia = [3, 4, 24];
        var idChuyenDung = [9, 10, 11, 13, 14, 20, 21, 22];
        var idCons = [4, 5];

        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllStation(0, 0, 0, true, '', 0, 0, 1, 0).then(function (items) {
                $scope.AllDataStation = items.data.ListData;
                items.data.ListData.forEach(function (row) {
                    if (idQuocGia.includes(row.StationTypeId)) {
                        if (row.StationTypeId == 24) {
                            CountStations.khituong[0]++;
                        } else if (row.StationTypeId == 3) {
                            CountStations.domua[0]++;
                        } else if (row.StationTypeId == 4) {
                            CountStations.thuyvan[0]++;
                        }
                    }
                    if (idChuyenDung.includes(row.StationTypeId)) {
                        CountStations.sanbaydandung[0]++;
                        if (row.StationTypeId == 9) {
                            CountStations.hochuathuydien[0]++;
                        } else if (row.StationTypeId == 10) {
                            CountStations.hochuathuyloi[0]++;
                        } else if (row.StationTypeId == 11) {
                            CountStations.captreo[0]++;
                        } else if (row.StationTypeId == 13) {
                            CountStations.cangthuynoidia[0]++;
                        } else if (row.StationTypeId == 20) {
                            CountStations.tuyenduongcaotoc[0]++;
                        } else if (row.StationTypeId == 21) {
                            CountStations.cau[0]++;
                        } else if (row.StationTypeId == 22) {
                            CountStations.thapthuphatsong[0]++;
                        }
                    }
                });
                $scope.CountStations = CountStations;
            });
            myService.getAllConstructions(TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, BasinId, -1, Status, LicensingAuthorities, $scope.Keyword, $scope.currentPage, 0).then(function (items) {
                $scope.DataConstruction = items.data.ListData;
                items.data.ListData.forEach(function (row) {
                    if (idCons.includes(row.TypeOfConstructionId)) {
                        if (row.TypeOfConstructionId == 4) {
                            CountStations.hochuathuydien[0]++;
                        } else if (row.TypeOfConstructionId == 5) {
                            CountStations.hochuathuyloi[0]++;
                        }
                    }
                });
            });
        });
    }

    
});