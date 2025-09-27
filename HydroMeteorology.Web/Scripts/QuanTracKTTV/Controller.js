//var app = angular.module("myApp", ['ui.bootstrap', 'toastr', 'ngAnimate', 'blockUI', 'ngSanitize']);
app.controller('myCtrl', function ($scope, myService, $window, toastr) {
    
    'use strict';

    var CityCode = '',
        DistrictId = '',
        Status = true,
        starttime = Date.parse($scope.DetailStartDate),
        endtime = Date.parse($scope.DetailEndDate),
        DistrictId = 0,
        CommuneId = 0,
        StationTypeId = 0,
        TypeOfConstructionId = 0,
        StartDate = 0,
        EndDate = 0,
        BasinId = 0,
        ProvinceId = 0,
        LicenseId = -1,
        LicensingAuthorities = -1,
        isViewObservationHistory = false,
        DamType = '';

    $scope.station = {};
    $scope.Keyword = '';
    
    $scope.currentPage = 1, $scope.numPerPage = 10, $scope.maxSize = 5;

    //use for get preData
    var yesterday = fromDateToString(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
    var today = fromDateToString(new Date());

    var mymap = null;
    function initMap() {
        mymap = L.map('Map', {
            maxZoom: 15
        }).setView([21.248632, 104.118988], 8);

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

        // Thay thế Bing layer bằng Esri World Imagery (vệ tinh)
        var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri'
        });
        mymap.addLayer(satellite);
    }

    // 4. Khởi tạo đối tượng html sẽ hiển thị trên cửa sổ bản đồ
    function popupContent(station) {
        var html = `<div class="card-primary card-outline card-outline-tabs map-info-card w-100 border-0">
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
            <table class="table table-hover mb-1">
            <tbody>
            <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">`;
        // Tram khi tuong
        if (station.StationTypeSlug == "khituongchuyendung" || station.StationTypeSlug == "khituongquocgia") {
            html += `<tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-2 py-1"><span class="text-white">Nhiệt độ</span></th>
                    <th class="col-2 py-1"><span class="text-white">Tốc độ gió</span></th>
                    <th class="col-2 py-1"><span class="text-white">Hướng gió</span></th>
                    <th class="col-2 py-1"><span class="text-white">Lượng mưa</span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.Name + `</span><p class="m-0"><i>` + station.LocationName + `</p></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Mucnuocho, station.UpstreamWL) + `"><span>` + $scope.checkValuePreData(station.Mucnuocho) + `</span><br><span>(<sup>o</sup>C)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.MinimumFlow, station.Luuluongxatoithieu) + `"><span>` + $scope.checkValuePreData(station.Luuluongxatoithieu) + `</span><br><span>(km/h)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Luuluongxaquanhamay, station.MaximumFlow) + `"><span>` + $scope.checkValuePreData(station.Luuluongxaquanhamay) + `</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Luuluongxaquatran, station.MaximumDischargeFlow) + `"><span>` + $scope.checkValuePreData(station.Luuluongxaquatran) + `</span><br><span>(mm)</span></td>
                </tr>`;
        }
        // Tram thuy van
        if (station.StationTypeSlug == "thuyvanchuyendung" || station.StationTypeSlug == "thuyvanquocgia") {
            html += `<tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-4 py-1"><span class="text-white">Mực nước</span></th>
                    <th class="col-4 py-1"><span class="text-white">Lưu lượng</span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.Name + `</span><p class="m-0"><i>` + station.LocationName + `</p></td>
                    <td class="col-4 py-1 text-center font-weight-bold `+ checkOperatingData(station.Mucnuocho, station.UpstreamWL) + `"><span>` + $scope.checkValuePreData(station.Mucnuocho) + `</span><br><span>(m)</span></td>
                    <td class="col-4 py-1 text-center font-weight-bold `+ checkOperatingData(station.MinimumFlow, station.Luuluongxatoithieu) + `"><span>` + $scope.checkValuePreData(station.Luuluongxatoithieu) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>`;
        }
        // Tram mua
        if (station.StationTypeSlug == "muaquocgia" || station.StationTypeSlug == "muachuyendung") {
            html += `<tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-5 py-1">&nbsp;</th>
                    <th class="col-7 py-1"><span class="text-white">Lượng mưa</span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-5 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.Name + `</span><p class="m-0"><i>` + station.LocationName + `</p></td>
                    <td class="col-7 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                </tr>`;
        }
        // Cong trinh ho chua thuy dien
        if (station.TypeSlug == "hochua") {
            html += `<tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-2 py-1"><span class="text-white">H<sub>hồ</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả TT</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>khai thác</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả tràn</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.ConstructionName + `</span><p class="m-0"><i>` + station.ConstructionLocation + `</p></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                </tr>`;
        }
        // Cong trinh ho chua thuy loi
        if (station.TypeSlug == "thuydien") {
            html += `<tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-2 py-1"><span class="text-white">H<sub>hồ</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả TT</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>khai thác</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả tràn</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ station.ConstructionName + `</span><p class="m-0"><i>` + station.ConstructionLocation + `</p></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(station.Khaithac, station.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(station.Khaithac) + `</span><br><span>(mm)</span></td>
                </tr>`;
        }
        html +=
            `</tbody>
            </table>
            </div>
            <div class="tab-pane fade" id="custom-tabs-three-chart" role="tabpanel" aria-labelledby="custom-tabs-three-chart-tab">
            <div id="chartPreData_`+ station.StationCode + `" height="300"></div>
            </div>
            </div>
            </div>
            </div>`;

        return html;
    }
    $scope.Search = function () {
        $scope.currentPage = 1;

        if ($scope.StartDate != null)
            StartDate = $scope.StartDate;
        else
            StartDate = 0;

        if ($scope.EndDate != null)
            EndDate = $scope.EndDate;
        else
            EndDate = 0;

        GetStation();
        //if (StationTypeId == 4 || StationTypeId == 5) {
        //    GetDataConstruction();
        //} else {
            
        //}
    }

    function GetAllStation(stationtypeid = 0) {
        $scope.ActiveStation = 0;
        $scope.TotalStation = 0;
        $scope.InActiveStation = 0;
        myService.getAllStation(0, 0, stationtypeid, true, '', 0, 0, 1, 0).then(function (items) {
            $scope.AllDataStation = items.data.ListData;
            $scope.TotalStation = items.data.TotalCount;
            items.data.ListData.forEach(function (row) {
                if (row.Active) {
                    $scope.ActiveStation += 1;
                }
            });
            $scope.InActiveStation = $scope.TotalStation - $scope.ActiveStation;
        });
    }

    function GetStation() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllStation(DistrictId, CommuneId, StationTypeId, Status, $scope.Keyword, StartDate, EndDate, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataStation = items.data.ListData;
                $scope.DataStation.forEach(function (e) {
                    if (e.EndDate == null) {
                        e.Active = true;
                    }
                    myService.getStationData(e.StationCode, starttime, endtime).then(function (items) {
                        let arrLastDataMonitoring = items.data.ListData.reduce((acc, curr) => {
                            if (acc.some(obj => obj.StationCode === curr.StationCode)) {
                                if (acc.some(obj => obj.Time === curr.Time)) {
                                    acc.forEach(obj => {
                                        if (obj.StationCode === curr.StationCode) {
                                            if (obj.Time === curr.Time) {
                                                obj.Value = obj.Value + ',' + curr.Value;
                                            }
                                        }
                                    })
                                }
                                else {
                                    acc.push(curr);
                                }
                            } else {
                                acc.push(curr);
                            }
                            return acc;
                        }, []);

                        var { [Object.keys(arrLastDataMonitoring)[0]]: firstItem } = arrLastDataMonitoring;
                        if (firstItem !== undefined) {
                            if (firstItem.Value.length > 1) {
                                var val = firstItem.Value.split(',');
                            } else {
                                var val = firstItem.Value;
                            }
                            e.Thoigiantruyendulieu = firstItem.Time;
                            e.Trangthaiquantracmua = parseInt(firstItem.DeviceStatus)

                            //QG_Tram do mua || Tram chuyen dung do mua PCTT || Tram chuyen dung do mua san bay dan dung || Tram chuyen dung do mua duong cao toc
                            if (StationTypeId == 3 || StationTypeId == 6 || StationTypeId == 14 || StationTypeId == 20) {
                                e.Luongmua = parseFloat(val).toFixed(2);
                                //e.push()
                                //stationData['Luongmua'] = parseFloat(val).toFixed(2);
                            }
                            //QG_ThuyVan
                            if (StationTypeId == 4) {
                                e.Luuluong = parseFloat(val[0]).toFixed(2);
                                e.Mucnuoc = parseFloat(val[1]).toFixed(2);
                            }
                            //QG_tram gs bien doi khi hau || Tram chuyen dung thuy van PCTT
                            if (StationTypeId == 5 || StationTypeId == 7) {
                                e.Mucnuoc = parseFloat(val).toFixed(2);
                            }
                            //Tram chuyen dung chay rung
                            if (StationTypeId == 8) {
                                e.Nhietdo = parseFloat(val[0]).toFixed(2);
                                e.Doam = parseFloat(val[1]).toFixed(2);
                                e.Apsuat = parseFloat(val[2]).toFixed(2);
                                e.Luongmua = parseFloat(val[3]).toFixed(2);
                                e.Huonggio = val[4];
                                e.Tocdogio = parseFloat(val[5]).toFixed(2);
                            }
                            //Tram chuyen dung cap treo
                            if (StationTypeId == 11) {
                                e.Huonggio = val[0];
                                e.Tocdogiotainoicaonhat = parseFloat(val[1]).toFixed(2);
                                e.Tocdogiotainoithapnhat = parseFloat(val[2]).toFixed(2);
                            }
                            //Tram chuyen dung vuonquocgia
                            if (StationTypeId == 12) {
                                e.Nhietdo = parseFloat(val[0]).toFixed(2);
                                e.Luongmua = parseFloat(val[1]).toFixed(2);
                                e.Doam = parseFloat(val[2]).toFixed(2);
                                e.Huonggio = val[3];
                                e.Tocdogio = parseFloat(val[4]).toFixed(2);
                            }
                        }
                    })
                })

                showMarker();

                // Click on the project name to zoom in on the map
                $scope.zoomStation = function (lng, lat, conId) {
                    $(".content-wrapper").animate({ scrollTop: 0 }, "slow");
                    mymap.closePopup();
                    mymap.setView({ lng, lat }, 12);

                    Object.keys(mymap._layers).forEach(function (e) {
                        if (mymap._layers[e].feature != undefined) {
                            if (mymap._layers[e].feature.properties.Num == conId) {
                                mymap._layers[e].openPopup();
                            }
                        }
                    })
                }

                $scope.TotalFoundStation = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    // Show marker for subpage (nuocmat, nuocduoidat, xathai)
    function showMarker() {
        var markerGroups = [];
        var pointLayer;

        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });

        // Loop through constructions, push data to show points on map push into array
        if ($scope.DataStation != undefined && $scope.DataStation.length > 0) {
            $scope.DataStation.forEach(function (e) {
                var marker =
                {
                    "id": e.Id,
                    "type": "Feature",
                    "properties": {
                        "Content": popupContent(e),
                        "Name": e.Name,
                        "Station": e,
                        "Num": e.Id,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [e.Lng, e.Lat]
                    }
                };
                markerGroups.push(marker);

                pointLayer = L.geoJSON(markerGroups, {
                    pointToLayer: function (feature, latlng) {
                        var lay = L.marker(latlng, {
                            icon: L.divIcon({
                                html: checkMarker(feature.properties.Station, feature),
                                className: 'text-marker marker-' + e.ParentTypeSlug,
                                id: feature.properties.Num
                            })
                        });
                        return lay;
                    },
                    onEachFeature: onEachFeature
                });
            });
            mymap.addLayer(pointLayer);
        } else if ($scope.DataConstruction != undefined && $scope.DataConstruction.length > 0) {
            $scope.DataConstruction.forEach(function (e) {
                var marker =
                {
                    "id": e.Id,
                    "type": "Feature",
                    "properties": {
                        "Content": popupContent(e),
                        "Name": e.Name,
                        "Station": e,
                        "Num": e.Id,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [e.Lng, e.Lat]
                    }
                };
                markerGroups.push(marker);

                pointLayer = L.geoJSON(markerGroups, {
                    pointToLayer: function (feature, latlng) {
                        var lay = L.marker(latlng, {
                            icon: L.divIcon({
                                html: checkMarker(feature.properties.Construction, feature),
                                className: 'text-marker marker-' + e.ParentTypeSlug,
                                id: feature.properties.Num
                            })
                        });
                        return lay;
                    },
                    onEachFeature: onEachFeature
                });
            });
            mymap.addLayer(pointLayer);
        }
        
    }

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }

    // Check operation status of monitoring works and show marker warning
    function checkMarker(item, feat) {
        if (item != undefined) {
            // Tram khi tuong
            if (item.StationTypeSlug == "khituongchuyendung" || item.StationTypeSlug == "khituongquocgia") {
                return '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/icon-khituong.png" /><div class="btn btn-sm btn-primary font-11 py-0 px-1">' + feat.properties.Name + '</div>';
            }
            // Tram thuy van
            if (item.StationTypeSlug == "thuyvanchuyendung" || item.StationTypeSlug == "thuyvanquocgia") {
                return '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/icon-thuyvan.png" /><div class="btn btn-sm btn-primary font-11 py-0 px-1">' + feat.properties.Name + '</div>';
            }
            // Tram mua
            if (item.StationTypeSlug == "muaquocgia" || item.StationTypeSlug == "muachuyendung") {
                return '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/icon-mua.png" /><div class="btn btn-sm btn-primary font-11 py-0 px-1">' + feat.properties.Name + '</div>';
            }
            return '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/marker.png" /><div class="btn btn-sm btn-primary font-11 py-0 px-1">' + feat.properties.Name + '</div>';
        }
        return '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/marker.png" /><div class="btn btn-sm btn-primary font-11 py-0 px-1">' + feat.properties.Name + '</div>';
    }

    function GetDataConstruction() {
        var datas = [];
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllConstructions(TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, BasinId, -1, Status, LicensingAuthorities, $scope.Keyword, $scope.currentPage, $scope.numPerPage, DamType).then(function (items) {
                $scope.DataConstruction = items.data.ListData;
                $scope.TotalCons = items.data.TotalCount;

                showMarker();

                // Click on the project name to zoom in on the map
                $scope.zoomConstruction = function (lng, lat, conId) {
                    $(".content-wrapper").animate({ scrollTop: 0 }, "slow");
                    mymap.closePopup();
                    mymap.setView({ lng, lat }, 12);

                    Object.keys(mymap._layers).forEach(function (e) {
                        if (mymap._layers[e].feature != undefined) {
                            if (mymap._layers[e].feature.properties.Num == conId) {
                                mymap._layers[e].openPopup();
                            }
                        }
                    })
                }
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function getPreDataCons(construction, startTime, endTime, chartId) {
        //use for check cons
        var typeOfCons = TypeOfConstructionId;
        //use fo chart
        var chartXaxisCategories = [];
        var chartDataLakeWaterLevel = [];
        var chartDataMinimumDischargeMaintenanceFlow = [];
        var chartDataDischargeFlowThroughTheFactory = [];
        var chartDataDischargeFlowThroughOverflow = [];
        var chartDataDownstreamFlow = [];
        var chartDataMinningFlow = [];
        var operateChart = {};
        var chartHeight = 500;

        myService.getStorePreData(construction.ConstructionCode, startTime, endTime, 1, 0).then(function (items) {
            $scope.DataPre = [];
            $scope.TotalItem = items.data.TotalCount;
            let newArr = items.data.ListData.reduce((acc, curr) => {
                if (acc.some(obj => obj.ConstructionCode === curr.ConstructionCode)) {
                    if (acc.some(obj => obj.Time === curr.Time)) {
                        acc.forEach(obj => {
                            if (obj.ConstructionCode === curr.ConstructionCode) {
                                if (obj.Time === curr.Time) {
                                    obj.Id = obj.Id + ',' + curr.Id;
                                    obj.Value = obj.Value + ',' + curr.Value;
                                    obj.StationCode = obj.StationCode + ',' + curr.StationCode;
                                    obj.UpstreamWL = curr.UpstreamWL;
                                    obj.MinimumFlow = curr.MinimumFlow;
                                    obj.MaximumFlow = curr.MaximumFlow;
                                    obj.MaximumDischargeFlow = curr.MaximumDischargeFlow;
                                    obj.DeviceStatus = obj.DeviceStatus;
                                }
                            }
                        })
                    }
                    else {
                        acc.push(curr);
                    }
                } else {
                    acc.push(curr);
                }
                return acc;
            }, []);
            var id = 1;
            newArr.forEach(function (row) {
                var itemData = {
                    id: id, time: '',
                    //Surfacewater
                    muathuongluu: 0,
                    mucnuocthuongluu: 0,
                    mucnuochaluu: 0,
                    qxatt: 0,
                    qnhamay: 0,
                    qquatran: 0,
                    qhadu: 0,
                    dungtich: 0,
                    qden: 0,
                    mucnuochodukien12gio: 0,
                    qhadudukien: 0,
                    mucnuochoyeucau: 0,
                    qxattyeucau: 0,
                    qnhamayyeucau: 0,
                    qquatranyeucau: 0,
                    qkhaithacyeucau: 0,
                    qxathaiyeucau: 0,
                    mucnuocgieng: 0,
                    khaithac: 0,
                    //Groundwater Exploit
                    giengkhaithac: 0,
                    giengquantrac: 0,
                    //Discharngewater
                    xathaixuly: 0,
                    xathaitiepnhan: 0,
                    //Water Quality
                    nhietdo: 0,
                    pH: 0,
                    BOD5: 0,
                    COD: 0,
                    DO: 0,
                    TSS: 0,
                    NH4: 0,
                    Coliform: 0,
                    //Device Status
                    trangthaithietbi: 0
                };
                itemData.time = formatDateTime(row.Time);
                var val = row.Value.split(',');
                if (typeOfCons == 4) {
                    //Hydroelectric
                    itemData.muathuongluu = parseFloat(val[10]).toFixed(2);
                    itemData.mucnuocthuongluu = parseFloat(val[9]).toFixed(2);
                    itemData.mucnuochaluu = parseFloat(val[8]).toFixed(2);
                    itemData.dungtich = parseFloat(val[7]).toFixed(2);
                    itemData.qden = parseFloat(val[6]).toFixed(2);
                    itemData.qquatran = parseFloat(val[5]).toFixed(2);
                    itemData.qnhamay = parseFloat(val[4]).toFixed(2);
                    itemData.qxatt = parseFloat(val[3]).toFixed(2);
                    itemData.qhadu = parseFloat(val[2]).toFixed(2);
                    itemData.qhadudukien = parseFloat(val[1]).toFixed(2);
                    itemData.mucnuochodukien12gio = parseFloat(val[0]).toFixed(2);
                } else if (typeOfCons == 5) {
                    //Irrigation
                    itemData.qquatran = parseFloat(val[0]).toFixed(2);
                    itemData.khaithac = parseFloat(val[1]).toFixed(2);
                    itemData.qxatt = parseFloat(val[2]).toFixed(2);
                    itemData.mucnuocthuongluu = parseFloat(val[3]).toFixed(2);
                }

                itemData.mucnuochoyeucau = (construction.UpstreamWL != null ? construction.UpstreamWL : 0);
                itemData.qxattyeucau = (construction.MinimumFlow != null ? construction.MinimumFlow : 0);
                itemData.qnhamayyeucau = (construction.MaximumFlow != null ? construction.MaximumFlow : 0);
                itemData.qquatranyeucau = (construction.MaximumDischargeFlow != null ? construction.MaximumDischargeFlow : 0);
                itemData.khaithacyeucau = (construction.MiningMaxlow != null ? construction.MiningMaxlow : 0);
                itemData.mucnuocgieng = (construction.WellWl != null ? construction.WellWl : 0);
                itemData.trangthaithietbi = construction.Trangthaithietbi;

                $scope.DataPre.push(itemData);
                id++;
            })

            $scope.DataPre.forEach(function (e) {
                chartXaxisCategories.push(e.time);
                if (typeOfCons == 4) {
                    //Hydroelectric
                    chartDataLakeWaterLevel.push(checkNegative(e.mucnuocthuongluu));
                    chartDataMinimumDischargeMaintenanceFlow.push(checkNegative(e.qxatt));
                    chartDataDownstreamFlow.push(checkNegative(e.qhadu));
                    chartDataDischargeFlowThroughTheFactory.push(checkNegative(e.qnhamay));
                    chartDataDischargeFlowThroughOverflow.push(checkNegative(e.qquatran));
                } else if (typeOfCons == 5) {
                    //Irrigation
                    chartDataLakeWaterLevel.push(checkNegative(e.mucnuocthuongluu));
                    chartDataMinimumDischargeMaintenanceFlow.push(checkNegative(e.qxatt));
                    chartDataMinningFlow.push(checkNegative(e.khaithac));
                    chartDataDischargeFlowThroughOverflow.push(checkNegative(e.qquatran));
                }
            })

            //Chart operate  -- Bieu do van hanh
            var idChart = chartId.split("_");
            if (idChart[0] == 'chartPreData') {
                chartHeight = 300;
            }
            operateChart = {
                series: [
                ],
                chart: {
                    height: chartHeight,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 2,
                    curve: 'smooth',
                    //colors: ['#0077df', '#1FC260', '#D71EB9', '#F52027', '#03fca9'],
                },
                legend: {
                    tooltipHoverFormatter: function (val, opts) {
                        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                    },
                    markers: {
                        //fillColors: ['#0077df', '#1FC260', '#D71EB9', '#F52027', '#03fca9'],
                    },
                },
                xaxis: {
                    categories: chartXaxisCategories.reverse(),
                },
                //xaxis: {
                //    type: 'datetime',
                //},
                markers: {
                    size: 0,
                    hover: {
                        sizeOffset: 6
                    }
                },
                tooltip: {
                    y: [
                        {
                            title: {
                                formatter: function (val) {
                                    return val;
                                }
                            }
                        },
                    ]
                },
                grid: {
                    borderColor: '#f1f1f1',
                }
            };

            if (isViewObservationHistory == true) {
                chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
            } else {
                //onMap
                chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
            }
            if (typeOfCons == 4) {
                setTimeout(function () {
                    chart.render();
                    chart.updateOptions({
                        title: {
                            text: construction.ConstructionName,
                            align: 'center',
                            style: {
                                fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                                fontWeight: '700',
                                fontSize: '16px',
                            }
                        },
                        series: [
                            {
                                name: "Mực nước hồ (m)",
                                data: chartDataLakeWaterLevel.reverse(),
                            },
                            {
                                name: "Lưu lượng xả duy trì DCTT (m3/s)",
                                data: chartDataMinimumDischargeMaintenanceFlow.reverse(),
                            },
                            {
                                name: 'Lưu lượng xả qua nhà máy (m3/s)',
                                data: chartDataDischargeFlowThroughTheFactory.reverse(),
                            },
                            {
                                name: 'Lưu lượng xả qua tràn (m3/s)',
                                data: chartDataDischargeFlowThroughOverflow.reverse(),
                            },
                            {
                                name: 'Lưu lượng về hạ du (m3/s)',
                                data: chartDataDownstreamFlow.reverse(),
                            }
                        ],
                    });
                }, 300);
            } else if (typeOfCons == 5) {
                setTimeout(function () {
                    chart.render();
                    chart.updateOptions({
                        title: {
                            text: construction.ConstructionName,
                            align: 'center',
                            style: {
                                fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                                fontWeight: '700',
                                fontSize: '16px',
                            }
                        },
                        series: [
                            {
                                name: "Mực nước hồ thượng lưu (m)",
                                data: chartDataLakeWaterLevel.reverse(),
                            },
                            {
                                name: "Lưu lượng xả duy trì DCTT (m3/s)",
                                data: chartDataMinimumDischargeMaintenanceFlow.reverse(),
                            },
                            {
                                name: 'Lưu lượng khai thác (m3/s)',
                                data: chartDataMinningFlow.reverse(),
                            },
                            {
                                name: 'Lưu lượng xả qua tràn (m3/s)',
                                data: chartDataDischargeFlowThroughOverflow.reverse(),
                            },
                        ],
                    });
                }, 300);
            }
            //End chart operate  -- Bieu do van hanh
        });
    }

    GetDistricts();
    function GetDistricts() {
        myService.getDistrict(1, CityCode, '', 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        });
    }
    function GetCommune(DistrictId) {
        myService.getCommunes(DistrictId, CityCode, '', '', 0, 0).then(function (items) {
            $scope.Communes = items.data.ListData;
        });
    }

    $scope.DistrictChange = function (DistrictId) {
        if (DistrictId !== null) {
            GetCommune(DistrictId);
        }
        else {
            $scope.Communes = [];
        }
    }

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

    $scope.AddDataStation = function (asideId) {
        $scope.station = {};
        $scope.Action = "Add";
        $scope.headerAction = "THÊM";
        openAside(asideId);
    }

    $scope.EditDataStation = function (item, asideId) {
        $scope.Action = "Update";
        $scope.headerAction = "CẬP NHẬT";
        myService.getSingleStation(item.Id).then(function (item) {
            $scope.station = item.data;
            $scope.station.ProvinceId = 1;
            if ($scope.station.ProvinceId > 0) {
                GetDistricts();
                if ($scope.station.DistrictId > 0) {
                    GetCommune($scope.station.DistrictId);
                }
            }
        })
        openAside(asideId);
    }

    $scope.Save = function (asideId) {
        $scope.station.StationTypeId = StationTypeId;
        var getAction = $scope.Action;

        myService.Save($scope.station).then(function (msg) {
            if (getAction === "Update") {
                toastr.success('Cập nhật thành công', 'Thành công');
            }
            else {
                toastr.success('Thêm mới thành công', 'Thành công');
            }
            GetStation();
            closeAside(asideId);
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Lỗi');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Lỗi');
            }
        });
    }

    $scope.DeleteItem = function (item) {
        if ($window.confirm("Trạm quan trắc này sẽ bị xoá?")) {
            myService.DeleteItem(item).then(function (msg) {
                toastr.success("Xóa thành công", "Thành công");
                GetStation();
            }, function () {
                toastr.error("Có lỗi khi xóa", "Lỗi");
            });
        } else {
            $scope.Message = "You clicked NO.";
        }
    }

    //Make date to get stationdata
    $scope.DetailEndDate = new Date();
    $scope.DetailStartDate = new Date($scope.DetailEndDate - 604800000); // cach 7 ngay = 1000 * 60 * 60 * 24 * 7 * 0 * 0 = 604800000

    function convertDate() {
        starttime = Date.parse($scope.DetailStartDate);
        endtime = Date.parse($scope.DetailEndDate);
    }

    function getPreDataStation(station, chartId) {
        convertDate()
        //use fo chart
        var chart = '';
        var chartXaxisCategories = [];
        var chartDataRainfall = [];
        var chartDataWaterFlow = [];
        var chartDataWaterLevel = [];
        var chartDataTemperature = [];
        var chartDataHumidity = [];
        var chartDataPressure = [];
        var chartDataWindSpeedAtTheHighestPlaceOfTheCableCar = [];
        var chartDataWindSpeedAtLowestPlaceOfCableCar = [];
        var chartDataForesight = [];
        var chartDataWindSpeed = [];
        var operateChart = {};
        var chartHeight = 300;
        if (isViewObservationHistory == true) {
            chartHeight = 650;
        } else {
            //onMap
            chartHeight = 300;
        }
        myService.getStationData(station.StationCode, starttime, endtime).then(function (items) {
            $scope.DataPre = [];
            $scope.TotalItem = items.data.TotalCount;
            let arrDataMonitoring = items.data.ListData.reduce((acc, curr) => {
                if (acc.some(obj => obj.StationCode === curr.StationCode)) {
                    if (acc.some(obj => obj.Time === curr.Time)) {
                        acc.forEach(obj => {
                            if (obj.StationCode === curr.StationCode) {
                                if (obj.Time === curr.Time) {
                                    obj.ParameterName = obj.ParameterName + ',' + curr.ParameterName;
                                    obj.Value = obj.Value + ',' + curr.Value;
                                    obj.DeviceStatus = obj.DeviceStatus;
                                }
                            }
                        })
                    }
                    else {
                        acc.push(curr);
                    }
                } else {
                    acc.push(curr);
                }
                return acc;
            }, []);
            var id = 1;
            arrDataMonitoring.forEach(function (row) {
                var itemData = {
                    id: id,
                    time: '',
                    luongmua: 0,
                    luuluong: 0,
                    mucnuoc: 0,
                    nhietdo: 0,
                    doam: 0,
                    apsuat: 0,
                    huonggio: 0,
                    tocdogio: 0,
                    tocdogiotainoicaonhat: 0,
                    tocdogiotainoithapnhat: 0,
                    doamkhongkhi: 0,
                    tamnhinxa: 0,
                    tamnhinxa: 0,
                    //Device Status
                    trangthaithietbi: 0
                };
                itemData.time = formatDateTime(row.Time);
                if (row.Value.length > 1) {
                    var val = row.Value.split(',');
                } else {
                    var val = row.Value;
                }
                //QG_Tram do mua || Tram chuyen dung do mua PCTT || Tram chuyen dung do mua san bay dan dung || Tram chuyen dung do mua duong cao toc
                if (StationTypeId == 3 || StationTypeId == 6 || StationTypeId == 14 || StationTypeId == 20) {
                    itemData.luongmua = val[0];
                    $scope.DataPre.push(itemData);
                    id++;
                }
                //QG_ThuyVan
                if (StationTypeId == 4) {
                    itemData.luuluong = parseFloat(val[0]).toFixed(2);
                    itemData.mucnuoc = parseFloat(val[1]).toFixed(2);
                    $scope.DataPre.push(itemData);
                    id++;
                }
                //QG_tram gs bien doi khi hau || Tram chuyen dung thuy van PCTT
                if (StationTypeId == 5 || StationTypeId == 7) {
                    itemData.mucnuoc = parseFloat(val).toFixed(2);
                    $scope.DataPre.push(itemData);
                    id++;
                }
                //Tram chuyen dung chay rung
                if (StationTypeId == 8) {
                    itemData.nhietdo = parseFloat(val[0]).toFixed(2);
                    itemData.doam = parseFloat(val[1]).toFixed(2);
                    itemData.apsuat = parseFloat(val[2]).toFixed(2);
                    itemData.luongmua = parseFloat(val[3]).toFixed(2);
                    itemData.huonggio = val[4];
                    itemData.tocdogio = parseFloat(val[5]).toFixed(2);
                    $scope.DataPre.push(itemData);
                    id++;
                }
                //Tram chuyen dung cap treo
                if (StationTypeId == 11) {
                    itemData.huonggio = val[0];
                    itemData.tocdogiotainoicaonhat = parseFloat(val[1]).toFixed(2);
                    itemData.tocdogiotainoithapnhat = parseFloat(val[2]).toFixed(2);
                    $scope.DataPre.push(itemData);
                    id++;
                }
                //Tram chuyen dung vuon quoc gia
                if (StationTypeId == 12) {
                    itemData.nhietdo = parseFloat(val[0]).toFixed(2);
                    itemData.luongmua = parseFloat(val[1]).toFixed(2);
                    itemData.doam = parseFloat(val[2]).toFixed(2);
                    itemData.huonggio = val[3];
                    itemData.tocdogio = parseFloat(val[4]).toFixed(2);
                    $scope.DataPre.push(itemData);
                    id++;
                }
                //Tram chuyen dung cang thuy noi dia
                if (StationTypeId == 13) {
                    itemData.tamnhinxa = parseFloat(val[0]).toFixed(2);
                    itemData.mucnuoc = parseFloat(val[1]).toFixed(2);
                    itemData.huonggio = val[2];
                    itemData.tocdogio = parseFloat(val[3]).toFixed(2);
                    $scope.DataPre.push(itemData);
                    id++;
                }
            })

            $scope.DataPre.forEach(function (e) {
                chartXaxisCategories.push(e.time);
                //QG_Tram do mua || Tram chuyen dung do mua PCTT || Tram chuyen dung do mua san bay dan dung || Tram chuyen dung do mua duong cao toc
                if (StationTypeId == 3 || StationTypeId == 6 || StationTypeId == 14 || StationTypeId == 20) {
                    chartDataRainfall.push(checkNegative(e.luongmua));
                }
                //QG_ThuyVan
                if (StationTypeId == 4) {
                    chartDataWaterFlow.push(checkNegative(e.luuluong));
                    chartDataWaterLevel.push(checkNegative(e.mucnuoc));
                }
                //QG_tram gs bien doi khi hau || Tram chuyen dung thuy van PCTT
                if (StationTypeId == 5 || StationTypeId == 7) {
                    chartDataWaterLevel.push(checkNegative(e.mucnuoc));
                }
                //Tram chuyen dung chay rung
                if (StationTypeId == 8) {
                    chartDataTemperature.push(checkNegative(e.nhietdo));
                    chartDataHumidity.push(checkNegative(e.doam));
                    chartDataPressure.push(checkNegative(e.apsuat));
                    //chartDataWindDirection.push(checkNegative(e.huonggio));
                    chartDataWindSpeed.push(checkNegative(e.tocdogio));
                    chartDataRainfall.push(checkNegative(e.luongmua));
                }
                //Tram chuyen dung cap treo
                if (StationTypeId == 11) {
                    chartDataWindSpeedAtTheHighestPlaceOfTheCableCar.push(checkNegative(e.tocdogiotainoicaonhat));
                    chartDataWindSpeedAtLowestPlaceOfCableCar.push(checkNegative(e.tocdogiotainoithapnhat));
                }
                //Tram chuyen dung vuon quoc gia
                if (StationTypeId == 12) {
                    chartDataTemperature.push(checkNegative(e.nhietdo));
                    chartDataHumidity.push(checkNegative(e.doam));
                    chartDataWindSpeed.push(checkNegative(e.tocdogio));
                    chartDataRainfall.push(checkNegative(e.luongmua));
                }
                //Tram chuyen dung cang thuy noi dia
                if (StationTypeId == 13) {
                    chartDataForesight.push(checkNegative(e.tamnhinxa));
                    chartDataWindSpeed.push(checkNegative(e.tocdogio));
                    chartDataWaterLevel.push(checkNegative(e.mucnuoc));
                }
            })

            operateChart = {
                series: [],
                chart: {
                    height: chartHeight,
                    type: 'line',
                    zoom: {
                        enabled: true
                    },
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    width: 2,
                    curve: 'smooth',
                },
                legend: {
                    tooltipHoverFormatter: function (val, opts) {
                        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                    },
                    markers: {},
                },
                markers: {
                    size: 0,
                    hover: {
                        sizeOffset: 6
                    }
                },
                tooltip: {
                    y: [
                        {
                            title: {
                                formatter: function (val) {
                                    return val;
                                }
                            }
                        },
                    ]
                },
                grid: {
                    borderColor: '#f1f1f1',
                }
            };
            //QG_Tram do mua || Tram chuyen dung do mua PCTT || Tram chuyen dung do mua san bay dan dung || Tram chuyen dung do mua duong cao toc
            if (StationTypeId == 3 || StationTypeId == 6 || StationTypeId == 14 || StationTypeId == 20) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                                title: {
                                    text: 'Thời gian nhận dữ liệu'
                                },
                            },
                            yaxis: {
                                min: 0,
                                title: {
                                    text: 'Lượng mưa(mm)'
                                },
                            },
                            series: [
                                {
                                    name: "Lượng mưa(mm)",
                                    data: chartDataRainfall.reverse(),
                                }
                            ],
                        });
                    }
                }, 300);
            }
            //QG_Tram thuy van
            if (StationTypeId == 4) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory" ), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                            },
                            series: [

                                {
                                    name: "Mực nước(m)",
                                    data: chartDataWaterLevel.reverse(),
                                },
                                {
                                    name: "Lưu lượng(m3/s)",
                                    data: chartDataWaterFlow.reverse(),
                                },
                            ],
                        });
                    }
                }, 300);
            }
            //QG_tram gs bien doi khi hau || Tram chuyen dung thuy van PCTT
            if (StationTypeId == 5 || StationTypeId == 7) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                            },
                            series: [
                                {
                                    name: "Mực nước(m)",
                                    data: chartDataWaterLevel.reverse(),
                                },
                            ],
                        });
                    }
                }, 300);
            }
            //Tram chuyen dung chay rung
            if (StationTypeId == 8) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                            },
                            series: [
                                {
                                    name: "Nhiệt độ(°C)",
                                    data: chartDataTemperature.reverse(),
                                },
                                {
                                    name: "Độ ẩm(%)",
                                    data: chartDataHumidity.reverse(),
                                },
                                {
                                    name: "Áp suất(Pa)",
                                    data: chartDataPressure.reverse(),
                                },
                                {
                                    name: "Tốc độ gió(m/s)",
                                    data: chartDataWindSpeed.reverse(),
                                },
                                {
                                    name: "Lượng mưa(mm)",
                                    data: chartDataRainfall.reverse(),
                                },
                            ],
                        });
                    }
                }, 300);
            }
            //Tram chuyen dung cap treo
            if (StationTypeId == 11) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                            },
                            series: [
                                {
                                    name: "Tốc độ gió tại nơi cao nhất của cáp treo",
                                    data: chartDataWindSpeedAtTheHighestPlaceOfTheCableCar.reverse(),
                                },
                                {
                                    name: "Tốc độ gió tại nơi thấp nhất của cáp treo",
                                    data: chartDataWindSpeedAtLowestPlaceOfCableCar.reverse(),
                                },
                            ],
                        });
                    }
                }, 300);
            }
            //Tram chuyen dung vuon quoc gia
            if (StationTypeId == 12) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                            },
                            series: [
                                {
                                    name: "Nhiệt độ(°C)",
                                    data: chartDataTemperature.reverse(),
                                },
                                {
                                    name: "Độ ẩm(%)",
                                    data: chartDataHumidity.reverse(),
                                },
                                {
                                    name: "Tốc độ gió(m/s)",
                                    data: chartDataWindSpeed.reverse(),
                                },
                                {
                                    name: "Lượng mưa(mm)",
                                    data: chartDataRainfall.reverse(),
                                },
                            ],
                        });
                    }
                }, 300);
            }
            //Tram chuyen dung cang thuy noi dia
            if (StationTypeId == 13) {
                setTimeout(function () {
                    if (chartId !== '' && chartId !== null && chartId !== undefined) {
                        //on view ObservationHistory
                        if (isViewObservationHistory == true) {
                            chart = new ApexCharts(document.querySelector("#ObservationHistory"), operateChart);
                        } else {
                            //onMap
                            chart = new ApexCharts(document.querySelector("#chartPreData_" + chartId), operateChart);
                        }
                        chart.render();
                        chart.updateOptions({
                            xaxis: {
                                categories: chartXaxisCategories.reverse(),
                            },
                            series: [
                                {
                                    name: "Mực nước(cm)",
                                    data: chartDataWaterLevel.reverse(),
                                },
                                {
                                    name: "Tốc độ gió(m/s)",
                                    data: chartDataWindSpeed.reverse(),
                                },
                                {
                                    name: "Tầm nhìn xa",
                                    data: chartDataForesight.reverse(),
                                },
                            ],
                        });
                    }
                }, 300);
            }
            //End chart operate  -- Bieu do van hanh
        });
    }
    function checkNegative(value) {
        return (value == -1) ? null : value;
    }

    function formatDateTime(time) {
        if (time) {
            var t = new Date(time);
            var year = t.getFullYear();
            var month = t.getMonth() + 1;
            var m = (month < 10) ? "0" + month : month;
            var day = (t.getDate() < 10) ? "0" + t.getDate() : t.getDate();
            var hour = (t.getHours() < 10) ? "0" + t.getHours() : t.getHours()
            var min = (t.getMinutes() < 10) ? "0" + t.getMinutes() : t.getMinutes()
            return day + '/' + m + '/' + year + ' ' + hour + ':' + min;
        } else {
            return '<span class="font-italic text-danger">Không có dữ liệu</span>';
        }
    }

    function checkOperatingData(item1, item2) {
        if (item1 > item2) {
            return 'text-danger';
        }
        return '';
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

    $scope.checkDeviceStatus = function (value) {
        if (value == 0) {
            return '<div class="license_status hsd-success"> Đang đo </div>';
        } else if (value == 1) {
            return '<div class="license_status hsd-warning"> Hiệu chuẩn </div>';
        } else {
            return '<div class="license_status hsd-danger"> Báo lỗi thiết bị </div>';
        }
    }

    init();
    function init() {
        $scope.Keyword = '';
        $scope.currentPage = 1;
        let pathName = location.pathname.split('/');

        //quocgia
        if (pathName[2] == 'quoc-gia' && pathName[3] == 'mua') {
            StationTypeId = 3;
        }
        if (pathName[2] == 'quoc-gia' && pathName[3] == 'thuy-van') {
            StationTypeId = 4;
        }
        if (pathName[2] == 'quoc-gia' && pathName[3] == 'khi-tuong') {
            StationTypeId = 5;
        }
        //chuyen dung
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'thuy-dien') {
            StationTypeId = 9;
            TypeOfConstructionId = 4;
            DamType = 'td';
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'thuy-loi') {
            StationTypeId = 10;
            TypeOfConstructionId = 5;
            DamType = 'tl';
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'khi-tuong') {
            StationTypeId = 6;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'thuy-van') {
            StationTypeId = 7;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'mua') {
            StationTypeId = 8;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'cap-treo') {
            StationTypeId = 11;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'vuon-quoc-gia') {
            StationTypeId = 12;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'cang-thuy-noi-dia') {
            StationTypeId = 13;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'san-bay') {
            StationTypeId = 14;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'duong-cao-toc') {
            StationTypeId = 20;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'cau') {
            StationTypeId = 21;
        }
        if (pathName[2] == 'chuyen-dung' && pathName[3] == 'thu-phat-song') {
            StationTypeId = 22;
        }
        if (TypeOfConstructionId == 4 || TypeOfConstructionId == 5) {
            GetDataConstruction();
        } else {
            GetStation();
        }
        initMap();
        GetAllStation(StationTypeId)
    }

    $scope.openAside = function (asideId, item) {
        $scope.detailTitle = item.Name;
        isViewObservationHistory = true;
        $scope.DetailStartDate = new Date($scope.DetailEndDate - 63072000000); // cach 2 nam = 1000 * 60 * 60 * 24 * 365 * 2 * 0 = 63072000000
        $scope.SearchDetail = function () {
            //check filter date <---5 year--->
            if (TypeOfConstructionId == 4 || TypeOfConstructionId == 5) {
                getPreDataCons(item, yesterday, today, asideId);
            } else {
                getPreDataStationByYear(item, 0);
                if ($scope.DetailEndDate - $scope.DetailStartDate < 158976000000) {
                    getPreDataStation(item, asideId);
                } else {
                    toastr.error("Phạm vi lọc dữ liệu lớn nhất mà 5 năm", "Lỗi")
                }
            }
        }
        if (TypeOfConstructionId == 4 || TypeOfConstructionId == 5) {
            getPreDataCons(item, yesterday, today, asideId);
        } else {
            getPreDataStationByYear(item, 0);
            if ($scope.DetailEndDate - $scope.DetailStartDate < 158976000000) {
                getPreDataStation(item, asideId);
            } else {
                toastr.error("Phạm vi lọc dữ liệu lớn nhất mà 5 năm", "Lỗi")
            }
        }

        openAside(asideId);
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }
    $scope.closeAside = function (asideId) {
        $scope.DetailStartDate = new Date($scope.DetailEndDate - 604800000);
        isViewObservationHistory = false;
        closeAside(asideId);
    }

    function closeAllAside() {
        let sidenavs = document.getElementsByClassName('sidenav-open-withmenu');
        for (let sidenav of sidenavs) {
            sidenav.classList.remove('sidenav-open-withmenu');
        }
    }

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-withmenu');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-withmenu');
    }

    function fromDateToString(date) {
        date = new Date(+date);
        date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
        let dateAsString = date.toISOString().substr(0, 19);
        return dateAsString;
    }

    $scope.tableDataYear = [];
    $scope.Sum = [];
    $scope.Max = [];
    $scope.MaxDate = [];
    $scope.RainDays = [];
    $scope.Month = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    $scope.index = 1;
    // Get station pre data for tab table (bang so lieu)
    function getPreDataStationByYear(station, filterYear) {
        myService.GetByYear(station.StationCode, filterYear).then(function (items) {
            console.log(items);
            $scope.tableDataYear = items.data.ListData;
            if ($scope.tableDataYear != null) {
                var currentYear = new Date($scope.tableDataYear[0][0].Time);
                $scope.displayYear = currentYear.getFullYear();

                for (let i = 0; i < 12; i++) {
                    $scope.Sum[i] = 0;
                    $scope.Max[i] = 0;
                    $scope.MaxDate[i] = -1;
                    $scope.RainDays[i] = 0;
                    $scope.tableDataYear.forEach(function (row, index) {
                        if (row[i] != null && row[i] != undefined) {
                            $scope.Sum[i] += parseFloat(row[i].Value);
                            if ($scope.Max[i] < parseFloat(row[i].Value)) {
                                $scope.Max[i] = parseFloat(row[i].Value);
                                $scope.MaxDate[i] = index;
                            }
                            if (parseFloat(row[i].Value) > 0)
                                $scope.RainDays[i] += 1
                        }
                    });
                    if ($scope.MaxDate[i] == -1)
                        $scope.MaxDate[i] = null;
                    else
                        $scope.MaxDate[i] += 1;
                }
                $scope.SumYear = $scope.Sum.reduce((preValue, curValue) => preValue + curValue);
                $scope.SumRainDays = $scope.RainDays.reduce((preValue, curValue) => preValue + curValue);
                let max = $scope.Max[0];
                $scope.Max.forEach(function (value, index) {
                    if (max < value) {
                        $scope.index = index;
                        max = value;
                    }
                });
            }
        });
    }

    $('#convert-position').click(function () {
        var resultLat = 0;
        var resultLng = 0;

        var gLat = $('#wgs_g_lat').val();
        var mLat = $('#wgs_m_lat').val() / 60;
        var gLng = $('#wgs_g_lng').val();
        var mLng = $('#wgs_m_lng').val() / 60;

        if (gLat != "" && gLng != "") {
            resultLat = parseInt(gLat) + parseFloat(mLat);
            resultLng = parseInt(gLng) + parseFloat(mLng);
        } else {
            gLat = mLat = gLng = mLng = 0;
            resultLat = 0;
            resultLng = 0;
        }

        $("#lat-decimal").val(resultLat);
        $("#lng-decimal").val(resultLng);

        $scope.station.Lat = resultLat;
        $scope.station.Lng = resultLng;
    });


    $scope.data = [];

    $scope.readFile = function () {
        /*Checks whether the file is a valid excel file*/
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#upload-monitoring-data").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            if (xlsxflag) {
                var workbook = XLSX.read(data, { type: 'binary' });
            }
            else {
                var workbook = XLS.read(data, { type: 'binary' });
            }

            var sheet_name_list = workbook.SheetNames;
            var cnt = 0;
            sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                if (xlsxflag) {
                    var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                }
                else {
                    var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                }
                
                if (exceljson.length > 0) {
                    for (var i = 0; i < exceljson.length; i++) {
                        $scope.data.push(exceljson[i]);
                        $scope.$apply();
                    }
                }
            });
        }

        console.log($scope.data);
        if (xlsxflag) {
            reader.readAsArrayBuffer($("#upload-monitoring-data")[0].files[0]);
        }
        else {
            reader.readAsBinaryString($("#upload-monitoring-data")[0].files[0]);
        }
    };

        // Hiển thị DamTypes dưới dạng HTML sinh động
    $scope.renderDamTypeHtml = function (damType) {
        var type = damType.substring(2); // lấy từ ký tự thứ 3 trở đi
        if (type == "tran") {
            return '<div title="Tràn tự do"><i class="fas fa-water"></i>&nbsp;Tràn</div>';
        }
        if (type == "van") {
            return '<div title="Có van điều tiết"><i class="fas fa-sliders-h"></i>&nbsp;Van</div>';
        }
        if  (damType == "van+tran") {
            return '<div title="Có van + tràn">Van + Tràn</div>';
        }
        
    };
});