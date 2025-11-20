app.controller("HomeCntrl", function ($scope, oneGateService, licenseService, licenseFeeService, constructionService, typeOfConstructionService, basinService, toastr, $interval) {
    'use strict'

    var TypeOfConstructionId = 0,
        LicensingTypeId = 0,
        DistrictId = 0,
        BasinId = 0,
        AquiferId = -1,
        Effect = 0,
        LicensingAuthorities = -1,
        ParentId = 0,
        ConstructionId = 0,
        BusinessId = 0,
        d = new Date,
        Status = true;
    $scope.isDetail = false;
    $scope.Keyword = '';
    $scope.currentPage = 1;
    $scope.numPerPage = 0;
    $scope.countStableConnection = 0;
    $scope.countFalseOperation = 0;
    $scope.countLostConnection = 0;
    $scope.DataYear = [];
    $scope.ShowConsType = true;
    $scope.TypeOfConstructionFilter = 'Chọn loại CT';
    $scope.DamType = "";

    //use for get preData
    var yesterday = fromDateToString(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));
    var today = fromDateToString(new Date());

    $scope.StartYearFilter = 'Từ năm: ' + (d.getFullYear() - 25);
    $scope.EndYearFilter = 'Đến năm: ' + d.getFullYear();
    $scope.StartYear = (d.getFullYear() - 25);
    $scope.EndYear = d.getFullYear();
    for (let i = 1975; i <= d.getFullYear(); i++) {
        $scope.DataYear.push({ Year: i });
    }
    //For filter
    $scope.LicensingAuthoritiesFilter = 'Chọn Cơ quan CP';
    $scope.LicensingTypeFilter = 'Chọn loại hình CP';
    $scope.LicenseEffectFilter = 'Chọn hiệu lực GP';
    $scope.TypeOfConstructionFilter = 'Chọn loại CT';
    $scope.DistrictFilter = 'Chọn huyện';
    $scope.AquiferFilter = 'Chọn tầng chứa nước';
    $scope.BasinFilter = 'Chọn tiểu vùng quy hoạch';


    $scope.ListLicensingAuthorities = [
        { Id: -1, Name: "Chọn Cơ quan CP" },
        { Id: 0, Name: "BTNMT" },
        { Id: 1, Name: "UBND Tỉnh" }
    ];
    $scope.ListLicenseEffect = [
        { Id: -1, Name: "Chọn hiệu lực GP" },
        { Id: 1, Name: "Còn hiệu lực" },
        { Id: 2, Name: "Hết hiệu lực" },
        { Id: 3, Name: "Sắp hết hiệulực" },
        { Id: 4, Name: "Đã thu hồi" }
    ];

    $scope.ShowAdvanceSearch = function () {
        if ($scope.AdvanceSearch == true) {
            $scope.AdvanceSearch = false;
        } else {
            $scope.AdvanceSearch = true;
        }
    }

    //filter license on page show list license
    $scope.filterConsByType = function (Id, Name) {
        if (Id > 3) {
            TypeOfConstructionId = Id;
            $scope.TypeOfConstructionFilter = Name;
        } else {
            let pathName = location.pathname.split('/')[2];
            switch (pathName) {
                case "nuoc-mat":
                    TypeOfConstructionId = 1;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
                case "xa-thai":
                    TypeOfConstructionId = 3;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
            }
            $scope.TypeOfConstructionFilter = Name;
        }
    }

    $scope.filterLicenseByType = function (Id, Name) {
        LicensingTypeId = Id;
        $scope.LicensingTypeFilter = Name;
    }

    $scope.filterLicenseByEffect = function (Id, Name) {
        Effect = Id;
        $scope.LicenseEffectFilter = Name;
    };

    $scope.filterLicenseByLicensingAuthorities = function (Id, Name) {
        LicensingAuthorities = Id;
        $scope.LicensingAuthoritiesFilter = Name;
    };
    $scope.filterLicenseByDistrict = function (Id, Name) {
        DistrictId = Id;
        $scope.DistrictFilter = Name;
    };
    $scope.filterLicenseByAquifer = function (Id, Name) {
        AquiferId = Id;
        $scope.AquiferFilter = Name;
    };
    $scope.filterLicenseByBasin = function (Id, Name) {
        BasinId = Id;
        $scope.BasinFilter = Name;
    };


    $scope.filterLicenseByDataYear = function (StartYear, EndYear) {
        $scope.StartYearFilter = 'Từ năm: ' + StartYear;
        $scope.EndYearFilter = 'Đến năm: ' + EndYear;
        $scope.StartYear = StartYear;
        $scope.EndYear = EndYear;
    }

    //search data license
    $scope.Search = function () {
        if ($scope.StartYear < 1975 || $scope.StartYear > d.getFullYear()) {
            toastr.error("Chỉ chấp nhận khoảng thời gian từ năm 1975 đến nay", "Lỗi")
            return;
        }
        else if ($scope.EndYear < $scope.StartYear) {
            toastr.error("Năm bắt đầu phải nhỏ hơn năm đến", "Lỗi")
            return;
        }
        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });
        let pathName = location.pathname.split('/')[2];
        if (pathName == undefined || pathName == '') { countLicenseForChart(); }

        countLicenseForChart();
    }

    //Licensing type
    GetLicensingType();
    function GetLicensingType() {
        licenseService.getLicensingType('', 0, 0).then(function (items) {
            $scope.LicensingTypes = items.data.ListData;
        });
    }
    //data district
    GetDistricts(1)
    function GetDistricts(CityId) {
        licenseService.getDistrict(CityId, 0, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        });
    }
    //data basin
    GetBasins();
    function GetBasins() {
        basinService.getAllBasins(Status, '', false, 0, 0).then(function (items) {
            $scope.Basins = items.data.ListData;
        });
    }
    //data aquifers
    Aquifers();
    function Aquifers() {
        licenseService.getAquifers(true, '', 0, 0).then(function (items) {
            $scope.AllAquifers = items.data.ListData;
        });
    }

    //Count License
    countLicense()
    function countLicense() {
        var LicenseFrom = [0, 0];

        licenseService.getAllLicenses(0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, false, true, '', 1, 0).then(function (items) {
            $scope.TotalLicenses = items.data.TotalCount;
            items.data.ListData.forEach(function (e) {
                if (e.LicensingAuthorities == 0 || e.LicensingAuthorities == 1) {
                    if (e.LicensingAuthorities == 0) {
                        LicenseFrom[0]++;
                    } else if (e.LicensingAuthorities == 1) {
                        LicenseFrom[1]++;
                    }
                }
            })

            //draw chart
            var options = {
                series: LicenseFrom,
                labels: ['BTNMT', 'UBND'],
                legend: {
                    show: false
                },
                colors: ['#53BF9D', '#94B49F'],
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: 15,
                    },
                    formatter: function (val, opt) {
                        const name = opt.w.globals.labels[opt.seriesIndex];
                        const value = opt.w.globals.seriesTotals[opt.seriesIndex];
                        return [name, value];
                    },
                },
                chart: {
                    width: 260,
                    type: 'pie',
                },
            };

            var chart = new ApexCharts(document.querySelector("#chartAllLicense"), options);
            chart.render();
        });
    }

    //Count LicenseFee
    countLicenseFee()
    function countLicenseFee() {
        var TotalLicenseFee = [];
        var LicenseFee = { BTNMT: [], UBND: [] };
        var TotalMoney = [0, 0]
        licenseFeeService.getAllLicenseFee(-1, 0, 0, true, '', 1, 0).then(function (items) {
            items.data.ListData.forEach(function (e) {
                TotalLicenseFee.push(e.TotalMoney);
                var item = { LicensingAuthorities: e.LicensingAuthorities, TotalMoney: e.TotalMoney };
                if (item.LicensingAuthorities == 0 || item.LicensingAuthorities == 1) {
                    if (item.LicensingAuthorities == 0) {
                        LicenseFee.BTNMT.push(item.TotalMoney);
                    } else if (item.LicensingAuthorities == 1) {
                        LicenseFee.UBND.push(item.TotalMoney);
                    }
                }
            })
            $scope.TotalLicenseFee = TotalLicenseFee.reduce((partialSum, a) => partialSum + a, 0);
            TotalMoney[0] = LicenseFee.BTNMT.reduce((partialSum, a) => partialSum + a, 0);
            TotalMoney[1] = LicenseFee.UBND.reduce((partialSum, a) => partialSum + a, 0);
            $scope.TotalMoney = TotalMoney;
            //draw chart
            var options = {
                series: TotalMoney,
                labels: ['BTNMT', 'UBND'],
                legend: {
                    show: false
                },
                colors: ['#32abda', '#e5963e'],
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: 15,
                    },
                    formatter: function (val, opt) {
                        const name = opt.w.globals.labels[opt.seriesIndex];
                        const value = getNumberWithCommas(opt.w.globals.seriesTotals[opt.seriesIndex]);
                        return [name, value];
                    },
                },
                chart: {
                    width: 260,
                    type: 'pie',
                }
            };
            var chart = new ApexCharts(document.querySelector("#chartLicenseFee"), options);
            chart.render();
        });
    }
    function getNumberWithCommas(num) {
        if (num == null || num == 0)
            return '0 ₫'
        let len = num.toLocaleString('en-US').split(',').length
        if (len == 1)
            return '~ ' + round(num) + " ₫";
        else if (len == 2)
            return '~ ' + round(num / 1000) + " ngàn ₫";
        else if (len == 3)
            return '~ ' + round(num / 1000000) + " triệu đ";
        else if (len == 4)
            return '~ ' + round(num / 1000000000) + " tỷ ₫";
        else
            return '~ ' + round(num / 1000000000000) + " nghìn tỷ ₫";
    }

    function round(num) {
        return (Math.round(num * 100) / 100).toLocaleString('tr-TR');
    }

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
    }

    var consTypes = ["thuydien", "hochua", "trambom", "tramcapnuoc", "cong", "nhamaynuoc", "khaithac", "thamdo", "xathai"];

    var idDischargeCons = [17, 18, 19, 20, 21, 22, 23, 24];

    GetDataConstruction();
    function GetDataConstruction() {
        $scope.$watch('currentPage + numPerPage', function () {
            constructionService.getAllConstructions(TypeOfConstructionId, -1, 0, 0, 0, -1, -1, true, -1, '', 1, 0, $scope.DamType).then(function (items) {
                $scope.DataConstruction = items.data.ListData;
                $scope.TotalConstruction = items.data.TotalCount;
                $scope.DataConstruction.forEach(function (e) {
                    if (e.TypeOfConstructionId == 4) {
                        if (e.IsError == true) {
                            $scope.countFalseOperation++;
                        } else if (e.IsDisconnect == true) {
                            $scope.countLostConnection++;
                        } else {
                            $scope.countStableConnection++;
                        }
                    }
                })

                showMarker();

                consTypes.forEach(function (e) {
                    showMarkerHomepage($scope.DataConstruction, e);
                })

                mymap.on('popupopen', function (e) {
                    getPreData(e.popup._source.feature.properties.Construction, yesterday, today, 'chartPreData_' + e.popup._source.feature.properties.Construction.ConstructionCode);
                });
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function showMarker() {
        var markerGroups = {
            "thuydien": []
        };
        var pointLayer;

        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });

        $scope.ConstructionNum = 0;
        // Loop through constructions, push data to show points on map push into array
        $scope.DataConstruction.forEach(function (e) {
            if (e.TypeSlug == 'thuydien') {
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

                markerGroups['thuydien'].push(marker);
                $scope.ConstructionNum++;
            }
        });

        pointLayer = L.geoJSON(markerGroups['thuydien'], {
            pointToLayer: function (feature, latlng) {
                var lay = L.marker(latlng, {
                    icon: L.divIcon({
                        html: checkWarningMarker(feature.properties.Construction, feature),
                        className: 'text-marker marker-' + feature.properties.Construction.ParentTypeSlug + ' marker-' + feature.properties.Construction.TypeSlug + ' ' + addClassMonitoringStatus(feature.properties.Construction),
                        id: feature.properties.Num
                    })
                });
                return lay;
            },
            onEachFeature: onEachFeature
        });
        mymap.addLayer(pointLayer);
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

        oneGateService.getStorePreData(construction.ConstructionCode, startTime, endTime, 1, 0).then(function (items) {
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
                                    obj.Unit = obj.Unit + ',' + curr.Unit;
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
                } else if (typeOfCons == 6 || typeOfCons == 11 || typeOfCons == 13) {
                    //Drain, PumpStation, WaterSupplyStation
                    itemData.NH4 = parseFloat(val[0]).toFixed(2);
                    itemData.TSS = parseFloat(val[1]).toFixed(2);
                    itemData.DO = parseFloat(val[2]).toFixed(2);
                    itemData.COD = parseFloat(val[3]).toFixed(2);
                    itemData.BOD5 = parseFloat(val[4]).toFixed(2);
                    itemData.pH = parseFloat(val[5]).toFixed(2);
                    itemData.nhietdo = parseFloat(val[6]).toFixed(2);
                    itemData.khaithac = parseFloat(val[7]).toFixed(2);
                } else if (typeOfCons == 8) {
                    //Groundwater Exploit
                    itemData.NH4 = parseFloat(val[0]).toFixed(2);
                    itemData.TSS = parseFloat(val[1]).toFixed(2);
                    itemData.DO = parseFloat(val[2]).toFixed(2);
                    itemData.COD = parseFloat(val[3]).toFixed(2);
                    itemData.BOD5 = parseFloat(val[4]).toFixed(2);
                    itemData.pH = parseFloat(val[5]).toFixed(2);
                    itemData.nhietdo = parseFloat(val[6]).toFixed(2);
                    itemData.giengquantrac = parseFloat(val[7]).toFixed(2);
                    itemData.giengkhaithac = parseFloat(val[8]).toFixed(2);
                    itemData.khaithac = parseFloat(val[9]).toFixed(2);
                } else if (typeOfCons == 3) {
                    //Discharge Water
                    itemData.Coliform = parseFloat(val[0]).toFixed(2);
                    itemData.TSS = parseFloat(val[1]).toFixed(2);
                    itemData.DO = parseFloat(val[2]).toFixed(2);
                    itemData.COD = parseFloat(val[3]).toFixed(2);
                    itemData.BOD5 = parseFloat(val[4]).toFixed(2);
                    itemData.xathaitiepnhan = parseFloat(val[5]).toFixed(2);
                    itemData.xathaixuly = parseFloat(val[6]).toFixed(2);
                }

                itemData.mucnuochoyeucau = (construction.UpstreamWL != null ? construction.UpstreamWL : 0);
                itemData.qxattyeucau = (construction.MinimumFlow != null ? construction.MinimumFlow : 0);
                itemData.qnhamayyeucau = (construction.MaximumFlow != null ? construction.MaximumFlow : 0);
                itemData.qquatranyeucau = (construction.MaximumDischargeFlow != null ? construction.MaximumDischargeFlow : 0);
                itemData.khaithacyeucau = (construction.MiningMaxlow != null ? construction.MiningMaxlow : 0);
                itemData.mucnuocgieng = (construction.WellWL != null ? construction.WellWL : 0);
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

    function addClassMonitoringStatus(item) {
        if (item.IsError == true) {
            return "marker-canh-bao";
        } else if (item.IsDisconnect == true) {
            return "marker-mat-ket-noi";
        }
        else {
            return "marker-binh-thuong";
        }
    }

    // Check operation status of monitoring works and show marker warning
    function checkWarningMarker(item, feat) {
        if (item.IsError == true) {
            return '<img alt="map-marker" class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/thuydien-warning.gif" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feat.properties.Name + '</div>';
        } else if (item.IsDisconnect == true) {
            return '<img alt="map-marker" class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/thuydien-lostconnect.png" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feat.properties.Name + '</div>';
        }
        return '<img alt="map-marker" class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/' + item.TypeSlug + '.png" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feat.properties.Name + '</div>'
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

    function popupContent(cons) {
        var html =
            `<div class="card-primary card-outline card-outline-tabs map-info-card w-100 border-0">
            <div class="card-header p-0 border-bottom-0">
            <ul class="nav nav-tabs" id="custom-tabs-three-tab" role="tablist">
            <li class="nav-item"><a class="nav-link py-1 px-2 active" id="custom-tabs-three-home-tab" data-toggle="tab" href="#custom-tabs-three-home">Thông tin</a></li>
            <li class="nav-item"> <a class="nav-link py-1 px-2" id="custom-tabs-three-profile-tab" data-toggle="tab" href="#custom-tabs-three-chart">Số liệu vận hành</a> </li>
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
                    <td class="col-2 py-1 text-center font-weight-bold `+ checkOperatingData(cons.MaximumDischargeFlowPre, cons.MaximumDischargeFlow) + `"><span>` + $scope.checkValuePreData(cons.MaximumDischargeFlowPre) + `</span><br><span>(m<sup>3</sup>/s)</span></td>
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

    function checkData(data) {
        if (data !== null && data !== '' && data !== undefined) {
            return data;
        } else {
            return "-";
        }
    }

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }

    // Show/hide construction name on map
    $scope.toggleShow = function () {
        $(".title-of-marker").fadeToggle("slow");
    }

    function formatDateTime(time) {
        var t = new Date(time);
        var year = t.getFullYear();
        var month = t.getMonth() + 1;
        var m = (month < 10) ? "0" + month : month;
        var day = (t.getDate() < 10) ? "0" + t.getDate() : t.getDate();
        var hour = (t.getHours() < 10) ? "0" + t.getHours() : t.getHours()
        var min = (t.getMinutes() < 10) ? "0" + t.getMinutes() : t.getMinutes()
        return day + '/' + m + '/' + year + ' ' + hour + ':' + min;
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
            return '<span>' + parseFloat(value).toFixed(2) + '</span>';
        }
    }

    function fromDateToString(date) {
        date = new Date(+date);
        date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
        let dateAsString = date.toISOString().substr(0, 19);
        return dateAsString;
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

    function checkNegative(value) {
        return (value == -1) ? null : value;
    }

    $scope.calculateWidth = function (value, total) {
        return "width: " + value / total * 100 + "%";
    }

    // Show construction map
    var constructionMap = null;
    initConstructionMap();
    function initConstructionMap() {
        constructionMap = L.map('Map_Construction', {
            maxZoom: 15
        }).setView([21.248632, 104.118988], 9);

        var layer = L.esri.basemapLayer('Imagery').addTo(constructionMap);
        var layerLabels = L.esri.basemapLayer('Imagery' + 'Labels');
        constructionMap.addLayer(layerLabels);

        // Load kml file
        fetch('/LocalFiles/kml/Province.kml')
            .then(res => res.text())
            .then(kmltext => {
                // Create new kml overlay
                const parser = new DOMParser();
                const kml = parser.parseFromString(kmltext, 'text/xml');
                const track = new L.KML(kml);
                constructionMap.addLayer(track);
            });
    }

    // Get data for lincese chart
    countLicenseForChart();

    function countLicenseForChart() {
        $scope.filterLicenseInIndexLicense = function () {
            if ($scope.StartYear < 1975 || $scope.StartYear > d.getFullYear()) {
                toastr.error("Chỉ chấp nhận khoảng thời gian từ năm 1975 đến nay", "Lỗi")
                return;
            }
            else if ($scope.EndYear < $scope.StartYear) {
                toastr.error("Năm bắt đầu phải nhỏ hơn năm đến", "Lỗi")
                return;
            }
            else {
                LicensingTypeId = $scope.LicensingTypeId;
                TypeOfConstructionId = $scope.TypeOfConstructionId;
                if ($scope.TypeOfConstructionId == 0 || TypeOfConstructionId == undefined) {
                    TypeOfConstructionId = $scope.ParentTypeOfConstructionId;
                }
                DistrictId = $scope.DistrictId;
                BasinId = $scope.BasinId;
                AquiferId = $scope.AquiferId;
                LicensingAuthorities = $scope.LicensingAuthorities || 0;
                countLicenseForChart()
            }
        }

        var idSurfacewaterCons = [4, 5, 6, 11, 12, 13, 14, 15];
        var idGroundwaterCons = [8, 9, 10, 16];
        var idDischargeCons = [17, 18, 19, 20, 21, 22, 23, 24];
        if (TypeOfConstructionId == undefined || TypeOfConstructionId == '') { TypeOfConstructionId = 0; }
        if (LicensingTypeId == undefined || LicensingTypeId == '') { LicensingTypeId = 0; }
        if (DistrictId == undefined || DistrictId == '') { DistrictId = 0; }
        if (BasinId == undefined || BasinId == '') { BasinId = 0; }
        if (AquiferId == undefined || AquiferId == '') { AquiferId = -1; }

        licenseService.getAllLicenses(0, 0, 0, LicensingTypeId, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, false, true, '', 1, 0).then(function (items) {
            //data for chart
            var dataForChart = {};
            items.data.ListData.forEach(function (e) {
                if (e.SignDate != null && e.SignDate != '') {
                    if (dataForChart[new Date(e.SignDate).getFullYear()] !== undefined) {
                        if (idSurfacewaterCons.includes(e.TypeOfConstructionId)) {
                            dataForChart[new Date(e.SignDate).getFullYear()][0] += 1;
                        }
                        if (e.TypeOfConstructionId == 8) {
                            dataForChart[new Date(e.SignDate).getFullYear()][1] += 1;
                        }
                        if (e.TypeOfConstructionId == 9) {
                            dataForChart[new Date(e.SignDate).getFullYear()][2] += 1;
                        }
                        if (e.TypeOfConstructionId == 10) {
                            dataForChart[new Date(e.SignDate).getFullYear()][3] += 1;
                        }
                        if (idDischargeCons.includes(e.TypeOfConstructionId)) {
                            dataForChart[new Date(e.SignDate).getFullYear()][4] += 1;
                        }
                    }
                    else {
                        if (idSurfacewaterCons.includes(e.TypeOfConstructionId)) {
                            dataForChart[new Date(e.SignDate).getFullYear()] = [1, 0, 0, 0, 0];
                        }
                        if (e.TypeOfConstructionId == 8) {
                            dataForChart[new Date(e.SignDate).getFullYear()] = [0, 1, 0, 0, 0];
                        }
                        if (e.TypeOfConstructionId == 9) {
                            dataForChart[new Date(e.SignDate).getFullYear()] = [0, 0, 1, 0, 0];
                        }
                        if (e.TypeOfConstructionId == 10) {
                            dataForChart[new Date(e.SignDate).getFullYear()] = [0, 0, 0, 1, 0];
                        }
                        if (idDischargeCons.includes(e.TypeOfConstructionId)) {
                            dataForChart[new Date(e.SignDate).getFullYear()] = [0, 0, 0, 0, 1];
                        }
                    }
                }
            })
            var Year = Object.keys(dataForChart);

            var sufacewaterForChart = [];
            var exploidGroundwaterForChart = [];
            var probeGroundwaterForChart = [];
            var dilringPracticeGroundwaterForChart = [];
            var dischargewaterForChat = [];

            Object.values(dataForChart).forEach(function (e) {
                sufacewaterForChart.push(e[0]);
                exploidGroundwaterForChart.push(e[1]);
                probeGroundwaterForChart.push(e[2]);
                dilringPracticeGroundwaterForChart.push(e[3]);
                dischargewaterForChat.push(e[4]);
            })

            let chart;
            var options = {
                series: [{
                    name: 'Khai thác và sử dụng nước mặt',
                    data: sufacewaterForChart
                }, {
                    name: 'Khai thác sử dụng nước dưới đất',
                    data: exploidGroundwaterForChart
                }, {
                    name: 'Thăm dò nước dưới đất',
                    data: probeGroundwaterForChart
                }, {
                    name: 'Hành nghề khoan',
                    data: dilringPracticeGroundwaterForChart
                }, {
                    name: 'Xả thải vào nguồn nước',
                    data: dischargewaterForChat
                }],
                chart: {
                    type: 'bar',
                    height: 333,
                    stacked: true,
                    events: {
                        mounted: (chartContext, config) => {
                            setTimeout(() => {
                                const seriesTotals = config.globals.stackedSeriesTotals;
                                const isHorizontal = options.plotOptions.bar.horizontal;
                                chart.clearAnnotations();

                                try {
                                    Year.forEach((category, index) => {
                                        chart.addPointAnnotation(
                                            {
                                                y: isHorizontal
                                                    ? calcHorizontalY(config, index)
                                                    : seriesTotals[index],
                                                x: isHorizontal ? 0 : category,
                                                label: {
                                                    text: `Tổng: ${seriesTotals[index]}`
                                                }
                                            },
                                            false
                                        );
                                    });
                                } catch (error) {
                                    console.log(`Add point annotation error: ${error.message}`);
                                }
                            });
                        }
                    }
                },
                grid: {
                    show: false,
                },
                colors: ['rgb(106, 179, 230)', 'rgb(0, 61, 126)', 'rgb(125, 95, 58)', 'rgb(0, 178, 151)', 'rgb(244, 153, 23)'],
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%',
                        endingShape: 'rounded',
                        dataLabels: {
                            position: 'bottom', // top, center, bottom
                        },
                    },
                },
                dataLabels: {
                    enabled: true
                },
                stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: Year,
                },
                legend: {
                    position: 'bottom',
                    //offsetY: 40
                },
                yaxis: {
                    //reversed: true,
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return "Đã cấp " + val + " giấy phép"
                        }
                    }
                }
            };



            setTimeout(function () {
                chart = new ApexCharts(document.querySelector("#chartCountNumLicenseFollowYear"), options);
                chart.render();
                chart.updateOptions({
                    chart: {
                        animations: {
                            enabled: true,
                            easing: 'easeinout',
                            speed: 800,
                            animateGradually: {
                                enabled: true,
                                delay: 150
                            },
                            dynamicAnimation: {
                                enabled: true,
                                speed: 350
                            }
                        }
                    },
                    series: [{
                        name: 'Khai thác và sử dụng nước mặt',
                        data: sufacewaterForChart
                    }, {
                        name: 'Khai thác sử dụng nước dưới đất',
                        data: exploidGroundwaterForChart
                    }, {
                        name: 'Thăm dò nước dưới đất',
                        data: probeGroundwaterForChart
                    }, {
                        name: 'Hành nghề khoan',
                        data: dilringPracticeGroundwaterForChart
                    }, {
                        name: 'Xả thải vào nguồn nước',
                        data: dischargewaterForChat
                    }],
                });
            }, 1);
        })
    }

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
                            html: '<img class="marker-img" src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/' + feature.properties.Construction.TypeSlug + '.png" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feature.properties.Name + '</div>',
                            className: 'text-marker marker-' + feature.properties.Construction.ParentTypeSlug + ' marker-' + feature.properties.Construction.TypeSlug,
                            id: feature.properties.Num
                        })
                    });
                    return lay;
                },
                onEachFeature: onEachFeature
            });
            constructionMap.addLayer(pointLayer);
        });


    }

    //data type of construction for create form
    function GetTypeOfConstruction(typeid) {
        $scope.TypeOfConstructions = [];
        if (typeid == 8 || typeid == 9 || typeid == 10) {
            var item = { Id: typeid, TypeName: '' }
            changeTypeOfCons(typeid, false);
            switch (typeid) {
                case 8: item.TypeName = "Khai thác nước dưới đất"; break;
                case 9: item.TypeName = "Thăm dò nước dưới đất"; break;
                case 10: item.TypeName = "Hành nghề khoan nước dưới đất"; break;
            }
            $scope.TypeOfConstructions.push(item);
            $scope.Id = typeid;
        }
        else {
            typeOfConstructionService.getTypeOfConstructions(typeid, Status, '', 0, 0).then(function (items) {
                items.data.ListData.forEach(function (row) {
                    var item = { Id: row.Id, TypeName: row.TypeName }
                    $scope.TypeOfConstructions.push(item);
                    row.Childrent.forEach(function (row1) {
                        var item1 = { Id: row1.Id, TypeName: row1.TypeName }
                        $scope.TypeOfConstructions.push(item1);
                    })
                })
            });
        }
    }

    GetTypeOfConstruction(TypeOfConstructionId);

    //filter license on page show list license
    $scope.filterConsByType = function (Id, Name) {
        if (Id > 3) {
            TypeOfConstructionId = Id;
            $scope.TypeOfConstructionFilter = Name;
        } else {
            let pathName = location.pathname.split('/')[2];
            switch (pathName) {
                case "nuoc-mat":
                    TypeOfConstructionId = 1;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
                case "xa-thai":
                    TypeOfConstructionId = 3;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
            }
            $scope.TypeOfConstructionFilter = Name;
        }
        GetDataLicenses();
    }

    //data license
    function GetDataLicenses() {
        AllLicense();
        $scope.$watch('currentPage + numPerPage', function () {
            licenseService.getAllLicenses(ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, true, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Licenses = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function AllLicense() {
        licenseService.getAllLicenses(0, 0, 0, 0, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, 0, 0, -1, 0, -1, false, true, '', 1, 0).then(function (items) {
            $scope.AllLicenses = items.data.ListData;
        })
        licenseService.getAllLicenses(ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, true, true, $scope.Keyword, 0, 0).then(function (items) {
            $scope.ExcelLicense = items.data.ListData;
        });
    }
});