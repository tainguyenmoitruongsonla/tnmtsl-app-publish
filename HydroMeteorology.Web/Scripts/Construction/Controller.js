app.controller("myCntrl", function ($scope, $filter, $window, constructionService, licenseService, basinService, businessService, typeOfConstructionService, toastr, Excel, $timeout) {
    'use strict'

    $scope.TotalConstruction = 0;
    $scope.licenseNumber = undefined;
    $scope.license_number = '';
    $scope.licenseTitle = '';
    $scope.IssueDateFilter = '';
    $scope.construction = {
        LicenseId: null,
        TypeOfConstructionId: null,
    };
    $scope.showAnnotateLayer = true;
    $scope.isDetail = true;

    var Status = true,
        TypeOfConstructionId = 0,
        ProvinceId = 0,
        DistrictId = 0,
        BasinId = 0,
        BusinessId = 0,
        CommuneId = 0,
        AquiferId = 0,
        CityCode = '',
        DistrictCode = '',
        LicenseId = -1,
        LicensingAuthorities = -1;

    $scope.Keyword = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5;

    $scope.ParentTypes = [];


    $scope.LicenseHolderFilter = '';
    $scope.LicenseFilter = '';
    $scope.LicensingAuthoritiesFilter = 'Chọn Cơ quan CP';
    $scope.TypeOfConstructionFilter = 'Chọn loại CT';
    $scope.DistrictFilter = 'Chọn huyện';
    $scope.AquiferFilter = 'Chọn tầng chứa nước';
    $scope.BasinFilter = 'Chọn tiểu vùng quy hoạch';


    $scope.ListLicensingAuthorities = [
        { Id: -1, Name: "Chọn Cơ quan CP" },
        { Id: 0, Name: "BTNMT" },
        { Id: 1, Name: "UBND Tỉnh" }
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
            $scope.selectedTypeOfConstruction = Id;
        } else {
            let pathName = location.pathname.split('/')[2];
            switch (pathName) {
                case "nuoc-mat":
                    TypeOfConstructionId = 1;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
                case "nuoc-duoi-dat":
                    TypeOfConstructionId = 2;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
                case "xa-thai":
                    TypeOfConstructionId = 3;
                    GetTypeOfConstruction(TypeOfConstructionId);
                    break;
            }
            $scope.TypeOfConstructionFilter = Name;
        }
        GetDataConstruction();
        AllCons();
    }

    $scope.filterConsByLicensingAuthorities = function (Id, Name) {
        LicensingAuthorities = Id;
        $scope.LicensingAuthoritiesFilter = Name;
        GetDataConstruction();
        AllCons();
    };
    $scope.filterConsByDistrict = function (Id, Name) {
        DistrictId = Id;
        $scope.DistrictFilter = Name;
    };
    $scope.filterConsByAquifer = function (Id, Name) {
        AquiferId = Id;
        $scope.AquiferFilter = Name;
    };
    $scope.filterConsByBasin = function (Id, Name) {
        BasinId = Id;
        $scope.BasinFilter = Name;
    };

    $scope.filterConsByBusiness = function (item) {
        if (item != 0) { BusinessId = item.Id; $scope.LicenseHolderFilter = item.Name }
        else { BusinessId = 0; $scope.LicenseHolderFilter = '' }
    }

    $scope.filterConsByLicense = function (item, InputId) {
        if (item != 0) { LicenseId = item.Id; $scope.LicenseFilter = item.LicenseNumber; }
        else { LicenseId = -1; $scope.ConstructionFilter = '' }
        SetInputVal(InputId, item)
    }

    function SetInputVal(Id, Data) {
        document.getElementById(Id).value = Data.LicenseNumber;
    }

    //search data license
    $scope.Search = function () {
        mymap.eachLayer((layer) => {
            if (layer['feature'] != undefined)
                layer.remove();
        });

        GetDataConstruction();
        AllCons();
    }

    //MAP
    function popupContent(cons) {
        let consItem = ``;
        // Neu cong trinh co hang muc se hien thi, nguoc lai thi khong hien thi
        if (cons.ConstructionItems.length > 0) {
            consItem += `<tr>
                    <td colspan="2" class="p-0 pt-2">
                        <table class="table table-bordered">
                            <tr>
                                <td>Hạng mục công trình</td>
                                <td>X(VN2000)</td>
                                <td>Y(VN2000)</td>
                            </tr>`;

            cons.ConstructionItems.map(value => {
                consItem += `<tr>
                                    <td class="py-1">${checkData(value.Name)}</td>
                                    <td class="py-1">${checkData(value.X)}</td>
                                    <td class="py-1">${checkData(value.Y)}</td>
                                </tr>
                            `;
            });

            consItem += `</table>
                        </td>
                    </tr>`;
        }

        let contentPopup = ``;
        var idDischargeCons = [17, 18, 19, 20, 21, 22, 23, 24];
        if (idDischargeCons.includes(cons.TypeOfConstructionId)) {
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
        } else if (cons.TypeOfConstructionId == 11 || cons.TypeOfConstructionId == 14) {
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

        return `<div class="card-primary card-outline card-outline-tabs map-info-card w-100 border-0">
            <h5 class="card-title text-center col-12 mb-2 font-weight-bold text-deepblue">`+ cons.ConstructionName + `</h5>
            <table class="table-contruction-info w-100 table-striped">
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
                    ${consItem}
                </tbody>
            </table>

        </div>`;
    }

    function checkData(data) {
        if (data !== null && data !== '' && data !== undefined) {
            return data;
        } else {
            return "-";
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
    }

    function onEachFeature(feature, layer) {
        var popupContent = feature.properties.Content;

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }

        layer.bindPopup(popupContent);
    }

    GetDataConstruction()
    function GetDataConstruction() {
        var datas = [];
        $scope.$watch('currentPage + numPerPage', function () {
            constructionService.getAllConstructions(TypeOfConstructionId, LicenseId, ProvinceId, DistrictId, CommuneId, BasinId, -1, Status, LicensingAuthorities, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.DataConstruction = items.data.ListData;
                $scope.TotalConstruction = items.data.TotalCount;
                CountAssignCons(items.data.ListData)

                showMarkerSubpage();
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
        ConsNoLicense();
    }

    //data basin
    GetBasins();
    function GetBasins() {
        basinService.getAllBasins(Status, '', true, 0, 0).then(function (items) {
            $scope.Basins = items.data.ListData;
        });
    }

    //data Bussines
    GetDataBusiness();
    function GetDataBusiness() {
        businessService.getAllBusinesses(Status, '', 0, 0).then(items => $scope.Business = items.data.ListData);
    }

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
        });
        var arrayType = ['nuocmat', 'nuocduoidat', 'xathai'];

        arrayType.forEach(function (e) {
            pointLayer = L.geoJSON(markerGroups[e], {
                pointToLayer: function (feature, latlng) {
                    var lay = L.marker(latlng, {
                        icon: L.divIcon({
                            html: '<img width=18 src="' + window.location.origin + '/LocalFiles/images/ICON_GHICHUCONGTRINH/' + feature.properties.Construction.TypeSlug + '.png" /><div style="display: none;" class="btn btn-sm title-of-marker font-11 py-0 px-1">' + feature.properties.Name + '</div>',
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

        // Click on the project name to zoom in on the map
        $scope.zoomConstruction = function (lng, lat, conId) {
            $('.content-wrapper').animate({ scrollTop: 0 }, "slow");
            mymap.closePopup();
            mymap.setView({ lng, lat }, 11);

            Object.keys(mymap._layers).forEach(function (e) {
                if (mymap._layers[e].feature != undefined) {
                    if (mymap._layers[e].feature.properties.Num == conId) {
                        mymap._layers[e].openPopup();
                    }
                }
            })
        }
    }

    //count & assign cons slug
    function CountAssignCons(dataConstruction) {
        $scope.countHydroelectric = 0;
        $scope.countIrrigation = 0;
        $scope.countPumpStation = 0;
        $scope.countWaterSupplyStation = 0;
        $scope.countDrainStation = 0;
        $scope.countExploitStation = 0;
        $scope.countDischargeWater = 0;
        $scope.countGroundExploration = 0;
        $scope.countDrillingPractice = 0;
        $scope.countIndustrialArea = 0;
        $scope.countHandycraftProduction = 0;
        $scope.countHospital = 0;
        $scope.countOtherDischarge = 0;

        var idDischargeCons = [17, 18, 19, 20, 21, 22, 23, 24];
        dataConstruction.forEach(function (e) {
            if (e.TypeOfConstructionId == 4) {
                e.typeSlug = 'thuydien';
                $scope.countHydroelectric += 1;
            } else if (e.TypeOfConstructionId == 5) {
                e.typeSlug = 'hochua';
                $scope.countIrrigation += 1;
            } else if (e.TypeOfConstructionId == 6) {
                e.typeSlug = 'trambom';
                $scope.countPumpStation += 1;
            } else if (e.TypeOfConstructionId == 11) {
                e.typeSlug = 'tramcapnuoc';
                $scope.countWaterSupplyStation += 1;
            } else if (e.TypeOfConstructionId == 13) {
                e.typeSlug = 'cong';
                $scope.countDrainStation += 1;
            } else if (e.TypeOfConstructionId == 14) {
                e.typeSlug = 'nhamaynuoc';
                $scope.countWaterFactory += 1;
            } else if (e.TypeOfConstructionId == 8) {
                e.typeSlug = 'khaithac';
                $scope.countExploitStation += 1;
            } else if (e.TypeOfConstructionId == 9) {
                e.typeSlug = 'thamdo';
                $scope.countGroundExploration += 1;
            } else if (e.TypeOfConstructionId == 10) {
                e.typeSlug = 'hanhnghekhoan';
                $scope.countDrillingPractice += 1;
            } else if (e.TypeOfConstructionId == 17) {
                e.typeSlug = 'kh_cumcn_taptrung';
                $scope.countIndustrialArea += 1;
            } else if (e.TypeOfConstructionId == 18) {
                e.typeSlug = 'sx_tieuthu_cn';
                $scope.countHandycraftProduction += 1;
            } else if (e.TypeOfConstructionId == 20) {
                e.typeSlug = 'cs_benhvien';
                $scope.countHospital += 1;
            } else if (e.TypeOfConstructionId == 23) {
                e.typeSlug = 'xathai_congtrinhkhac';
                $scope.countOtherDischarge += 1;
            }
        })
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

    //count total construction no have license
    function ConsNoLicense() {
        constructionService.getAllConstructions(TypeOfConstructionId, 0, ProvinceId, DistrictId, CommuneId, BasinId, -1, Status, LicensingAuthorities, '',1, 0).then(function (items) {
            $scope.TotalConsNoLicense = items.data.TotalCount;
        });
    }

    //get all construction
    function AllCons() {
        constructionService.getAllConstructions(TypeOfConstructionId, -1, ProvinceId, DistrictId, CommuneId, BasinId, -1, Status, LicensingAuthorities, '',1, 0).then(function (items) {
            $scope.DataConsForExportExcel = items.data.ListData;
        });
    }

    //data type of construction for create form
    function GetTypeOfConstruction(parrentId) {
        $scope.TypeOfConstructions = [];
        typeOfConstructionService.getTypeOfConstructions(parrentId, Status, '', 0, 0).then(function (items) {
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

    //filter license on page show list license
    //$scope.filterConsByType = function (typeId, parrentTypeId) {
    //    if (typeId > 3) {
    //        TypeOfConstructionId = typeId;
    //        GetDataConstruction();
    //        AllCons();
    //    }
    //    else if (typeId == undefined) {
    //        TypeOfConstructionId = parrentTypeId;
    //        GetDataConstruction();
    //        AllCons();
    //    }
    //    else if (typeId == 1) {
    //        TypeOfConstructionId = parrentTypeId;
    //        GetDataConstruction();
    //        AllCons();
    //    }
    //}

    function GetAllLicense(TypeOfConstructionId) {
        $scope.$watch('currentPage + numPerPage', function () {
            //ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, isDetail, Status, Keyword, PageIndex, PageSize
            licenseService.getAllLicenses(0, 0, 0, 0, TypeOfConstructionId, 0, 0, 0, 0, -1,-1, -1, false, true, '', 1, 0).then(function (items) {
                $scope.Licenses = items.data.ListData;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.CheckShowColumnTableByCons = function (TypeOfConstructionId, arr) {
        if (TypeOfConstructionId == 1) {
            return true;
        } else if (arr.includes(TypeOfConstructionId)) {
            return true;
        }
        return false;
    }

    //data basin
    GetBasins();
    function GetBasins() {
        basinService.getAllBasins(Status, $scope.Keyword, true, 0, 0).then(function (items) {
            $scope.Basins = items.data.ListData;
        });
    }

    //data province
    GetProvince();
    function GetProvince() {
        constructionService.getAllProvince($scope.Keyword, 0, 0).then(function (items) {
            $scope.Provinces = items.data.ListData;
        });
    }

    function GetDistricts(CityId) {
        constructionService.getDistrict(CityId, CityCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function GetCommune(DistrictId) {
        constructionService.getCommunes(DistrictId, CityCode, DistrictCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Communes = items.data.ListData;
            $scope.FilterCommunes = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.displayOperatingStatus = function (item) {
        if (item.Luuluongxatoithieu < item.MinimumFlow || item.Luuluongxaquanhamay > item.MaximumFlow || item.Luuluongxaquatran > item.MaximumDischargeFlow) {
            return '<div class="license_status hsd-danger"> Vận hành chưa đúng </div>';
        }
        return '<div class="license_status hsd-success"> Vận hành đúng </div>';
    }

    //filter cons by license id in create form
    $scope.GetLicenseId = function (Id, licenseNumber) {
        $scope.construction.LicenseId = Id;
        $scope.license_number = licenseNumber;
        $scope.construction.LicenseNumber = licenseNumber;
    }

    //format data from input filter cons by isuedate
    $scope.formatDateFilter = function () {
        $scope.myDate = new Date($scope.IssueDateFilter);
        $scope.IssueDateFilter = $filter('date')($scope.myDate, 'yyyy-MM-dd');
    }

    $scope.ProvinceChange = function (CityId) {
        if (CityId !== null) {
            GetDistricts(CityId);
        }
        else {
            $scope.Districts = [];
            $scope.Communes = [];
        }
    }

    $scope.DistrictChange = function (DistrictId) {
        if (DistrictId !== null) {
            GetCommune(DistrictId);
        }
        else {
            $scope.Communes = [];
        }
    }

    $scope.changeBasinAddNew = function (basinId) {
        $scope.construction.BasinId = basinId;
    }

    init();
    function init() {
        $scope.Keyword = '';
        $scope.currentPage = 1;
        let asideId = '';
        let pathName = location.pathname.split('/')[2];
        let param = location.search;
        if (param == '') {
            $scope.Keyword = '';
        }
        else {
            $scope.Keyword = param.split('?')[1].toString();
        }
        switch (pathName) {
            case "nuoc-mat":
                TypeOfConstructionId = 1;
                $scope.ShowAquifer = false;
                break;
            case "nuoc-duoi-dat":
                TypeOfConstructionId = 2;
                $scope.ShowAquifer = true;
                break;
            case "xa-thai":
                TypeOfConstructionId = 3;
                $scope.ShowAquifer = false;
                break;
            default:
                asideId = 'Construction';
                $scope.numPerPage = 0;
                $scope.isDetail = false;
                initMap();
                GetDataConstruction();
                break;
        }
        if (pathName != '' && pathName != undefined) { // Is not index page
            if (mymap) { mymap.remove(); }
            initMap();
            GetTypeOfConstruction(TypeOfConstructionId);
            GetAllLicense(TypeOfConstructionId);
            GetDataConstruction();
            GetDistricts(1);
            AllCons();
        }
    }

    //Open addew form
    $scope.AddDataCons = function (asideId) {
        $scope.license_number = '';
        $scope.construction = {
            LicenseId: null,
            TypeOfConstructionId: 0,
        };
        $scope.construction.ConstructionItems = [];
        $scope.Action = "Add";
        $scope.addnewWindowsHeader = "THÊM MỚI";

        openAside(asideId);
    }

    $scope.changeTypeOfCons = function (id) {
        $scope.construction.TypeOfConstructionId = id;
        GetAllLicense(id);
    }

    $scope.EditDataCons = function (asideId, item) {
        $scope.construction.ConstructionItems = [];
        $scope.Action = "Update";
        $scope.addnewWindowsHeader = "CHỈNH SỬA";
        $scope.license_number = item.licenseNumber;
        constructionService.getSingleConstruction(item.Id).then(function (item) {
            $scope.construction = item.data;
            $scope.Id = $scope.construction.TypeOfConstructionId;
            GetAllLicense($scope.construction.TypeOfConstructionId);
            constructionService.getConsItems(item.data.Id, true, '', 1, 0).then(function (consItem) {
                $scope.construction.ConstructionItems = consItem.data.ListData;
            })
            if ($scope.construction.ProvinceId > 0) {
                GetDistricts($scope.construction.ProvinceId);
                if ($scope.construction.DistrictId > 0) {
                    GetCommune($scope.construction.DistrictId);
                }
            }
        })
        openAside(asideId);
    }

    //add construction item
    $scope.AddConstructionItem = function () {
        if ($scope.construction.ConstructionItems === null) {
            $scope.construction.ConstructionItems = [];
        }
        var item = { Name: '', LatX: 0, LngY: 0 }
        $scope.construction.ConstructionItems.push(item);
    }

    //remove construction item
    $scope.RemoveConstructionItem = function (index, item) {
        $scope.construction.ConstructionItems.splice(index, 1);
        if (item.Name != '') {
            if (confirm('Xoá hạng mục ' + item.Name + '?')) {
                constructionService.DeleteConsItem(item).then(function (msg) {
                    toastr.success('Xóa thành công', 'Success');
                }, function () {
                    toastr.error('Có lỗi khi xóa', 'Error');
                });
            }
        }
    }

    $scope.Save = function (asideId) {
        constructionService.SaveConstruction($scope.construction).then(function (msg) {
            if ($scope.Action === "Update") {
                toastr.success('Cập nhật thông tin công trình thành công', 'THÀNH CÔNG');
            }
            else {
                toastr.success('Thêm mới thông tin công trình thành công', 'THÀNH CÔNG');
            }
            //Save ConstructionItems
            if ($scope.construction.ConstructionItems !== null) {
                $scope.construction.ConstructionItems.forEach(function (conItem) {
                    conItem.ConstructionId = msg.data.Id;
                    constructionService.SaveConstructionDetail(conItem).then(function (msg) {
                        if ($scope.Action === "Update") {
                            toastr.success('Cập nhật thông tin công trình thành công', 'THÀNH CÔNG');
                        }
                        else {
                            toastr.success('Thêm mới thông tin công trình thành công', 'THÀNH CÔNG');
                        }
                    });
                })
            }
            
            closeAside(asideId);
            GetDataConstruction();
            AllCons();
        }, function () {
            if ($scope.Action === "Update") {
                toastr.error('Lỗi cập nhật thông tin công trình', 'LỖI');
            }
            else {
                toastr.error('Lỗi thêm mới thông tin công trình', 'LỖI');
            }
        });
    }

    $scope.DeleteItem = function (item) {
        if ($window.confirm("Công trình này sẽ bị xoá?")) {
            constructionService.DeleteConstruction(item).then(function (msg) {
                toastr.success('Xóa thành công', 'THÀNH CÔNG');
                GetDataConstruction();
                AllCons();
            }, function () {
                toastr.error('Có lỗi khi xóa', 'LỖI');
            });
        } else {
            $scope.Message = "You clicked NO.";
        }
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
        $scope.construction = {
            LicenseId: null,
            TypeOfConstructionId: null,
        };
    }

    // get folder file pdf
    function GetFolder(TypeOfConstructionId) {
        switch (TypeOfConstructionId) {
            case 1: return 'nuocmat';
            case 2: return 'nuocduoidat';
            case 3: return 'xathai';
            case 4: return 'nuocmat';
            case 5: return 'nuocmat';
            case 6: return 'nuocmat';
            case 8: return 'nuocduoidat';
            case 9: return 'nuocduoidat';
            case 11: return 'nuocmat';
            case 14: return 'nuocmat';
            case 17: return 'xathai';
            case 18: return 'xathai';
            case 20: return 'xathai';
            case 23: return 'xathai';
            default: return '';
        }
    }

    // show file license
    $scope.openAsideFile = function (item) {
        $scope.fileSource = '/LocalFiles/pdf/Licenses/' + GetFolder(TypeOfConstructionId) + '/' + item.LicenseFile;
        openAsideFile();
    }

    // show file license fee
    $scope.openLicenseFeeFile = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/LicenseFee/' + item.LicenseFee[0].File;
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

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-withmenu');
    }

    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-withmenu');
    }

    // Show/hide construction name on map
    $scope.toggleShow = function () {
        $(".title-of-marker").fadeToggle("slow");
    }

    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        let pathName = location.pathname.split('/');

        //date to file name
        let d = new Date();
        let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        let month = parseInt(d.getMonth()) + 1 < 10 ? "0" + (parseInt(d.getMonth()) + 1) : parseInt(d.getMonth()) + 1;

        $timeout(function () {
            var a = document.createElement('a')
            a.href = exportHref
            a.download = pathName[1] + '_' + pathName[2] + '_' + day + month + d.getFullYear() + ".xls";
            a.click()
        }, 100);
        var exportHref = Excel.tableToExcel(tableId, 'Sheet1');
    }

    // Filter construction by district
    $scope.FilterDistrictChange = function (FilterDistrictId) {
        if (FilterDistrictId !== null) {
            GetCommune(FilterDistrictId);
            DistrictId = FilterDistrictId;
            GetDataConstruction();
        }
        else {
            $scope.FilterCommunes = [];
            DistrictId = 0;
            GetDataConstruction();
        }
    }

    //Filter construction by basin
    $scope.FilterBasin = function (FilterBasinId) {
        if (FilterBasinId != null) {
            BasinId = FilterBasinId;
            GetDataConstruction();
        } else {
            BasinId = 0;
            GetDataConstruction();
        }
    }
});
app.factory('Excel', ['$window', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table { font-family: "Times New Roman", Times, serif; font-size: 12pt; border-collapse: collapse; } td, th { border: 1px solid black; }</style></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
}]);