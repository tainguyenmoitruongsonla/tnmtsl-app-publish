﻿app.controller("myCntrl", function ($scope, monitoringSystemService, typeOfConstructionService, constructionService, waterQualityService, toastr, $interval, $sce) {
    'use strict'

    //use for get construction data
    var LicenseId = -1,
        ProvinceId = 0,
        DistrictId = 0,
        CommuneId = 0,
        BasinId = 0,
        StartDate = -1,
        Status = true,
        LicensingAuthorities = -1,
        //use for get preData
        yesterday = fromDateToString(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)),
        today = fromDateToString(new Date());

    // $scope use in html file
    $scope.Keyword = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.TypeOfConstructionId = -1,
        $scope.isDetail = true,
        $scope.isPredata = true,
        $scope.isHome = false,
        $scope.checkRiseWL = 0,
        $scope.checkMinimumFlow = 0,
        $scope.checkMaximumDischargeFlow = 0,
        $scope.checkMiningMaxFlow = 0,

        //use for filter preData
        $scope.inputStartTime = '',
        $scope.inputEndTime = '',

        $scope.LicensingAuthoritiesFilter = 'Chọn Cơ quan CP',
        $scope.TypeOfConstructionFilter = 'Chọn loại CT',
        $scope.ConstructionFilter = '',
        $scope.OperatingStatusFilter = 'Chọn trạng thái kết nối',

        $scope.ListLicensingAuthorities = [
            { Id: -1, Name: "Chọn Cơ quan CP" },
            { Id: 0, Name: "BTNMT" },
            { Id: 1, Name: "UBND Tỉnh" }
        ],

        $scope.ListSurfacewaterQualities = [
            { Id: 0, Name: "A1" },
            { Id: 1, Name: "A2" },
            { Id: 2, Name: "B1" },
            { Id: 2, Name: "B2" }
        ],

        $scope.ListOperatingStatus = [
            { Id: -1, Name: "Chọn trạng thái kết nối" },
            { Id: 0, Name: "Bình thường" },
            { Id: 1, Name: "Mất kết nối" }
        ];

    $scope.filterPreData = function (chartId) {
        if ($scope.inputStartTime != '' || $scope.inputEndTime != '')
            getPreData($scope.con, $scope.inputStartTime, $scope.inputEndTime, chartId);
        else
            toastr.warning('Hãy nhập khoảng thời gian cần lọc', 'Cảnh báo');
    }

    //filter license on page show list license
    $scope.filterConsByType = function (Id, Name) {
        if (Id > 3) {
            $scope.TypeOfConstructionId = Id;
            $scope.TypeOfConstructionFilter = Name;
        } else {
            let pathName = location.pathname.split('/')[2];
            switch (pathName) {
                case "nuoc-mat":
                    $scope.TypeOfConstructionId = 1;
                    GetTypeOfConstruction($scope.TypeOfConstructionId);
                    break;
                case "nuoc-duoi-dat":
                    $scope.TypeOfConstructionId = 2;
                    GetTypeOfConstruction($scope.TypeOfConstructionId);
                    break;
                case "xa-thai":
                    $scope.TypeOfConstructionId = 3;
                    GetTypeOfConstruction($scope.TypeOfConstructionId);
                    break;
            }
            $scope.TypeOfConstructionFilter = Name;
        }
        GetDataConstruction();
    }

    $scope.filterConsByLicensingAuthorities = function (Id, Name) {
        LicensingAuthorities = Id;
        $scope.LicensingAuthoritiesFilter = Name;
        GetDataConstruction();
    };

    $scope.filterByOperatingStatus = function (Id, Name) {
        //LicensingAuthorities = Id;
        $scope.OperatingStatusFilter = Name;
        GetDataConstruction();
    };

    $scope.filterSurfacewaterQuality = function (LimitType) {
        GetWaterQualities(LimitType)
    };

    //search data license
    $scope.Search = function () {
        $scope.currentPage = 1;

        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });

        GetDataConstruction();
    }

    $scope.ShowColumns = function (TypeOfConsId, arr) {
        if (arr.includes(TypeOfConsId || TypeOfConsId == undefined)) {
            return true;
        }
        return false;
    }

    function GetTypeOfConstruction(parrentId) {
        $scope.TypeOfConstructions = [];
        typeOfConstructionService.getTypeOfConstructions(parrentId, Status, '', 0, 0).then(function (items) {
            items.data.ListData.forEach(function (row) {
                var item = { Id: row.Id, TypeName: row.TypeName }
                if (row.Id == 12 || row.Id == 14 || row.Id == 15) {
                    var item = { Id: row.Id, TypeName: '' }
                }
                else {
                    $scope.TypeOfConstructions.push(item);
                }
            })
        });
    }

    $scope.showAnnotateLayer = true;
    // Show/hide map annotate
    $scope.fncShowAnnotateLayer = function () {
        if ($scope.showAnnotateLayer == false) {
            $scope.showAnnotateLayer = true;
        } else {
            $scope.showAnnotateLayer = false;
        }
    }

    // Initialize the html object that will display on the map window
    function popupContent(cons) {
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
            <p class="m-0 p-2"><i>Cập nhật: `+ formatDateTime(cons.TimePre) + `</i></p>
            <table class="table table-hover mb-1">`;
        if (cons.TypeOfConstructionId == 4) {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-2 py-1"><span class="text-white">H<sub>hồ</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả TT</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả NM</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả tràn</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ cons.ConstructionName + `</span><p class="m-0"><i>` + cons.ConstructionLocation + `</p></td>
                    <td class="col-2 py-1 text-center font-weight-bold"><span>` + $scope.checkValuePreData(cons.UpstreamWLPre) + `</span><br><span>(m)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.MinimumFlow, cons.MinimumFlowPre) + `"><span>` + $scope.checkValuePreData(cons.MinimumFlowPre) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.MaximumFlowPre, cons.MaximumFlow) + `"><span>` + $scope.checkValuePreData(cons.MaximumFlowPre) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.MaximumDischargeFlow, cons.MaximumDischargeFlowPre) + `"><span>` + $scope.checkValuePreData(cons.MaximumDischargeFlowPre) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        if (cons.TypeOfConstructionId == 5) {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-2 py-1"><span class="text-white">H<sub>hồ</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả TT</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>khai thác</sub></span></th>
                    <th class="col-2 py-1"><span class="text-white">Q<sub>xả tràn</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ cons.ConstructionName + `</span><p class="m-0"><i>` + cons.ConstructionLocation + `</p></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Mucnuocho, cons.UpstreamWL) + `"><span>` + $scope.checkValuePreData(cons.Mucnuocho) + `</span><br><span>(m)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.MinimumFlow, cons.Luuluongxatoithieu) + `"><span>` + $scope.checkValuePreData(cons.Luuluongxatoithieu) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Khaithac, cons.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(cons.Khaithac) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Luuluongxaquatran, cons.MaximumDischargeFlow) + `"><span>` + $scope.checkValuePreData(cons.Luuluongxaquatran) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        if (cons.TypeOfConstructionId == 6 || cons.TypeOfConstructionId == 11 || cons.TypeOfConstructionId == 13) {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-8 py-1"><span class="text-white">Q<sub>khai thác</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ cons.ConstructionName + `</span><p class="m-0"><i>` + cons.ConstructionLocation + `</p></td>
                    <td class="col-8 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Khaithac, cons.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(cons.Khaithac) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        if (cons.TypeOfConstructionId == 8) {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-3 py-1">&nbsp;</th>
                    <th class="col-3 py-1"><span class="text-white">Q<sub>khai thác giếng khoan</sub></span></th>
                    <th class="col-3 py-1"><span class="text-white">H<sub>giếng khai thác</sub></span></th>
                    <th class="col-3 py-1"><span class="text-white">H<sub>giếng quan trắc</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-3 py-1"><span class="font-weight-bold" style="color:#035291;">`+ cons.ConstructionName + `</span><p class="m-0"><i>` + cons.ConstructionLocation + `</p></td>
                    <td class="col-3 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Khaithac, cons.MiningMaxFlow) + `"><span>` + $scope.checkValuePreData(cons.Khaithac) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-3 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Giengkhaithac, cons.WellWL) + `"><span>` + $scope.checkValuePreData(cons.Giengkhaithac) + `</span><br><span>(m)</span></td>
                    <td class="col-3 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Giengquantrac, cons.MonitoringWellWL) + `"><span>` + $scope.checkValuePreData(cons.Giengquantrac) + `</span><br><span>(m)</span></td>
                </tr>
                </tbody>`;
        }
        var idDischargeCons = [17, 18, 19, 20, 21, 22, 23, 24];
        if (idDischargeCons.includes(cons.TypeOfConstructionId)) {
            html += `<tbody>
                <tr class="col-12 d-flex align-items-center p-0 text-center" style="background: #15538f;">
                    <th class="col-4 py-1">&nbsp;</th>
                    <th class="col-4 py-1"><span class="text-white">Q<sub>nước thải sai xử lý</sub></span></th>
                    <th class="col-4 py-1"><span class="text-white">Q<sub>nguồn tiếp nhận</sub></span></th>
                </tr>
                <tr class="col-12 d-flex p-0">
                    <td class="col-4 py-1"><span class="font-weight-bold" style="color:#035291;">`+ cons.ConstructionName + `</span><p class="m-0"><i>` + cons.ConstructionLocation + `</p></td>
                    <td class="col-4 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Xathaixl, cons.DischargeFlow) + `"><span>` + $scope.checkValuePreData(cons.Xathaixl) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                    <td class="col-4 py-1 text-center font-weight-bold `+ checkOperatingData(cons.Xathaitn, cons.DischargeFlow) + `"><span>` + $scope.checkValuePreData(cons.Xathaitn) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
                </tr>
                </tbody>`;
        }
        html += `</table>
            </div>
            <div class="tab-pane fade" id="custom-tabs-three-chart" role="tabpanel" aria-labelledby="custom-tabs-three-chart-tab">
            <div id="chartPreData_`+ cons.ConstructionCode + `" height="300"></div>
            </div>
            </div>
            </div>
            </div>`;
        return html;
    }

    var mymap = null;
    function initMap(MapId) {
        mymap = L.map('Map_' + MapId, {
            maxZoom: 15
        }).setView([21.248632, 104.118988], 8);

        var layer = L.esri.basemapLayer('Imagery').addTo(mymap);
        var layerLabels = L.esri.basemapLayer('Imagery' + 'Labels');
        mymap.addLayer(layerLabels);

        function setBasemap(basemap) {
            if (layer) {
                mymap.removeLayer(layer);
            }

            layer = L.esri.basemapLayer(basemap);

            mymap.addLayer(layer);

            if (layerLabels) {
                mymap.removeLayer(layerLabels);
            }

            if (basemap === 'ShadedRelief'
                || basemap === 'Oceans'
                || basemap === 'Gray'
                || basemap === 'Imagery'
            ) {
                layerLabels = L.esri.basemapLayer(basemap + 'Labels');
                mymap.addLayer(layerLabels);
            } else if (basemap.includes('Imagery')) {
                layerLabels = L.esri.basemapLayer('ImageryLabels');
                mymap.addLayer(layerLabels);
            }
        }

        var basemaps = document.getElementById('basemaps');

        basemaps.addEventListener('change', function () {
            setBasemap(basemaps.value);
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

    function checkOperatingData(item1, item2) {
        if (item1 > item2) {
            return 'text-danger';
        }
        return '';
    }

    $scope.displayOperatingStatus = function (item) {
        //if (item.IsError) {
        //    return $sce.trustAsHtml('<span class="license_status hsd-warning btn btn-sm" title="Vận hành chưa đúng"><i class="fa-regular fa-triangle-exclamation"></i> </span><span class="btn btn-sm btn-outline-primary btnmail mx-1"><i class="fa-solid fa-envelope" data-business_email="' + item.Business.Email + '"></i></span><span class="license_status hsd-danger btn btn-sm" title="Không có kết nối"><i class="fa-regular fa-camera-slash"></i> </span>');
        //} else 
        //if (item.IsDisconnect) {
        //    return $sce.trustAsHtml('<span class="license_status hsd-danger btn btn-sm" title="Mất kết nối"><i class="fa-solid fa-empty-set"></i> </span><span class="license_status hsd-danger btn btn-sm" title="Không có kết nối camera"><i class="fa-regular fa-camera-slash"></i> </span>');
        //} else {
            return $sce.trustAsHtml('<span class="license_status hsd-success btn btn-sm" title="Đang vận hành"> <i class="fa-solid fa-square-check"></i> </span><span class="license_status hsd-danger btn btn-sm" title="Không có kết nối camera"><i class="fa-regular fa-camera-slash"></i> </span>');
        //}
    }

    $('body').on('click', '.btnmail', function (e) {
        let businessEmail = $(this).data('business_email');
        monitoringSystemService.SendMultiMail('KTTV', ["locxxx97@gmail.com", businessEmail], "CẢNH BÁO GIÁM SÁT VẬN HÀNH", "Gửi công trình thủy điện A", true)
    });

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }

    var consTypes = ["thuydien", "hochua", "trambom", "tramcapnuoc", "cong", "nhamaynuoc", "khaithac", "thamdo", "xathai"];

    var idDischargeCons = [17, 18, 19, 20, 21, 22, 23, 24];

    function GetDataConstruction() {
        $scope.$watch('currentPage + numPerPage', function () {
            constructionService.getAllConstructions($scope.TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, BasinId, StartDate, Status, LicensingAuthorities, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataConstruction = items.data.ListData;
                $scope.TotalItems = items.data.TotalCount;
                if ($scope.isHome) {
                    $scope.countHydroelectric = 0;
                    $scope.countIrrigation = 0;
                    $scope.countPumpStation = 0;
                    $scope.countWaterSupplyStation = 0;
                    $scope.countDrainStation = 0;
                    $scope.countExploitStation = 0;
                    $scope.countDischargeWater = 0;
                    $scope.countWaterFactory = 0;
                    $scope.countGroundExploration = 0;
                    $scope.DataConstruction.forEach(function (e) {
                        if (e.TypeOfConstructionId == 4) {
                            $scope.countHydroelectric += 1;
                        } else if (e.TypeOfConstructionId == 5) {
                            $scope.countIrrigation += 1;
                        } else if (e.TypeOfConstructionId == 6) {
                            $scope.countPumpStation += 1;
                        } else if (e.TypeOfConstructionId == 11) {
                            $scope.countWaterSupplyStation += 1;
                        } else if (e.TypeOfConstructionId == 13) {
                            $scope.countDrainStation += 1;
                        } else if (e.TypeOfConstructionId == 14) {
                            $scope.countWaterFactory += 1;
                        } else if (e.TypeOfConstructionId == 8) {
                            $scope.countExploitStation += 1;
                        } else if (e.TypeOfConstructionId == 9) {
                            $scope.countGroundExploration += 1;
                        } else if (idDischargeCons.includes(e.TypeOfConstructionId)) {
                            $scope.countDischargeWater += 1;
                        }
                    });

                    consTypes.forEach(function (e) {
                        showMarkerHomepage($scope.DataConstruction, e);
                    })
                }
                else { showMarkerSubpage(); }

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

                mymap.on('popupopen', function (e) {
                    getPreData(e.popup._source.feature.properties.Construction, yesterday, today, 'chartPreData_' + e.popup._source.feature.properties.Construction.ConstructionCode);
                });
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function GetWaterQualities(LimitType) {
        waterQualityService.getAllWaterQualitties(LimitType).then(function (items) {
            $scope.WaterQuality = [];
            items.data.ListData.forEach(function (e) {
                switch (e.Name) {
                    case 'pH': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break;
                    case 'BOD5': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break;
                    case 'COD': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break;
                    case 'DO': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break;
                    case 'TSS': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break;
                    case 'NH4': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break
                    case 'Coliform': $scope.WaterQuality.push(e.Min == null ? 0 : e.Min + ' - ' + e.Max)
                        break;
                    default: break;
                }
            })
        });
    }

    // Show marker for homepage
    function showMarkerHomepage(cons, slug) {
        var markerGroups = {
            "nuocmat": [],
            "nuocduoidat": [],
            "xathai": []
        };
        var pointLayer;

        cons.forEach(function (e) {
            if (idDischargeCons.includes(e.TypeOfConstructionId)) {
                var marker =
                {
                    "id": e.Id,
                    "type": "Feature",
                    "properties": {
                        "Content": popupContent(e),
                        "Name": e.Name,
                        "Construction": e,
                        "Num": e.Id,
                        "ConstructionType": e.TypeOfConstructionId
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [e.Lng, e.Lat]
                    }
                };
                markerGroups['xathai'].push(marker);
            }
            if (e.TypeSlug == slug) {
                var marker =
                {
                    "id": e.Id,
                    "type": "Feature",
                    "properties": {
                        "Content": popupContent(e),
                        "Name": e.Name,
                        "Construction": e,
                        "Num": e.Id,
                        "ConstructionType": e.TypeOfConstructionId
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [e.Lng, e.Lat]
                    }
                };
                markerGroups[e.ParentTypeSlug].push(marker);
            }
        })
        var arrayType = ['nuocmat', 'nuocduoidat', 'xathai'];

        arrayType.forEach(function (e) {
            pointLayer = L.geoJSON(markerGroups[e], {
                pointToLayer: function (feature, latlng) {
                    var lay = L.marker(latlng, {
                        icon: L.divIcon({
                            html: checkWarningMarker(feature.properties.Construction, feature),
                            className: 'text-marker marker-' + feature.properties.Construction.ParentTypeSlug + ' marker-' + feature.properties.Construction.TypeSlug,
                            id: feature.properties.Num
                        })
                    });
                    return lay;
                },
                onEachFeature: onEachFeature
            });
            mymap.addLayer(pointLayer);
        })
    }

    // Show marker for subpage (nuocmat, nuocduoidat, xathai)
    function showMarkerSubpage() {
        var markerGroups = {
            "nuocmat": [],
            "nuocduoidat": [],
            "xathai": []
        };
        var pointLayer;

        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });

        // Loop through constructions, push data to show points on map push into array
        $scope.DataConstruction.forEach(function (e) {
            var marker =
            {
                "id": e.Id,
                "type": "Feature",
                "properties": {
                    "Content": popupContent(e),
                    "Name": e.Name,
                    "Construction": e,
                    "Num": e.Id,
                    "ConstructionType": e.TypeOfConstructionId
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [e.Lng, e.Lat]
                }
            };
            markerGroups[e.ParentTypeSlug].push(marker);

            pointLayer = L.geoJSON(markerGroups[e.ParentTypeSlug], {
                pointToLayer: function (feature, latlng) {
                    var lay = L.marker(latlng, {
                        icon: L.divIcon({
                            html: checkWarningMarker(feature.properties.Construction, feature),
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

    function countOperatingCons() {
        constructionService.getAllConstructions($scope.TypeOfConstructionId, -1, -1, -1, -1, -1, -1, true, -1, '', $scope.currentPage, $scope.numPerPage).then(function (items) {
            $scope.TotalCons = items.data.TotalCount;
            items.data.ListData.forEach(function (e) {
                if (e.Mucnuocho > e.RiseWL) {
                    $scope.checkRiseWL++;
                }
                if (e.Luuluongxaquatran > e.MaximumDischargeFlow) {
                    $scope.checkMaximumDischargeFlow++;
                }
                if (e.Luuluongxaquanhamay > e.MiningMaxFlow) {
                    $scope.checkMiningMaxFlow++;
                }
                if (e.Luuluongxatoithieu < e.MinimumFlow) {
                    $scope.checkMinimumFlow++;
                }
            })
        });
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

    // Check operation status of monitoring works and show marker warning
    function checkWarningMarker(item, feat) {
        return '<img width=20 src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/' + item.TypeSlug + '.png" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feat.properties.Name + '</div>'
    }

    $scope.checkValuePreData = function (value) {
        if (value == -1 || value === null) {
            return '<span class="font-weight-bold" title="Không có dữ liệu"> - </span>';
        } else {
            return '<span>' + round(value) + '</span>';
        }
    }
    function round(num) {
        return Math.round(num * 100) / 100;
    }
    $scope.calculatePreData = function (param1, param2) {
        if (param2 == null) { param2 = 0; }
        if (param2 >= param1) {
            if (param1 < 0) {
                return '<span> - </span>';
            }
            else {
                return '<span class="text-success font-weight-bold">' + parseFloat(param2 - param1).toFixed(2) + '</span>';
            }
        }
        return '<span class="text-danger font-weight-bold">' + parseFloat(param2 - param1).toFixed(2) + '</span>';
    }

    $scope.calculatePreDataNegative = function (param1, param2) {
        if (param1 >= param2) {
            return '<span class="text-success font-weight-bold">' + parseFloat(param1 - param2).toFixed(2) + '</span>';
        } else {
            if (param1 < 0) {
                return '<span> - </span>';
            } else {
                return '<span class="text-danger font-weight-bold">' + parseFloat(param1 - param2).toFixed(2) + '</span>';
            }
        }
    }

    $scope.calculateSumPreData = function (param1, param2, param3) {
        if (param1 == -1) {
            param1 = 0;
        }
        if (param2 == -1) {
            param2 = 0;
        }
        if (param3 == -1) {
            param3 = 0;
        }
        return parseFloat(param1 + param2 + param3).toFixed(2);
    }

    function fromDateToString(date) {
        date = new Date(+date);
        date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
        let dateAsString = date.toISOString().substr(0, 19);
        return dateAsString;
    }

    function getPreData(construction, startTime, endTime, chartId) {
        //use for check cons
        var typeOfCons = construction.TypeOfConstructionId;
        //use fo chart
        var chartXaxisCategories = [];
        var chartDataLakeWaterLevel = [];
        var chartDataMinimumDischargeMaintenanceFlow = [];
        var chartDataDischargeFlowThroughTheFactory = [];
        var chartDataDischargeFlowThroughOverflow = [];
        var chartDataDownstreamFlow = [];
        var chartDataMinningFlow = [];
        var chartDataMiningWellWaterLevel = [];
        var chartDataMonitoringWellWaterLevel = [];
        var chartDataWastewaterFlowAfterTreatment = [];
        var chartDataWastewaterFlowAtTheReceivingSource = [];
        var operateChart = {};
        var chartHeight = 500;

        monitoringSystemService.getStorePreData(construction.ConstructionCode, startTime, endTime, 1, 0).then(function (items) {
            $scope.DataPre = [];
            $scope.TotalItem = items.data.TotalCount;

            const result = Object.values(items.data.ListData.reduce((item, e) => {
                if (!item[e.Time]) {
                    item[e.Time] = {
                        Time: e.Time,
                        ConstructionCode: e.ConstructionCode,
                        trangthaithietbi: e.DeviceStatus,
                        mucnuochoyeucau : (construction.UpstreamWL != null ? construction.UpstreamWL : 0),
                        qxattyeucau : (construction.MinimumFlow != null ? construction.MinimumFlow : 0),
                        qnhamayyeucau : (construction.MaximumFlow != null ? construction.MaximumFlow : 0),
                        qquatranyeucau : (construction.MaximumDischargeFlow != null ? construction.MaximumDischargeFlow : 0),
                        khaithacyeucau : (construction.MiningMaxlow != null ? construction.MiningMaxlow : 0),
                        mucnuocgieng : (construction.WellWL != null ? construction.WellWL : 0)
                    };
                }

                if (typeOfCons == 4) {
                    switch (e.StationCode) {
                        case "MUATHUONGLUU":
                            item[e.Time].muathuongluu = e.Value;
                            break;
                        case "THUONGLUU":
                            item[e.Time].mucnuocthuongluu = e.Value;
                            break;
                        case "HALUU":
                            item[e.Time].mucnuochaluu = e.Value;
                            break;
                        case "DUNGTICH":
                            item[e.Time].dungtich = e.Value;
                            break;
                        case "QDEN":
                            item[e.Time].qden = e.Value;
                            break;
                        case "QUATRAN":
                            item[e.Time].qquatran = e.Value;
                            break;
                        case "NHAMAY":
                            item[e.Time].qnhamay = e.Value;
                            break;
                        case "DCTT":
                            item[e.Time].qxatt = e.Value;
                            break;
                        case "LUULUONGHADU":
                            item[e.Time].qhadu = e.Value;
                            break;
                        case "DUKIENLUULUONGHADU":
                            item[e.Time].qhadudukien = e.Value;
                            break;
                        case "MUCNUOCHODUKIEN12GIO":
                            item[e.Time].mucnuochodukien12gio = e.Value;
                            break;
                    }
                } else if (typeOfCons == 5) {
                    //Reservoir
                    switch (e.StationCode) {
                        case "QUATRAN":
                            item[e.Time].qquatran = e.Value;
                            break;
                        case "KHAITHAC":
                            item[e.Time].khaithac = e.Value;
                            break;
                        case "DCTT":
                            item[e.Time].qxatt = e.Value;
                            break;
                        case "THUONGLUU":
                            item[e.Time].mucnuocthuongluu = e.Value;
                            break;
                    }
                } else if (typeOfCons == 6 || typeOfCons == 11 || typeOfCons == 13) {
                    //Drain, PumpStation, WaterSupplyStation
                    switch (e.StationCode) {
                        case "NH4":
                            item[e.Time].NH4 = e.Value;
                            break;
                        case "TSS":
                            item[e.Time].TSS = e.Value;
                            break;
                        case "DO":
                            item[e.Time].DO = e.Value;
                            break;
                        case "BOD5":
                            item[e.Time].BOD5 = e.Value;
                            break;
                        case "pH":
                            item[e.Time].pH = e.Value;
                            break;
                        case "NHIETDO":
                            item[e.Time].nhietdo = e.Value;
                            break;
                        case "KHAITHAC":
                            item[e.Time].khaithac = e.Value;
                            break;
                    }
                } else if (typeOfCons == 8) {
                    //Groundwater Exploit
                    switch (e.StationCode) {
                        case "NH4":
                            item[e.Time].NH4 = e.Value;
                            break;
                        case "TSS":
                            item[e.Time].TSS = e.Value;
                            break;
                        case "DO":
                            item[e.Time].DO = e.Value;
                            break;
                        case "COD":
                            item[e.Time].COD = e.Value;
                            break;
                        case "BOD5":
                            item[e.Time].BOD5 = e.Value;
                            break;
                        case "pH":
                            item[e.Time].pH = e.Value;
                            break;
                        case "NHIETDO":
                            item[e.Time].nhietdo = e.Value;
                            break;
                        case "GIENGQUANTRAC":
                            item[e.Time].giengquantrac = e.Value;
                            break;
                        case "GIENGKHAITHAC":
                            item[e.Time].giengkhaithac = e.Value;
                            break;
                        case "KHAITHAC":
                            item[e.Time].khaithac = e.Value;
                            break;
                    }
                } else if (typeOfCons == 3) {
                    //Discharge Water
                    switch (e.StationCode) {
                        case "COLIFORM":
                            item[e.Time].Coliform = e.Value;
                            break;
                        case "TSS":
                            item[e.Time].TSS = e.Value;
                            break;
                        case "DO":
                            item[e.Time].DO = e.Value;
                            break;
                        case "COD":
                            item[e.Time].COD = e.Value;
                            break;
                        case "BOD5":
                            item[e.Time].BOD5 = e.Value;
                            break;
                        case "NUOCTHAITIEPNHAN":
                            item[e.Time].xathaitiepnhan = e.Value;
                            break;
                        case "NUOCTHAISAUXULY":
                            item[e.Time].xathaixuly = e.Value;
                            break;
                    }
                }



                return item;
            }, {}));
            
            $scope.DataPre = result;

            $scope.DataPre.forEach(function (e) {
                chartXaxisCategories.push(formatDateTime(e.Time));
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
                } else if (typeOfCons == 6 || typeOfCons == 11 || typeOfCons == 13) {
                    //Drain, PumpStation, WaterSupplyStation
                    chartDataMinningFlow.push(checkNegative(e.khaithac));
                } else if (typeOfCons == 8) {
                    // Groundwater Exploit
                    chartDataMinningFlow.push(checkNegative(e.khaithac));
                    chartDataMiningWellWaterLevel.push(checkNegative(e.giengkhaithac));
                    chartDataMonitoringWellWaterLevel.push(checkNegative(e.giengquantrac));
                } else if (typeOfCons == 3) {
                    // DischargeWater
                    chartDataWastewaterFlowAfterTreatment.push(checkNegative(e.xathaixuly));
                    chartDataWastewaterFlowAtTheReceivingSource.push(checkNegative(e.xathaitiepnhan));
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

            var chart = new ApexCharts(document.querySelector("#" + chartId), operateChart);
            var chartIrrigation = new ApexCharts(document.querySelector("#" + chartId), operateChart);
            var chartDrain = new ApexCharts(document.querySelector("#" + chartId), operateChart);
            var chartGroundwaterExploit = new ApexCharts(document.querySelector("#" + chartId), operateChart);
            var chartWastewaterFlow = new ApexCharts(document.querySelector("#" + chartId), operateChart);

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
                    chartIrrigation.render();
                    chartIrrigation.updateOptions({
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
            } else if (typeOfCons == 6 || typeOfCons == 11 || typeOfCons == 13) {
                setTimeout(function () {
                    chartDrain.render();
                    chartDrain.updateOptions({
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
                                name: 'Lưu lượng khai thác (m3/s)',
                                data: chartDataMinningFlow.reverse(),
                            },
                        ],
                    });
                }, 300);
            } else if (typeOfCons == 8) {
                setTimeout(function () {
                    chartGroundwaterExploit.render();
                    chartGroundwaterExploit.updateOptions({
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
                                name: 'Lưu lượng khai thác giếng khoan (m3/s)',
                                data: chartDataMinningFlow.reverse(),
                            },
                            {
                                name: 'Mực nước trong giếng khai thác (m)',
                                data: chartDataMiningWellWaterLevel.reverse(),
                            },
                            {
                                name: 'Mực nước trong giếng quan trắc (m)',
                                data: chartDataMonitoringWellWaterLevel.reverse(),
                            },
                        ],
                    });
                }, 300);
            } else if (typeOfCons == 3) {
                setTimeout(function () {
                    chartWastewaterFlow.render();
                    chartWastewaterFlow.updateOptions({
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
                                name: 'Lưu lượng nước thải sau xử lý (m3/s)',
                                data: chartDataWastewaterFlowAfterTreatment.reverse(),
                            },
                            {
                                name: 'Lưu lượng nước thải tại nguồn tiếp nhận(m3/s)',
                                data: chartDataWastewaterFlowAtTheReceivingSource.reverse(),
                            },
                        ],
                    });
                }, 300);
            }
            //End chart operate  -- Bieu do van hanh
        });
    }

    init();
    function init() {
        $scope.currentPage = 1;
        $scope.MapId = '';
        let pathName = location.pathname.split('/')[2];
        let param = location.search;
        if (param == '') {
            $scope.Keyword = '';
        }
        else {
            $scope.Keyword = param.split('?')[1];
        }
        switch (pathName) {
            case "nuoc-mat":
                $scope.MapId = 'Surfacewater';
                $scope.isPredata = true;
                $scope.TypeOfConstructionId = 1;
                break;
            case "nuoc-duoi-dat":
                $scope.MapId = 'Groundwater';
                $scope.TypeOfConstructionId = 2;
                break;
            case "xa-thai":
                $scope.MapId = 'Dischargewater';
                $scope.TypeOfConstructionId = 3;
                break;
            default:
                $scope.MapId = 'MonitoringSystem';
                if (mymap) { mymap.remove(); }
                initMap($scope.MapId)
                $scope.numPerPage = 0;
                $scope.isDetail = false;
                $scope.isHome = true;
                GetDataConstruction();
                break;
        }
        if (pathName != '' && pathName != undefined) { // Is not index page
            if (mymap) { mymap.remove(); }
            initMap($scope.MapId);
            GetTypeOfConstruction($scope.TypeOfConstructionId);
            countOperatingCons();
            GetDataConstruction();
            GetWaterQualities('A1');
        }
    }

    $scope.openAside = function (asideId, typeID, totalCapacity, construction, chartId) {
        $scope.Keyword = '';
        $scope.currentPage = 1;

        if (construction !== undefined) {
            $scope.ConsName = construction.ConstructionName;
            $scope.con = construction;
            getPreData(construction, yesterday, today, chartId);
        }

        //if (totalCapacity == 1) {
        //    TotalCapacity = 1;
        //} else {
        //    TotalCapacity = 0;
        //}

        if (typeID == 4) {
            $scope.TypeOfConstructionId = 4;
            $scope.title = 'THUỶ ĐIỆN';
        }
        if (typeID == 5) {
            $scope.TypeOfConstructionId = 5;
            $scope.title = 'HỒ THUỶ LỢI';
        }
        if (typeID == 6) {
            $scope.TypeOfConstructionId = 6;
            $scope.title = 'TRẠM BƠM';
        }
        if (typeID == 11) {
            $scope.TypeOfConstructionId = 11;
            $scope.title = 'CẤP NƯỚC SINH HOẠT';
        }
        if (typeID == 13) {
            $scope.TypeOfConstructionId = 13;
            $scope.title = 'CỐNG LẤY NƯỚC';
        }
        if (typeID == 8) {
            $scope.TypeOfConstructionId = 8;
            $scope.title = 'KHAI THÁC NƯỚC DƯỚI ĐẤT';
        }
        if (typeID == 3) {
            $scope.TypeOfConstructionId = 3;
            $scope.title = 'XẢ THẢI';
        }

        $scope.asideHeader = 'GIÁM SÁT KHAI THÁC, SỬ DỤNG TÀI NGUYÊN NƯỚC ĐỐI VỚI CÔNG TRÌNH ' + $scope.title;

        openAside(asideId);
    }

    $scope.openAsideV2 = function (asideV2Id, asideV1Id) {
        openAside(asideV2Id);
        closeAside(asideV1Id);
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }
    $scope.closeAsideV2 = function (asideV2Id, asideV1Id) {
        closeAside(asideV2Id);
        openAside(asideV1Id);
    }
    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-withmenu');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-withmenu');
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

    $interval(function () {
        $scope.currentTime = formatDateTimeWithSeconds(Date.now());
    }, 100)

    $scope.checkDeviceStatus = function (status) {
        if (status == 0) {
            return '<div class="license_status hsd-success"> Đang đo </div>';
        } else if (status == 1) {
            return '<div class="license_status hsd-warning"> Hiệu chuẩn </div>';
        } else {
            return '<div class="license_status hsd-danger"> Báo lỗi thiết bị </div>';
        }
    }

    function checkNegative(value) {
        return (value == -1) ? null : value;
    }

    // Show/hide construction name on map
    $scope.toggleShow = function () {
        $(".title-of-marker").fadeToggle("slow");
    }
});