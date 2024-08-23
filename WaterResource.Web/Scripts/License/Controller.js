app.controller("myCntrl", function ($scope, $location, licenseService, licenseFeeService, constructionService, businessService,
    basinService, typeOfConstructionService, inspectionService, Excel, toastr, $timeout) {
    'use strict'

    //DECLARE VARIABLE
    $scope.TotalItem = 0;
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.Keyword = '';
    $scope.BusinessId = 0;
    $scope.TotalCapacity = 0;
    $scope.ConsName = '';
    $scope.license = {};
    $scope.license.LicensingAuthorities = -1;
    $scope.license.Construction = {};
    $scope.license.Business = {};
    $scope.license.LicenseFee = {};
    $scope.license.ConstructionId = null;
    $scope.DataYear = [];
    $scope.checkAddOldLicense = false;
    $scope.fromRecord = 0;

    var Status = true,
        ParentId = 0,
        BusinessId = 0,
        ConstructionId = 0,
        LicensingTypeId = 0,
        TypeOfConstructionId = 0,
        DistrictId = 0,
        BasinId = 0,
        AquiferId = -1,
        CityCode = '',
        DistrictCode = '',
        d = new Date,
        Effect = 0,
        LicensingAuthorities = -1;

    var pathName = location.pathname.split('/')[2];

    $scope.StartYearFilter = 'Từ năm: ' + (d.getFullYear() - 25);
    $scope.EndYearFilter = 'Đến năm: ' + d.getFullYear();
    $scope.StartYear = (d.getFullYear() - 25);
    $scope.EndYear = d.getFullYear();
    for (let i = 1975; i <= d.getFullYear(); i++) {
        $scope.DataYear.push({ Year: i });
    }
    //For filter
    $scope.LicenseHolderFilter = '';
    $scope.ConstructionFilter = '';
    $scope.LicensingAuthoritiesFilter = 'Chọn Cơ quan CP';
    $scope.LicensingTypeFilter = 'Chọn loại hình CP';
    $scope.LicenseEffectFilter = 'Chọn hiệu lực GP';
    $scope.TypeOfConstructionFilter = 'Chọn loại CT';
    $scope.DistrictFilter = 'Chọn huyện';
    $scope.AquiferFilter = 'Chọn tầng chứa nước';
    $scope.BasinFilter = 'Chọn tiểu vùng quy hoạch';


    $scope.ListLicensingAuthorities = [
        { Id: -1, Name: "Chọn Cơ quan CP" },
        { Id: 0, Name: "Bộ TNMT" },
        { Id: 1, Name: "UBND Tỉnh" }
    ];
    $scope.ListLicenseEffect = [
        { Id: -1, Name: "Chọn hiệu lực GP" },
        { Id: 1, Name: "Còn hiệu lực" },
        { Id: 2, Name: "Hết hiệu lực" },
        { Id: 3, Name: "Sắp hết hiệulực" },
        { Id: 4, Name: "Đã thu hồi" }
    ];

    //$scope.ShowAdvanceSearch = function () {
    //    if ($scope.AdvanceSearch == true) {
    //        $scope.AdvanceSearch = false;
    //    } else {
    //        $scope.AdvanceSearch = true;
    //    }
    //}

    //filter license on page show list license
    $scope.filterConsByType = function (Id, Name) {
        TypeOfConstructionId = Id;
        $scope.TypeOfConstructionFilter = Name;
        if (pathName != undefined) { GetDataLicenses(); }
    }

    $scope.filterLicenseByType = function (Id, Name) {
        LicensingTypeId = Id;
        $scope.LicensingTypeFilter = Name;
        if (pathName != undefined) { GetDataLicenses(); }
    }

    $scope.filterLicenseByEffect = function (Id, Name) {
        Effect = Id;
        $scope.LicenseEffectFilter = Name;
        if (pathName != undefined) { GetDataLicenses(); }
    };

    $scope.filterLicenseByLicensingAuthorities = function (Id, Name) {
        LicensingAuthorities = Id;
        $scope.license.LicensingAuthorities = Id;
        $scope.LicensingAuthoritiesFilter = Name;
        if (pathName != undefined) { GetDataLicenses(); }
    };
    $scope.filterLicenseByDistrict = function (Id, Name) {
        DistrictId = Id;
        $scope.DistrictFilter = Name;
        if (pathName != undefined) { GetDataLicenses(); }
    };
    $scope.filterLicenseByAquifer = function (Id, Name) {
        AquiferId = Id;
        $scope.AquiferFilter = Name;
        if (pathName != undefined) { GetDataLicenses(); }
    };
    $scope.filterLicenseByBasin = function (Id, Name) {
        BasinId = Id;
        $scope.BasinFilter = Name
        if (pathName != undefined) { GetDataLicenses(); }
    };
    $scope.SetKeyword = function (k) {
        $scope.Keyword = k;
    }
    $scope.onKeyPress = function (event) {
        if (event.which === 13) {
            // 13 là mã ASCII của phím Enter
            $scope.SetKeyword($scope.Keyword);
            if (pathName != undefined) { GetDataLicenses(); }
        }
    }

    $scope.filterLicenseByDataYear = function (StartYear, EndYear) {
        $scope.StartYearFilter = 'Từ năm: ' + StartYear;
        $scope.EndYearFilter = 'Đến năm: ' + EndYear;
        $scope.StartYear = StartYear;
        $scope.EndYear = EndYear;
        if (pathName != undefined) { GetDataLicenses(); }
    }

    $scope.filterLicenseByBusiness = function (item, inputId) {
        if (item != 0) { BusinessId = item.Id; $scope.LicenseHolderFilter = item.Name }
        else { BusinessId = 0; $scope.LicenseHolderFilter = '' }
        SetInputVal(inputId, item);
        if (pathName != undefined) { GetDataLicenses(); }
    }

    $scope.filterLicenseByCons = function (item, inputId) {
        if (item != 0) { ConstructionId = item.Id; $scope.ConstructionFilter = item.ConstructionName; }
        else { ConstructionId = 0; $scope.ConstructionFilter = '' }
        SetInputVal(inputId, item);
        if (pathName != undefined) { GetDataLicenses(); }
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

        if (pathName != undefined) { GetDataLicenses(); }
        else {
            //countLicenseForChart();
            Chart()
        }
    }

    function SetInputVal(Id, Data) {
        document.getElementById(Id).value = Data.Name;
    }

    //datepicker
    datePicker()
    function datePicker() {
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            formatDayTitle: 'MM - yyyy',
            maxDate: false,
            minDate: false,
            showWeeks: false,
            startingDay: 1,
        };

        $scope.openDatepicker = function (id) {
            var idDatePicker = id;
            $scope[idDatePicker] = {
                opened: false
            };
            $scope[idDatePicker].opened = true;
        };

        $scope.format = 'dd/MM/yyyy';

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    }

    function formatDate(date) {
        if (date !== undefined) {
                if (date.includes("/")) {
                return date;
            } else {
                var d = new Date(date);
                return `${d.getFullYear()},${parseInt(d.getMonth()) + 1},${d.getDate()}`;
            }
        }
    }

    //clear all data in obj
    function ClearFields() {
        $scope.license = {};
    }

    function AllLicense() {
        licenseService.getAllLicenses(ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, false, true, $scope.Keyword, 1, 0).then(function (items) {
            $scope.ExcelLicense = items.data.ListData;
        });
    }

    //MAP
    function popupContent(cons) {
        let contentPopup = ``;
        if (cons.TypeOfConstructionId == 3) {
            contentPopup = `<tr><td>Vị trí xả thải</td><td>` + checkData(cons.ConstructionDetailLocation) + `</td></tr>
                <tr><td>Nguồn nước tiếp nhận nước thải</td><td>` + checkData(cons.DischargeWS) + `</td></tr>
                <tr><td>Phương thức xả thải</td><td>`+ checkData(cons.DischargeMethod) + `</td></tr>
                <tr><td>Chế độ xả thải</td><td>`+ checkData(cons.DischargeMode) + `</td></tr>
                <tr><td>Lưu lượng xả thải lớn nhất</td><td>` + checkData(cons.MaximumWasteWaterFlow) + `</td></tr>
                <tr><td>Lưu lượng xả trung bình m3/ngày đêm</td><td>` + checkData(cons.AverageDischargeFlow) + `</td></tr>
                <tr><td>Chất lượng nước thải hệ số Kq và Kf</td><td>` + checkData(cons.KqKf) + `</td></tr>
                <tr><td>Loại hình nước thải</td><td>` + checkData(cons.TypeOfWastewater) + `</td></tr>`;
        }
        else if (cons.TypeOfConstructionId == 4 || cons.TypeOfConstructionId == 5) {
            contentPopup = `<tr><td>Chế độ khai thác (giờ/ngày đêm)</td><td> ` + checkData(cons.MiningMode) + `</td></tr>
                <tr><td>Q<sub>max khai thác</sub>:</td><td>` + checkData(cons.MiningMaxFlow) + `</td></tr>
                <tr><td>Q<sub>tối thiểu</sub>:</td><td>` + checkData(cons.MinimumFlow) + `</td></tr>
                <tr><td>Q<sub>max qua thuỷ điện</sub>:</td><td>` + checkData(cons.MaximumFlow) + `</td></tr>
                <tr><td>Nguồn nước khai thác:</td><td>` + checkData(cons.ExploitedWS) + `</td></tr>
                <tr><td>Phương thức khai thác:</td><td>` + checkData(cons.MiningMethod) + `</td></tr>
                <tr><td>Công suất lắp máy(MW):</td><td>` + checkData(cons.Power) + `</td></tr>
                <tr><td>Chiều cao đập</sub>:</td><td>` + checkData(cons.DamHeight) + `</td></tr>
                <tr><td>Chiều dài đập:</td><td>` + checkData(cons.DamWidth) + `</td></tr>
                <tr><td>Mực nước dâng bình thường:</td><td>` + checkData(cons.RiseWL) + `</td></tr>
                <tr><td>Mực nước chết:</td><td>` + checkData(cons.DeadWL) + `</td></tr>
                <tr><td>Mực nước lớn nhất trước lũ:</td><td>` + checkData(cons.PreFlootMaxWL) + `</td></tr>
                <tr><td>Mực nước đón lũ:</td><td>` + checkData(cons.FlootWL) + `</td></tr>
                <tr><td>Mực nước thượng lưu</td><td>` + checkData(cons.UpstreamWL) + `</td></tr>
                <tr><td>Mực nước hạ lưu:</td><td>` + checkData(cons.DownstreamWL) + `</td></tr>
                <tr><td>Mực nước lũ thiết kế:</td><td>` + checkData(cons.DesignFloodLevel) + `</td></tr>
                <tr><td>Mực nước lũ kiểm tra:</td><td>` + checkData(cons.CheckFloodWL) + `</td></tr>
                <tr><td>Dung tích hữu ích:</td><td>` + checkData(cons.UsefulCapacity) + `</td></tr>
                <tr><td>Dung tích toàn bộ:</td><td>` + checkData(cons.TotalCapacity) + `</td></tr>`;
        } else if (cons.TypeOfConstructionId == 6) {
            contentPopup = `<tr><td>Nguồn nước khai thác:</td><td>` + checkData(cons.ExploitedWS) + `</td></tr>
                <tr><td>Số máy bơm</td><td> ` + checkData(cons.PumpNumber) + `</td></tr>
                <tr><td>Q thiết kế(m3/s)</td><td> ` + checkData(cons.PumpDesignFlow) + `</td></tr>
                <tr><td>Qmax (m3/s)</td><td> ` + checkData(cons.PumpMaxFlow) + `</td></tr>
                <tr><td>Mực nước bể hút</td><td> ` + checkData(cons.SuctionTankWL) + `</td></tr>`;
        } else if (cons.TypeOfConstructionId == 8) {
            contentPopup = `<tr><td>Thời hạn khai thác</td><td> ` + checkData(cons.MiningDuration) + `</td></tr>
                <tr><td>Mục đích khai thác</td><td> ` + checkData(cons.MiningMethod) + `</td></tr>
                <tr><td>Mực nước trong giếng khai thác</td><td> ` + checkData(cons.WellWL) + `</td></tr>
                <tr><td>Tầng chứa nước khai thác</td><td> ` + checkData(cons.MiningAquifer) + `</td></tr>
                <tr><td>Số giếng khai thác</td><td> ` + checkData(cons.NumberMiningWells) + `</td></tr>
                <tr><td>Tổng lượng nước khai thác (m3/ngày đêm)</td><td> ` + checkData(cons.AmountWaterExploited) + `</td></tr>
                <tr><td>Chiều sâu đoạn thu nước (m)</td><td> ` + checkData(cons.WaterDepthFrom) + `</td></tr>
                <tr><td>Chiều sâu đoạn thu nước (m)</td><td> ` + checkData(cons.WaterDepthTo) + `</td></tr>
                <tr><td>Lưu lượng khai thác thiết kế (m3/ngày đêm)</td><td> ` + checkData(cons.WaterExtractionFlowDesign) + `</td></tr>
                <tr><td>Lưu lượng khai thác thực tế (m3/ngày đêm)</td><td> ` + checkData(cons.WaterExtractionFlowReality) + `</td></tr>
                <tr><td>Chiều sâu mực nước tĩnh </td><td> ` + checkData(cons.StaticWL) + `</td></tr>
                <tr><td>Chiều sâu mực nước động lớn nhất (m)</td><td> ` + checkData(cons.DynamicWL) + `</td></tr>`;
        } else if (cons.TypeOfConstructionId == 9) {
            contentPopup = `<tr><td>Quy mô khoan thăm dò</td><td> ` + checkData(cons.DrillingScale) + `</td></tr>
                <tr><td>Tầng chứa nước thăm dò</td><td> ` + checkData(cons.ProbeAquifer) + `</td></tr>
                <tr><td>Thời gian thi công khoan thăm dò</td><td> ` + checkData(cons.ConstructionTime) + `</td></tr>
                <tr><td>Mục đích thăm dò</td><td> ` + checkData(cons.ExplorationPurposes) + `</td></tr>
                <tr><td>Khối lượng các hạng mục thăm dò</td><td> ` + checkData(cons.VolumeOfExplorationItems) + `</td></tr>`;
        } else if (cons.TypeOfConstructionId == 10) {
            contentPopup = `<tr><td>Thời gian hành nghề khoan</td><td> ` + checkData(cons.DrillingDuration) + `</td></tr>
                <tr><td>Mục đích khoan KT</td><td> ` + checkData(cons.DrillingPurpose) + `</td></tr>`;
        } else if (cons.TypeOfConstructionId == 11) {
            contentPopup = `<tr><td>Lưu lượng khai thác CNSH</td><td> ` + checkData(cons.WaterSupplyFlow) + `</td></tr>
                <tr><td>Nguồn nước khai thác:</td><td>` + checkData(cons.ExploitedWS) + `</td></tr>
                <tr><td>Phương thức khai thác:</td><td>` + checkData(cons.MiningMethod) + `</td></tr>
                <tr><td>Lưu lượng khai thác (m3/ngày đêm)</td><td> ` + checkData(cons.WaterSupplyFlow) + `</td></tr>
                <tr><td>Thời hạn khai thác</td><td> ` + checkData(cons.MiningDuration) + `</td></tr>`;
        } else if (cons.TypeOfConstructionId == 13) {
            contentPopup = `<tr><td>Cao trình cống</td><td> ` + checkData(cons.DrainElevation) + `</td></tr>
                <tr><td>Chiều dài cống</td><td> ` + checkData(cons.DrainLength) + `</td></tr>
                <tr><td>Đường kính cống</td><td> ` + checkData(cons.DrainDiameter) + `</td></tr>
                <tr><td>Kích thước miệng cống (chiều rộng - chiều cao)</td><td> ` + checkData(cons.DrainSize) + `</td></tr>`;
        }

        return `<div class="card-outline card-outline-tabs map-info-card w-100 border-0">
            <h5 class="card-title text-center col-12 mb-2 font-weight-bold text-deepblue">Thông tin công trình - `+ cons.ConstructionName + `</h5>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <span class="text-black font-weight-bold">Vĩ độ</span>: <span>` + checkData(cons.X) + `</span>
                        </td>
                        <td>
                            <span class="text-black font-weight-bold">Kinh độ</span>: <span> ` + checkData(cons.Y) + `</span>
                        </td>
                    </tr>
                    <tr><td style="width: 180px;">Năm bắt đầu vận hành:</td><td>` + checkData(cons.StartDate) + `</td></tr>
                    ${contentPopup}
                </tbody>
            </table>

        </div>`;
    }

    function checkData(data) {
        if (data !== null && data !== '' && data !== undefined) {
            return data;
        } else {
            return "Không có dữ liệu";
        }
    }

    var mymap = null;

    function initMap() {
        mymap = L.map('Map', {
            maxZoom: 15
        }).setView([21.248632, 104.118988], 9);

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

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }

    //GET DATA
    //data license
    function GetDataLicenses() {
        AllLicense();
        $scope.$watch('currentPage + numPerPage', function () {
            licenseService.getAllLicenses(ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, true, Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Licenses = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
                showMarkerLicense();
                $scope.fromRecord = $scope.currentPage > 1 ? ($scope.currentPage - 1) * $scope.numPerPage + 1 : $scope.currentPage;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function showMarkerLicense() {
        var markerGroups = {
            "nuocmat": [],
            "khaithac": [],
            "thamdo": [],
            "hanhnghekhoan": [],
            "xathai": []
        };
        var pointLayer;

        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });

        // Loop through constructions, push data to show points on map push into array
        $scope.Licenses.forEach(function (e) {
            var marker =
            {
                "id": e.Construction.Id,
                "type": "Feature",
                "properties": {
                    "Content": popupContent(e.Construction),
                    "Name": e.Construction.Name,
                    "Code": e.Construction.ConstructionCode,
                    "Construction": e.Construction,
                    "ConstructionType": e.Construction.TypeOfConstructionId
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [e.Construction.Lng, e.Construction.Lat]
                }
            };

            markerGroups[e.ParentConstructionType].push(marker);

            pointLayer = L.geoJSON(markerGroups[e.ParentConstructionType], {
                pointToLayer: function (feature, latlng) {
                    var lay = L.marker(latlng, {
                        icon: L.divIcon({
                            html: '<img width=20 src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/' + feature.properties.Construction.TypeSlug + '.png" /><div class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feature.properties.Name + '</div>',
                            className: 'text-marker marker-' + feature.properties.Construction.TypeSlug,
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

    //data parrent type of construction for menu page
    GetTypeOfConstructionBindToMenu();
    function GetTypeOfConstructionBindToMenu() {
        typeOfConstructionService.getTypeOfConstructions(0, Status, '', 0, 0).then(function (items) {
            $scope.AllTypes = items.data.ListData;
        });
    }

    //data aquifers
    Aquifers();
    function Aquifers() {
        licenseService.getAquifers(true, '', 0, 0).then(function (items) {
            $scope.AllAquifers = items.data.ListData;
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

    //Licensing type
    GetLicensingType();
    function GetLicensingType() {
        licenseService.getLicensingType('', 0, 0).then(function (items) {
            $scope.LicensingTypes = items.data.ListData;
        });
    }

    //data city
    GetProvince();
    function GetProvince() {
        licenseService.getAllProvince($scope.Keyword, 0, 0).then(function (items) {
            $scope.Provinces = items.data.ListData;
        });
    }

    //data district
    function GetDistricts(CityId) {
        licenseService.getDistrict(CityId, CityCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        });
    }

    //data commune
    function GetCommune(DistrictId) {
        licenseService.getCommunes(DistrictId, CityCode, DistrictCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Communes = items.data.ListData;
        });
    }

    //data construction
    function GetDataConstruction(typeOfConsId) {
        constructionService.countConstruction().then(function (items) {
            $scope.DataConstruction = items.data.ListData;
        });
    }

    //data Bussines
    GetDataBusiness();
    function GetDataBusiness() {
        businessService.getAllBusinesses(Status, '', 0, 0).then(items => $scope.Business = items.data.ListData);
    }

    //data basin
    GetBasins();
    function GetBasins() {
        basinService.getAllBasins(Status, '', false, 0, 0).then(function (items) {
            $scope.Basins = items.data.ListData;
        });
    }

    //Count License Is About To Expire And License Expire

    countLicense()
    function countLicense() {
        var CountLicenses = {
            //[0:AllLicense, 1:ExpireLicense, 2:IsAboutToExpire, 3:BTNMT, 4:UBND, 5: IsRevoked ]
            surfacewater: [0, 0, 0, 0, 0, 0],
            groundwater: [0, 0, 0, 0, 0, 0],
            exploidGroundwater: [0, 0, 0, 0, 0, 0],
            probeGroundwater: [0, 0, 0, 0, 0, 0],
            drillingPracticeGroundwater: [0, 0, 0, 0, 0, 0],
            dischargewater: [0, 0, 0, 0, 0, 0],
            LicenseFrom: [0, 0],
        }

        var idSurfacewaterCons = [4, 5, 6, 11, 12, 13, 14, 15];
        var idGroundwaterCons = [8, 9, 10, 16, 24];
        var idDischargeCons = [17, 18, 19, 20, 21, 22, 23];
        //ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, isDetail, Status, Keyword, PageIndex, PageSize
        licenseService.countLicense().then(function (items) {
            $scope.AllLicenses = items.data.ListData;
            items.data.ListData.forEach(function (row) {
                var endDate = new Date(row.ExpireDate);
                if (row.LicensingAuthorities == 0 || row.LicensingAuthorities == 1) {
                    if (row.LicensingAuthorities == 0) {
                        CountLicenses.LicenseFrom[0]++;
                    } else if (row.LicensingAuthorities == 1) {
                        CountLicenses.LicenseFrom[1]++;
                    }
                    //surfacewater
                    if (idSurfacewaterCons.includes(row.TypeOfConstructionId)) {
                        CountLicenses.surfacewater[0]++;
                        //license Status
                        if (row.IsRevoked == true) {
                            CountLicenses.surfacewater[5]++;
                        }
                        if (getLicenseStatus(endDate) > 0) {
                            CountLicenses.surfacewater[1]++;
                        }
                        else if (getLicenseStatus(endDate) <= 0) {
                            //license Authorities
                            if (row.LicensingAuthorities == 0) {
                                CountLicenses.surfacewater[3]++;
                            } else if (row.LicensingAuthorities == 1) {
                                CountLicenses.surfacewater[4]++;
                            }
                            if (getLicenseStatus(endDate) > - 180) {
                                CountLicenses.surfacewater[2]++;
                            }
                        }
                    }
                    //groundwater
                    if (idGroundwaterCons.includes(row.TypeOfConstructionId)) {
                        CountLicenses.groundwater[0]++;
                        //license Status
                        if (row.TypeOfConstructionId == 8) {
                            CountLicenses.exploidGroundwater[0]++;
                        } else if (row.TypeOfConstructionId == 9) {
                            CountLicenses.probeGroundwater[0]++;
                        } else if (row.TypeOfConstructionId == 10) {
                            CountLicenses.drillingPracticeGroundwater[0]++;
                        }

                        if (row.IsRevoked == true) {
                            if (row.TypeOfConstructionId == 8) {
                                CountLicenses.exploidGroundwater[5]++;
                            } else if (row.TypeOfConstructionId == 9) {
                                CountLicenses.probeGroundwater[5]++;
                            } else if (row.TypeOfConstructionId == 10) {
                                CountLicenses.drillingPracticeGroundwater[5]++;
                            }
                        }
                        if (getLicenseStatus(endDate) > 0) {
                            CountLicenses.groundwater[1]++;
                            if (row.TypeOfConstructionId == 8) {
                                CountLicenses.exploidGroundwater[1]++;
                            } else if (row.TypeOfConstructionId == 9) {
                                CountLicenses.probeGroundwater[1]++;
                            } else if (row.TypeOfConstructionId == 10) {
                                CountLicenses.drillingPracticeGroundwater[1]++;
                            }
                        }
                        else if (getLicenseStatus(endDate) <= 0) {
                            if (row.TypeOfConstructionId == 8) {
                                //license Authorities
                                if (row.LicensingAuthorities == 0) {
                                    CountLicenses.exploidGroundwater[3]++;
                                } else if (row.LicensingAuthorities == 1) {
                                    CountLicenses.exploidGroundwater[4]++;
                                }
                            } else if (row.TypeOfConstructionId == 9) {
                                //license Authorities
                                if (row.LicensingAuthorities == 0) {
                                    CountLicenses.probeGroundwater[3]++;
                                } else if (row.LicensingAuthorities == 1) {
                                    CountLicenses.probeGroundwater[4]++;
                                }
                            } else if (row.TypeOfConstructionId == 10) {
                                //license Authorities
                                if (row.LicensingAuthorities == 0) {
                                    CountLicenses.drillingPracticeGroundwater[3]++;
                                } else if (row.LicensingAuthorities == 1) {
                                    CountLicenses.drillingPracticeGroundwater[4]++;
                                }
                            }
                            if (getLicenseStatus(endDate) > - 180) {
                                CountLicenses.exploidGroundwater[2]++;
                                if (row.TypeOfConstructionId == 8) {
                                    CountLicenses.exploidGroundwater[2]++;
                                } else if (row.TypeOfConstructionId == 9) {
                                    CountLicenses.probeGroundwater[2]++;
                                } else if (row.TypeOfConstructionId == 10) {
                                    CountLicenses.drillingPracticeGroundwater[2]++;
                                }
                            }
                        }
                    }
                    //dischargewater
                    if (idDischargeCons.includes(row.TypeOfConstructionId)) {
                        CountLicenses.dischargewater[0]++;
                        //license Authorities
                        //license Status
                        if (row.IsRevoked == true) {
                            CountLicenses.dischargewater[5]++;
                        }
                        if (row.LicensingAuthorities == 0) {
                            CountLicenses.dischargewater[3]++;
                        } else if (row.LicensingAuthorities == 1) {
                            CountLicenses.dischargewater[4]++;
                        }
                        if (getLicenseStatus(endDate) > 0) {
                            CountLicenses.dischargewater[1]++;
                        }
                        else if (getLicenseStatus(endDate) <= 0) {
                            if (getLicenseStatus(endDate) > - 180) {
                                CountLicenses.dischargewater[2]++;
                            }
                        }
                    }
                }
            });
            $scope.CountLicenses = CountLicenses;
        });
    }


    function Chart() {
        licenseService.countLicenseForChart(0, BusinessId, LicensingTypeId, TypeOfConstructionId, $scope.StartYear, $scope.EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities).then(function (items) {
            drawChart(items.data)
        })
    }

    function drawChart(chartData) {
        let chart;
        var options = {
            series: chartData.series,
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
                                chartData.year.forEach((category, index) => {
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
                            }
                        });
                    },
                    click: function (event, chartContext, config) {
                        let y = config.config.xaxis.categories[config.dataPointIndex];
                        let dist = DistrictId, aqfr = AquiferId, bas = BasinId, cons = ConstructionId, bsness = BusinessId, licauth = LicensingAuthorities;

                        let url = '/giay-phep/';
                        switch (config.seriesIndex) {
                            case 0: url += 'nuoc-mat'; break;
                            case 1: url += 'khai-thac-nuoc-duoi-dat'; break;
                            case 2: url += 'tham-do-nuoc-duoi-dat'; break;
                            case 3: url += 'hanh-nghe-khoan-nuoc-duoi-dat'; break;
                            case 4: url += 'xa-thai'; break;
                            default: return;
                        }
                        window.location.href = url + '?y=' + y + '&dist=' + dist + '&aqfr=' + aqfr + '&bas=' + bas + '&cons=' + cons + '&bsness=' + bsness + '&licauth=' + licauth
                    },
                },
            },
            grid: {
                show: false,
            },
            colors: chartData.color,
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                    endingShape: 'rounded',
                    dataLabels: {
                        position: 'top', // top, center, bottom
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
                categories: chartData.year,
            },
            legend: {
                position: 'top',
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

        //set time draw column chart
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
                    data: chartData.series[0].data
                }, {
                    name: 'Khai thác sử dụng nước dưới đất',
                    data: chartData.series[1].data
                }, {
                    name: 'Thăm dò nước dưới đất',
                    data: chartData.series[2].data
                }, {
                    name: 'Hành nghề khoan',
                    data: chartData.series[3].data
                }, {
                    name: 'Xả thải vào nguồn nước',
                    data: chartData.series[4].data
                }],
            });
        }, 1);
    }

    init();
    function init() {
        $scope.Keyword = '';
        $scope.currentPage = 1;
        if (typeof isUser !== 'undefined') {
            $scope.MapId = 'Map';
            $scope.navHeader = 'DANH SÁCH GIẤY PHÉP';
            TypeOfConstructionId = 0;
            GetTypeOfConstruction(TypeOfConstructionId);
            $scope.ShowConsType = true;
            GetDataLicenses();
            $scope.TypeOfParentConstructionId = TypeOfConstructionId;
            if (mymap) { mymap.remove(); }
            initMap();
            countLicense();
            return;
        }

        var urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('bo-cap')) {
            $scope.LicensingAuthorities = '0';
            LicensingAuthorities = 0;
        } else if (urlParams.has('tinh-cap')) {
            $scope.LicensingAuthorities = '1';
            LicensingAuthorities = 1;
        } else if (urlParams.has('kw')) {
            $scope.Keyword = urlParams.get('kw');
        } else if (urlParams.has('y')) {
            $scope.StartYear = urlParams.get('y');
            $scope.EndYear = urlParams.get('y');
        }
        //window.location.href = url + '?y=' + y + '&dist=' + dist + '&aqfr=' + aqfr + '&bas=' + bas + '&cons=' + cons + '&bsness=' + bsness + '&licauth=' + licauth
        if (urlParams.has('dist')) {
            DistrictId = urlParams.get('dist');
        }
        if (urlParams.has('bas')) {
            BasinId = urlParams.get('bas');
        }
        if (urlParams.has('aqfr')) {
            AquiferId = urlParams.get('aqfr');
        }
        if (urlParams.has('bsness')) {
            BusinessId = urlParams.get('bsness');
        }
        if (urlParams.has('licauth')) {
            LicensingAuthorities = urlParams.get('licauth');
        }

        switch (pathName) {
            case "nuoc-mat":
                $scope.navHeader = 'DANH SÁCH GIẤY PHÉP KHAI THÁC SỬ DỤNG NƯỚC MẶT';
                TypeOfConstructionId = 1;
                GetTypeOfConstruction(TypeOfConstructionId);
                GetDataConstruction(TypeOfConstructionId)
                $scope.ShowConsType = true;
                $scope.ShowAquifer = false;
                break;
            case "khai-thac-nuoc-duoi-dat":
                $scope.MapId = 'Groundwater';
                $scope.navHeader = 'DANH SÁCH GIẤY PHÉP KHAI THÁC NƯỚC DƯỚI ĐẤT';
                TypeOfConstructionId = 8;
                GetTypeOfConstruction(TypeOfConstructionId);
                GetDataConstruction(TypeOfConstructionId)
                $scope.ShowConsType = false;
                $scope.ShowAquifer = true;
                break;
            case "tham-do-nuoc-duoi-dat":
                $scope.navHeader = 'DANH SÁCH GIẤY PHÉP THĂM DÒ NƯỚC DƯỚI ĐẤT';
                TypeOfConstructionId = 9;
                GetTypeOfConstruction(TypeOfConstructionId);
                GetDataConstruction(TypeOfConstructionId)
                $scope.ShowConsType = false;
                $scope.ShowAquifer = true;
                break;
            case "hanh-nghe-khoan-nuoc-duoi-dat":
                $scope.navHeader = 'DANH SÁCH GIẤY PHÉP HÀNH NGHỀ KHOAN NƯỚC DƯỚI ĐẤT';
                TypeOfConstructionId = 10;
                GetTypeOfConstruction(TypeOfConstructionId);
                GetDataConstruction(TypeOfConstructionId)
                $scope.ShowConsType = false;
                $scope.ShowAquifer = true;
                break;
            case "xa-thai":
                $scope.MapId = 'Dischargewater';
                $scope.navHeader = 'DANH SÁCH GIẤY PHÉP XẢ NƯỚC THẢI VÀO NGUỒN NƯỚC';
                TypeOfConstructionId = 3;
                GetTypeOfConstruction(TypeOfConstructionId);
                GetDataConstruction(TypeOfConstructionId)
                $scope.ShowConsType = true;
                $scope.ShowAquifer = false;
                break;
            default:
                TypeOfConstructionId = 0;
                $scope.AddBtn = false;
                $scope.ShowConsType = true;
                $scope.ShowAquifer = true;
                GetDistricts(1);
                GetTypeOfConstruction(TypeOfConstructionId);
                GetDataConstruction(TypeOfConstructionId)
                //countLicenseForChart();
                Chart()
                break;
        }
        if (pathName != '' && pathName != undefined) {
            $scope.AddBtn = true;
            GetDataLicenses();
            $scope.TypeOfParentConstructionId = TypeOfConstructionId;
        }

        if (mymap) { mymap.remove(); }
        initMap();
        GetDistricts(1);
        countLicense();
    }

    //FILTER AND SHOW LIST LICENSE
    // set status for license
    function getLicenseStatus(dateAcquired) {
        if (dateAcquired != null || dateAcquired != undefined || dateAcquired != '') {
            let licenseStatus = Math.floor((new Date() - new Date(dateAcquired)) / (1000 * 3600 * 24));
            return licenseStatus;
        }
    }

    $scope.CheckLicenseEffect = function (license) {
        if (license.ExpireDate == null || license.LicenseTypeName == "Thu hồi") {
            return '<div class="license_status hsd-revoked"> Giấy phép thu hồi </div>';
        }
        var endDate = new Date(license.ExpireDate);
        if (license.IsRevoked == false) {
            if (license.LicensingTypeId == 5) {
                return '<div class="license_status hsd-success"> Còn hiệu lực </div>';
            } else {
                if (getLicenseStatus(endDate) > 0) {
                    return '<div class="license_status hsd-danger"> Hết hiệu lực </div>';
                }
                else if (getLicenseStatus(endDate) <= 0) {
                    if (getLicenseStatus(endDate) > - 180) {
                        return '<div class="license_status hsd-warning"> Sắp hết hiệu lực </div>';
                    } else if (getLicenseStatus(endDate) < - 180) {
                        return '<div class="license_status hsd-success"> Còn hiệu lực </div>';
                    }
                }
            }
        } else {
            return '<div class="license_status hsd-danger"> Đã bị thu hồi </div>';
        }
    }

    $scope.CheckLicenseEffectExcel = function (license) {
        if (license.ExpireDate == null) {
            return 'Giấy phép thu hồi';
        }
        var endDate = new Date(license.ExpireDate);
        if (license.IsRevoked == false) {
            if (license.LicensingTypeId == 5) {
                return 'Còn hiệu lực';
            } else {
                if (getLicenseStatus(endDate) > 0) {
                    return 'Hết hiệu lực';
                }
                else if (getLicenseStatus(endDate) <= 0) {
                    if (getLicenseStatus(endDate) > - 180) {
                        return 'Sắp hết hiệu lực';
                    } else if (getLicenseStatus(endDate) < - 180) {
                        return 'Còn hiệu lực';
                    }
                }
            }
        } else {
            return 'Đã bị thu hồi';
        }
    }

    //Begin create, edit, delete data license
    //open form create
    $scope.openFormCreatLicense = function (navOpen) {
        ClearFields();
        $scope.asideHeader = '<span>TẠO MỚI GIẤY PHÉP</span>';
        $scope.Action = "Add";
        $scope.license.Construction = {};
        $scope.license.Business = {};
        $scope.license.LicenseFee = { LicensingAuthorities: '' };
        openAside(navOpen);
    }

    //
    function checkAddOldLicense(LicensingTypeId) {
        if (LicensingTypeId == 1 || LicensingTypeId == undefined) {
            return false;
        } else {
            return true;
        }
    }

    //change license type
    $scope.changeLicenseTypeAddNew = function (TypeOfConstructionId) {
        $scope.license.LicensingTypeId = TypeOfConstructionId;
        $scope.license.LicensingTypeId = TypeOfConstructionId;
        $scope.checkAddOldLicense = checkAddOldLicense(TypeOfConstructionId)
        if (TypeOfConstructionId == 1)
            $scope.license.ParentId = 0;
    }

    //change type of cons for show cons
    $scope.changeTypeOfCons = function (typeOfConsId, isIndexPage) {
        changeTypeOfCons(typeOfConsId, isIndexPage);
    }

    function changeTypeOfCons(typeOfConsId, isIndexPage) {
        $scope.license.TypeOfConstructionId = typeOfConsId;
        $scope.license.Construction.TypeOfConstructionId = typeOfConsId;
        if (isIndexPage == false) {
            if (typeOfConsId != null) {
                GetDataConstruction(typeOfConsId)
            }
        } else {
            if (typeOfConsId != null) {
                GetTypeOfConstruction(typeOfConsId);
            }
        }
    }

    //change type of cons for get typeOfConsId
    $scope.changeTypeOfConsAddNew = function (typeOfConsId) {
        $scope.license.Construction.TypeOfConstructionId = typeOfConsId;
    }

    $scope.changeBasinAddNew = function (basinId) {
        $scope.license.Construction.BasinId = basinId;
    }

    $scope.changeLicensingAuthorities = function (id) {
        $scope.license.LicensingAuthorities = id;
    }

    //change city to get cityId and district belong to this city
    $scope.ProvinceChange = function (ProvinceId) {
        if (ProvinceId !== null) {
            GetDistricts(ProvinceId);
            $scope.license.Construction.ProvinceId = ProvinceId;
        }
        else {
            $scope.Districts = [];
            $scope.Communes = [];
        }
    }

    //change district to get districtId and commune belong to this district
    $scope.DistrictChange = function (DistrictId) {
        if (DistrictId !== null) {
            GetCommune(DistrictId);
            $scope.license.Construction.DistrictId = DistrictId;
        }
        else {
            $scope.Communes = [];
        }
    }

    //change commune to get communeId
    $scope.CommunesChange = function (CommuneId) {
        if (CommuneId !== null) {
            $scope.license.Construction.CommuneId = CommuneId;
        }
    }

    $scope.AquiferChange = function (AquiferId) {
        if (AquiferId !== null) {
            $scope.license.Construction.AquiferId = AquiferId;
        }
    }

    $scope.addNewCons = function () {
        $scope.license.ConstructionId = undefined;
        $scope.license.Construction = {};
        $scope.license.LicenseFee = {};
        $scope.license.Construction.ConstructionItems = [];

    }

    $scope.addNewBusiness = function () {
        ;
        $scope.license.Business = {};

    }

    //set data Construction if use func changeTypeOfConstructions to show construction detail if have construction data select
    $scope.GetConsData = function (construction) {
        $scope.license.ConstructionId = construction.Id;
        $scope.license.Construction.Id = construction.Id;
        $scope.license.Construction.BasinId = construction.BasinId;
        $scope.license.Construction.DistrictId = construction.DistrictId;
        $scope.license.Construction.CommuneId = construction.CommuneId;
        $scope.license.Construction.AquiferId = construction.AquiferId;

        $scope.license.Construction = construction;
        constructionService.getConsItems(construction.Id, true, '', 1, 0).then(function (consItem) {
            $scope.license.Construction.ConstructionItems = consItem.data.ListData;
        });
        inspectionService.getAllInspections(construction.Id, true, '', 1, 0).then(function (inspection) {
            $scope.license.Construction.Inspection = inspection.data.ListData;
        });
        GetDistricts(construction.ProvinceId);
        GetCommune(construction.DistrictId);
    }

    $scope.SetBusiness = function (item) {
        $scope.license.BusinessId = item.Id;
        $scope.license.Business = item;
        $scope.license.LicenseHolderName = item.Name;
    }

    $scope.SetOldLicense = function (item) {
        $scope.license.OldLicense = {};
        $scope.license.OldLicense = item;
        $scope.license.OldLicense.SignDate = formatDate(item.SignDate);
        $scope.license.ParentId = item.Id;
        $scope.Id = item.Construction.TypeOfConstructionId;
        changeTypeOfCons($scope.Id, false);
        constructionService.getSingleConstruction(item.Construction.Id).then(item => $scope.GetConsData(item.data));
    }

    //add construction item
    $scope.AddConstructionItem = function () {
        if ($scope.license.Construction.ConstructionItems === null || $scope.license.Construction.ConstructionItems == undefined || $scope.license.Construction.ConstructionItems.length == 0) {
            $scope.license.Construction.ConstructionItems = [];
        }
        var item = {
            Name: '',
            LatX: 0,
            LngY: 0,
            MiningMaxFlow: 0,
            AmountWaterExploited: 0,
            MiningMode: '',
            StaticWL: 0,
            DynamicWL: 0,
            WaterDepthFrom: 0,
            WaterDepthTo: 0,
            AquiferId: 0,
            DepthFilterTubeFrom: 0,
            DepthFilterTubeTo: 0,
        }
        $scope.license.Construction.ConstructionItems.push(item);
    }

    //remove construction item
    $scope.RemoveConstructionItem = function (index, item) {
        $scope.license.Construction.ConstructionItems.splice(index, 1);
        if (confirm('Xoá hạng mục này?')) {
            constructionService.DeleteConsItem(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Hạng mục công trình');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Hạng mục công trình');
            });
        }
    }


    //Add MiningPurpose
    $scope.AddMiningPurpose = function () {
        if ($scope.license.MiningPurposes === null || $scope.license.MiningPurposes == undefined || $scope.license.MiningPurposes.length == 0) {
            $scope.license.MiningPurposes = [];
        }

        let item = { Purpose: '', WaterExploitedFlow: '', LicenseId: 0, ConstructionId: 0 }
        $scope.license.MiningPurposes.push(item);
    }

    //remove MiningPurpose
    $scope.RemoveMiningPurpose = function (index, item) {
        $scope.license.MiningPurposes.splice(index, 1);
        licenseService.DeleteMiningPurpose(item).then(function (msg) {
            toastr.success('Xóa thành công', 'Phương thức khai thác sử dụng');
        }, function () {
            toastr.error('Có lỗi khi xóa', 'Phương thức khai thác sử dụng');
        });
    }

    //add Inspection item
    $scope.AddInspection = function () {
        if ($scope.license.Construction == null || $scope.license.Construction == undefined || $scope.license.Construction.length == 0) {
            toastr.warning("Hãy chọn công trình", "Cảnh báo");
            return;
        }

        if ($scope.license.Construction.Inspection === null || $scope.license.Construction.Inspection == undefined || $scope.license.Construction.Inspection.length == 0) {
            $scope.license.Construction.Inspection = [];
        }
        let item = { InspectionName: '', InspectionUnit: '', DecisionNumber: '', InspectionDate: '', Fines: 0 }
        $scope.license.Construction.Inspection.push(item);
    }

    //remove Inspection item
    $scope.RemoveInspection = function (index, item) {
        if (confirm('Xoá biên bản thanh tra này?')) {
            if (item.FilePDF != null) {
                inspectionService.DeleteFileInspection(item.FilePDF, GetFolderLicense(typeid)).then(function (msg) {
                    if (msg)
                        toastr.success('Xóa thành công', 'Thanh tra - Kiểm tra');
                    else
                        toastr.error('Có lỗi khi xóa', 'Thanh tra - Kiểm tra');
                });
            }
            inspectionService.DeleteInspection(item).then(function (msg) {
                toastr.success('Xóa thành công', 'Thanh tra - Kiểm tra');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Thanh tra - Kiểm tra');
            });
            $scope.license.Construction.Inspection.splice(index, 1);
        }
    }

    //when open form edit license
    $scope.EDIT = function (item, asideId) {
        $scope.Action = "Update"
        $scope.asideHeader = '<span>CHỈNH SỬA GIẤY PHÉP</span>';
        item.SignDate = new Date(formatDate(item.SignDate))
        item.IssueDate = new Date(formatDate(item.IssueDate))
        item.ExpireDate = new Date(formatDate(item.ExpireDate))
        if (item.OldLicense !== null) {
            item.OldLicense.SignDate = new Date(formatDate(item.OldLicense.SignDate));
        }
        if (item.LicenseFees.length > 0) {
            item.LicenseFees[0].SignDate != undefined? new Date(formatDate(item.LicenseFees[0].SignDate)) : null;
            item.LicenseFee = item.LicenseFees[0];
        }
        if (item.Construction.Inspection !== null) {
            item.Construction.Inspection.forEach((e) => {
                e.InspectionDate = new Date(formatDate(e.InspectionDate));
            })
        }

        licenseService.getSingleCommune(item.Construction.CommuneId).then(item => $scope.Loc = item); $scope.Id = item.Construction.TypeOfConstructionId;
        $scope.license = item;

        openAside(asideId);
    }

    //delete license
    $scope.DELETE = function (item) {
        if (confirm('Xoá giấy phép ' + item.LicenseNumber + ' ?')) {
            if (item.LicenseFile != null) {
                licenseService.DeleteLicenseFile(item.LicenseFile, item.RelatedDocumentFile, GetFolderLicense(TypeOfConstructionId)).then(function (msg) {
                    if (msg) {
                        toastr.success('Xóa thành công', 'Giấy phép');
                    }
                    else {
                        toastr.error('Có lỗi khi xóa', 'Giấy phép');
                    }
                });
            }
            licenseService.DeleteLicense(item).then(function (msg) {
                GetDataLicenses();
                toastr.success('Xóa thành công', 'Giấy phép');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Giấy phép');
            });
        }
    }

    function GetFolderLicense(Id) {
        switch (Id) {
            case 1: return 'NuocMat';
            case 4: return 'NuocMat';
            case 5: return 'NuocMat';
            case 6: return 'NuocMat';
            case 11: return 'NuocMat';
            case 12: return 'NuocMat';
            case 13: return 'NuocMat';
            case 14: return 'NuocMat';
            case 15: return 'NuocMat';
            case 2: return 'NuocDuoiDat';
            case 8: return 'NuocDuoiDat';
            case 9: return 'NuocDuoiDat';
            case 10: return 'NuocDuoiDat';
            case 3: return 'XaThai';
            case 17: return 'XaThai';
            case 18: return 'XaThai';
            case 19: return 'XaThai';
            case 20: return 'XaThai';
            case 21: return 'XaThai';
            case 22: return 'XaThai';
            case 23: return 'XaThai';
            default: return '';
        }
    }

    function CheckRequired() {
        if ($scope.license.LicenseNumber === null || $scope.license.LicenseNumber === undefined || $scope.license.LicenseNumber === '')
            return 'Số giấy phép';
        if ($scope.license.LicensingTypeId === null || $scope.license.LicensingTypeId === undefined || $scope.license.LicensingTypeId === '')
            return 'Loại giấp phép';
        if ($scope.license.SignDate === null || $scope.license.SignDate === undefined || $scope.license.SignDate === '')
            return 'Ngày ký giấy phép';
        if ($scope.license.IssueDate === null || $scope.license.IssueDate === undefined || $scope.license.IssueDate === '')
            return 'Ngày giấy phép có hiệu lực';
        if ($scope.license.Duration === null || $scope.license.Duration === undefined || $scope.license.Duration === '')
            return 'Thời hạn giấy phép';
        if ($scope.license.LicensingTypeId === null || $scope.license.LicensingTypeId === undefined || $scope.license.LicensingTypeId === '')
            return 'Loại giấy phép';
        if ($scope.license.ExpireDate === null || $scope.license.ExpireDate === undefined || $scope.license.ExpireDate === '')
            return 'Ngày giấy phép hết hạn';
        if ($scope.license.Business.Name === null || $scope.license.Business.Name === undefined || $scope.license.Business.Name === '')
            return 'Tên chủ giấy phép';
        if ($scope.license.Business.Address === null || $scope.license.Business.Address === undefined || $scope.license.Business.Address === '')
            return 'Địa chỉ chủ giấy phép';
        if ($scope.license.Construction.ConstructionName === null || $scope.license.Construction.ConstructionName === undefined || $scope.license.Construction.ConstructionName === '')
            return 'Công trình cấp phép';
        return false;
    }

    function AddOneDay(date) {
        let d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate() + 1)
    }

    //save data to db license, construcction, consItem
    $scope.Save = function (formIdClose) {

        let GetFileAttachsLicense = document.getElementById('fileAttachsLicense').files;
        let FileAttLicense = GetFileAttachsLicense;
        if (FileAttLicense !== undefined) {
            if (FileAttLicense.length <= 0) {
                if ($scope.Action == "Add") {
                    toastr.warning("Bạn chưa chọn file giấy phép", "Cảnh báo");
                    return;
                }
            }
        }

        let checkRequired = CheckRequired()
        if ($scope.license.LicensingTypeId != 5) {
            if (checkRequired) {
                toastr.warning("Vui lòng nhập " + checkRequired);
                return;
            }
        }

        //Fixed an error in saving data, typing DateTime always deducted 1 day
        if ($scope.license.SignDate !== undefined && $scope.license.SignDate !== null)
            $scope.license.SignDate = AddOneDay($scope.license.SignDate)

        if ($scope.license.ExpireDate !== undefined && $scope.license.ExpireDate !== null)
            $scope.license.ExpireDate = AddOneDay($scope.license.ExpireDate)

        if ($scope.license.IssueDate !== undefined && $scope.license.IssueDate !== null)
            $scope.license.IssueDate = AddOneDay($scope.license.IssueDate)

        //save cons
        var newCons = $scope.license.Construction;

        newCons.TypeOfConstructionId = TypeOfConstructionId == 8 ? 8 : TypeOfConstructionId == 9 ? 9 : TypeOfConstructionId == 10 ? 10 : $scope.license.Construction.TypeOfConstructionId;
        constructionService.SaveConstruction(newCons).then(function (msg) {
            //save license
            if (msg.data.Id > 0) {
                $scope.license.Construction.Id = msg.data.Id;
                $scope.license.ConstructionId = msg.data.Id;

                if ($scope.license.Business !== null && $scope.license.Business.length !== 0 && $scope.license.Business !== undefined) {
                    SaveBusiness();
                }

                //Save ConstructionItems
                if ($scope.license.Construction.ConstructionItems !== undefined) {
                    if ($scope.license.Construction.ConstructionItems !== null) {
                        $scope.license.Construction.ConstructionItems.forEach(function (conItem) {
                            conItem.ConstructionId = msg.data.Id;
                            conItem.AquiferId = msg.data.AquiferId;
                            constructionService.SaveConstructionDetail(conItem).then(function (msg) {
                                toastr.success("Lưu thành công", "Hạng mục công trình");
                            }, function () {
                                toastr.error("Lỗi", "Hạng mục công trình");
                            });
                        });
                    }
                }

                if ($scope.license.Construction.Inspection != null) {
                    let consid = msg.data.Id;
                    $scope.license.Construction.Inspection.forEach(function (item, index) {
                        if (item.InspectionDate !== undefined && item.InspectionDate !== null) {
                            item.InspectionDate = new Date(item.InspectionDate)
                        }
                        item.ConstructionId = consid;
                        SaveInspection(TypeOfConstructionId, index, item);
                    });
                }
            }
            toastr.success('Lưu thành công', 'Công trình');
            $scope.closeAside(formIdClose);
            GetDataLicenses();
        }, function (msg) {
            if ($scope.Action === "Update") {
                toastr.error('Lỗi cập nhật thông tin công trình', 'Công trình');
            }
            else {
                toastr.error('Lỗi thêm mới công trình', 'Công trình');
            }
        });
    }

    function SaveBusiness() {
        var newBusiness = $scope.license.Business;
        businessService.SaveBusiness(newBusiness).then(function (msg) {
            //save license
            if (msg.data.Id > 0) {
                SaveLicense(TypeOfConstructionId, msg.data.Id);
                if ($scope.Action === "Update") {
                    toastr.success('Cập nhật thông tin thành công', 'Tổ chức/cá nhân');
                }
                else {
                    toastr.success('Thêm mới thành công', 'Tổ chức/cá nhân');
                }
            }
        }, function (msg) {
            if ($scope.Action === "Update") {
                toastr.error('Lỗi cập nhật thông tin', 'Tổ chức/cá nhân');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Tổ chức/cá nhân');
            }
        });
    }

    function SaveLicense(TypeOfConstructionId, BusinessId) {
        let GetFileAttachsLicense = document.getElementById('fileAttachsLicense').files;
        let GetFileAttachsRelated = document.getElementById('fileAttachsRelated').files;
        let GetFileAttachsLicenseRequest = document.getElementById('fileAttachsLicenseRequest').files;
        let FileAttachsLicense = GetFileAttachsLicense;

        $scope.license.BusinessId = BusinessId;

        let consId = TypeOfConstructionId;

        let data = new FormData();

        if (GetFileAttachsLicense !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (GetFileAttachsLicense.length > 0) {
                for (let i = 0; i < GetFileAttachsLicense.length; i++) {
                    let str = GetFileAttachsLicense[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("LicenseFile", GetFileAttachsLicense[i]);
                    }
                    else {
                        document.getElementById('fileAttachsLicense').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Giấy phép")
                        return;
                    }
                }
            }
        }

        if (GetFileAttachsRelated !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (GetFileAttachsRelated.length > 0) {
                for (let i = 0; i < GetFileAttachsRelated.length; i++) {
                    let str = GetFileAttachsRelated[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("RelatedDocumentFile", GetFileAttachsRelated[i]);
                    }
                    else {
                        document.getElementById('fileAttachsRelated').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Hồ sơ pháp lý có liên quan")
                        return;
                    }
                }
            }
        }

        if (GetFileAttachsLicenseRequest !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (GetFileAttachsLicenseRequest.length > 0) {
                for (let i = 0; i < GetFileAttachsLicenseRequest.length; i++) {
                    let str = GetFileAttachsLicenseRequest[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("LicenseRequestFile", GetFileAttachsLicenseRequest[i]);
                    }
                    else {
                        document.getElementById('fileAttachsLicenseRequest').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Đơn xin cấp phép")
                        return;
                    }
                }
            }
        }

        if (FileAttachsLicense !== undefined) {// Save file on sql frist then to local if file not undefined
            if (FileAttachsLicense.length > 0) {
                if ($scope.Action === "Update") {
                    licenseService.DeleteLicenseFile($scope.license.LicenseFile, $scope.license.RelatedDocumentFile, GetFolderLicense(TypeOfConstructionId)); // xoa file cu khi update file moi
                }
                licenseService.SaveLicense($scope.license).then(function (msg) {
                    let licenseId = msg.data.Id;

                    let Name = msg.data.LicenseNumber.split('/').join('_');
                    $.ajax({
                        type: "POST",
                        url: "/api/License/upload?Id=" + licenseId + "&FolderName=" + GetFolderLicense(TypeOfConstructionId) + "&Name=" + Name,
                        contentType: false,
                        processData: false,
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            toastr.success("Lưu file thành công", "Giấy phép");
                        },
                        error: function (data) {
                            toastr.error("Lỗi khi tải file", "Giấy phép");
                        }
                    });
                    if ($scope.license.LicenseFee !== null && $scope.license.LicenseFee.length !== 0 && $scope.license.LicenseFee !== undefined) {
                        if ($scope.license.LicenseFee.SignDate !== undefined && $scope.license.LicenseFee.SignDate !== null) {
                            $scope.license.LicenseFee.SignDate = new Date($scope.license.LicenseFee.SignDate)
                        }

                        if ($scope.license.LicenseFee !== undefined) {
                            $scope.license.LicenseFee.LicensingAuthorities = msg.data.LicensingAuthorities;
                        }
                        SaveLinceseFee(licenseId);
                    }
                    if ($scope.license.MiningPurposes !== null && $scope.license.MiningPurposes.length !== 0 && $scope.license.MiningPurposes !== undefined) {
                        SaveMiningPurpose(licenseId, consId);
                    }
                }, function () {
                    toastr.error("Lỗi khi Lưu", "Giấy phép");
                });
                document.getElementById('fileAttachsLicense').value = null;
                document.getElementById('fileAttachsRelated').value = null;
                document.getElementById('fileAttachsLicenseRequest').value = null;

            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Giấy phép");
                    return;
                }
                if ($scope.Action === "Update") {
                    licenseService.SaveLicense($scope.license).then(function (msg) {
                        let licenseId = msg.data.Id;
                        if ($scope.license.LicenseFee != null) {
                            if ($scope.license.LicenseFee.SignDate !== undefined && $scope.license.LicenseFee.SignDate !== null) {
                                $scope.license.LicenseFee.SignDate = new Date($scope.license.LicenseFee.SignDate)
                            }
                            $scope.license.LicenseFee.LicensingAuthorities = msg.data.LicensingAuthorities;
                            SaveLinceseFee(licenseId);
                        }
                        if ($scope.license.MiningPurposes !== null && $scope.license.MiningPurposes.length !== 0 && $scope.license.MiningPurposes !== undefined) {
                            SaveMiningPurpose(licenseId, consId);
                        }
                        toastr.success("Cập nhật thành công", "Giấy phép");
                        document.getElementById('fileAttachsLicense').value = null;
                        document.getElementById('fileAttachsRelated').value = null;
                        document.getElementById('fileAttachsLicenseRequest').value = null;

                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Giấy phép");
                    });

                }
            }
        }
        document.getElementById('fileAttachsLicense').value = null;
        document.getElementById('fileAttachsRelated').value = null;
        document.getElementById('fileAttachsLicenseRequest').value = null;
        GetDataLicenses();
    }

    function SaveLinceseFee(LicenseId) {
        let files = document.getElementById('fileAttachsLicenseFee').files;
        let myfileAttach = files;
        let data = new FormData();
        let licFee = $scope.license.LicenseFee;
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    let str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("File", files[i]);
                    } else {
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Tiền cấp quyền")
                        document.getElementById('fileAttachsLicenseFee').value = null;
                        return;
                    }
                }
            }
        }

        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                if ($scope.Action === "Update") {
                    if (licFee.FilePDF != null || licFee.FilePDF != undefined) {
                        licenseFeeService.DeleteLicenseFeeFile(licFee.FilePDF); // delete old file when update new file
                    }
                }
                //Fixed an error in saving data, typing DateTime always deducted 1 day
                if (licFee.SignDate !== undefined && licFee.SignDate !== null)
                    licFee.SignDate = AddOneDay(licFee.SignDate)
                licenseFeeService.SaveLicenseFee(licFee, LicenseId).then(function (msg) {
                    if (licFee != null) {
                        let licLicF = {
                            LicenseId: LicenseId,
                            LicenseFeeId: msg.data.Id
                        }
                        licenseService.SaveLicenseLicenseFee(licLicF).then(function (msg) {
                            toastr.success("Lưu thành công", "Tiền cấp quyền - Giấy phép");
                        }, function (err) {
                            toastr.error("Lưu thất bại", "Tiền cấp quyền - Giấy phép");
                        })
                    }
                    let Name = msg.data.LicenseFeeNumber.split('/').join('_');
                    $.ajax({
                        type: "POST",
                        url: "/api/LicenseFee/upload?Id=" + msg.data.Id + "&Name=" + Name,
                        contentType: false,
                        processData: false,
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            if ($scope.Action === "Update") {
                                toastr.success("Cập nhật thành công", "Tiền cấp quyền");
                            }
                            else {
                                toastr.success("Lưu thành công", "Tiền cấp quyền");
                            }
                        },
                        error: function (data) {
                            toastr.error("Lỗi khi tải file", "Tiền cấp quyền");
                        }
                    });
                }, function () {
                    if ($scope.Action === "Update") {
                        toastr.success("Lỗi khi cập nhật", "Tiền cấp quyền");
                    }
                    else {
                        toastr.error("Lỗi khi lưu", "Tiền cấp quyền");
                    }
                });
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Tiền cấp quyền");
                    return;
                }
                if ($scope.Action === "Update") {
                    licenseFeeService.SaveLicenseFee(licFee, LicenseId).then(function (msg) {
                        if (licFee != null) {
                            let licLicF = {
                                LicenseId: LicenseId,
                                LicenseFeeId: msg.data.Id
                            }
                            licenseService.SaveLicenseLicenseFee(licLicF).then(function (msg) {
                                toastr.success("Lưu thành công", "Tiền cấp quyền - Giấy phép");
                            }, function (err) {
                                toastr.error("Lưu thất bại", "Tiền cấp quyền - Giấy phép");
                            })
                        }
                        toastr.success("Cập nhật thành công", "Tiền cấp quyền");
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Tiền cấp quyền");
                    });
                }
            }
            document.getElementById('fileAttachsLicenseFee').value = null;
        }
    }

    function SaveMiningPurpose(licenseId, consId) {
        if ($scope.license.MiningPurposes !== undefined) {
            if ($scope.license.MiningPurposes !== null) {
                $scope.license.MiningPurposes.forEach(function (e) {
                    e.LicenseId = licenseId;
                    e.ConstructionId = consId;
                    licenseService.SaveMiningPurpose(e).then(function (msg) {
                        toastr.success("Lưu thành công", "Mục đích khai thác sử dụng");
                    }, function () {
                        toastr.error("Lỗi", "Mục đích khai thác sử dụng");
                    });
                });
            }
        }
    }

    function SaveInspection(TypeOfConstructionId, index, item) {
        let files = document.getElementById('fileAttachsInspection' + index).files;
        let myfileAttach = files;
        let data = new FormData();
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    let str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("UploadedFile", files[i]);
                    } else {
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Thanh tra - Kiểm tra")
                        document.getElementById('fileAttachsInspection' + index).value = null;
                        return;
                    }
                }
            }
        }

        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                if ($scope.Action === "Update") {
                    inspectionService.DeleteFileInspection(item.FilePDF, GetFolderLicense(TypeOfConstructionId)); // xoa file cu khi update file moi
                }
                inspectionService.SaveInspection(item).then(function (msg) {
                    let Id = msg.data.Id;
                    $.ajax({
                        type: "POST",
                        url: "/api/Inspection/upload?Id=" + Id + "&FolderName=" + GetFolderLicense(TypeOfConstructionId),
                        contentType: false,
                        processData: false,
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            if ($scope.Action === "Update") {
                                toastr.success("Cập nhật thành công", "Thanh tra - Kiểm tra");
                            }
                            else {
                                toastr.success("Lưu thành công", "Thanh tra - Kiểm tra");
                            }
                        },
                        error: function (data) {
                            toastr.error("Lỗi khi tải file", "Thanh tra - Kiểm tra");
                        }
                    });
                }, function () {
                    if ($scope.Action === "Update") {
                        toastr.success("Lỗi khi cập nhật", "Thanh tra - Kiểm tra");
                    }
                    else {
                        toastr.error("Lỗi khi lưu", "Thanh tra - Kiểm tra");
                    }
                });
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Thanh tra - Kiểm tra");
                    return;
                }
                if ($scope.Action === "Update") {
                    inspectionService.SaveInspection(item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thanh tra - Kiểm tra");
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Thanh tra - Kiểm tra");
                    });
                }
            }
            document.getElementById('fileAttachsInspection' + index).value = null;
        }
    }

    $scope.showAnnotateLayer = true;

    // Show/hide anonate in map
    $scope.fncShowAnnotateLayer = function () {
        if ($scope.showAnnotateLayer == false) {
            $scope.showAnnotateLayer = true;
        } else {
            $scope.showAnnotateLayer = false;
        }
    }

    //Add icon for type of construction in map anonate
    $scope.AddIconToAnnotate = function (slug) {
        if (slug == '' || slug == null) {
            return '';
        } else {
            return '<img width=25 src="http://waterresources.loc/LocalFiles/images/ICON_GHICHUCONGTRINH/' + slug + '.png" />';
        }
    }

    //Open and clise aside, nav
    $scope.openAside = function (asideId) {
        closeAsideFile();
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-withmenu');
    }

    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-withmenu');
    }

    // Get file pdf
    $scope.openAsideFileLicense = function (TypeOfConsId, FilePDF) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/Licenses/' + GetFolderLicense(TypeOfConsId) + '/' + FilePDF;
    }

    $scope.openAsideFileLicenseFee = function (FilePDF) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/LicenseFee/' + FilePDF;
    }

    $scope.openAsideFileInspection = function (FilePDF) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/ThanhTra/' + GetFolderLicense(TypeOfConsId) + '/' + FilePDF;
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

    $scope.exportToExcel = function (tableId) {
        if (!tableId) {
            console.error('Invalid tableId');
            return;
        }

        // Wait for table rendering or any asynchronous operations if needed
        $timeout(function () {
            // Get the current location path
            let path = location.pathname.split('/');
            // Date to file name
            let d = new Date();
            let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
            let month = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1);

            // Generate file name
            let fileName = path[1] + '_' + path[2] + '_' + day + month + d.getFullYear() + ".xls";

            // Get the table content
            var table = angular.element(document.getElementById(tableId));
            var tableHtml = table.html();

            // Check if the table content is available
            if (!tableHtml) {
                console.error('Table content is undefined.');
                return;
            }

            // Generate exportHref
            var exportHref = Excel.tableToExcel(tableHtml, 'Sheet1');

            // Use $timeout to delay the download link creation
            $timeout(function () {
                var a = document.createElement('a');
                a.href = exportHref;
                a.download = fileName;
                a.click();
            }, 100);
        });
    };

    // Display text for LicensingAuthorities
    $scope.displayLA = function (LicensingAuthorities) {
        if (LicensingAuthorities == 0) {
            return "Bộ Tài nguyên và Môi trường";
        } else if (LicensingAuthorities == 1) {
            return "Uỷ ban nhân dân tỉnh"
        } else {
            return null;
        }
    }
});
app.factory('Excel', ['$window', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table { font-family: "Times New Roman", Times, serif; font-size: 12pt; border-collapse: collapse; } td, th { border: 1px solid black; }</style></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }); };

    return {
        tableToExcel: function (tableHtml, worksheetName) {
            var ctx = { worksheet: worksheetName, table: tableHtml },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
}]);
