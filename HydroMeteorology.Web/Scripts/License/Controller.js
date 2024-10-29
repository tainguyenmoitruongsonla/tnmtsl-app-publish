app.controller('myCntrl', function ($scope, licenseService, businessService, toastr) {
    'use strict'

    var d = new Date();


    $scope.getDatetime = d;
    $scope.CountLicenses = [0, 0, 0];
    $scope.license = {};
    $scope.license.Business = {};
    $scope.license.Station = {};
    $scope.license.Station = {
        CommuneId: 0,
        StationTypeId: 0
    };
    //$scope.filterLicense = undefined;
    $scope.isRevisionLicense = true;
    $scope.checkLicenseType = function (type) {
        if (type == undefined || type == '2') {
            $scope.isRevisionLicense = true;
        } else {
            $scope.isRevisionLicense = false;
        }
    }

    var Status = true, LicensingTypeId = 0, StationId = 0, DistrictId = 0, BusinessId = 0, ParentId = 0, DistrictId = 0, CommuneId = 0, CityCode = '',
        DistrictCode = '', StationTypeId = 0, LicensingAuthorities = -1;;
    $scope.Keyword = '',
        $scope.currentPage = 1,
        $scope.numPerPage = 20;
    $scope.DataYear = [];

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
    $scope.StationFilter = '';
    $scope.LicensingAuthoritiesFilter = 'Chọn Cơ quan CP';
    $scope.LicensingTypeFilter = 'Chọn loại hình CP';
    $scope.LicenseEffectFilter = 'Chọn hiệu lực GP';
    $scope.DistrictFilter = 'Chọn huyện';
    $scope.AquiferFilter = 'Chọn tầng chứa nước';
    $scope.BasinFilter = 'Chọn tiểu vùng quy hoạch';
    $scope.StationTypeFilter = 'Chọn loại trạm';

    $scope.ListLicensingAuthorities = [
        { Id: -1, Name: "Chọn Cơ quan CP" },
        { Id: 0, Name: "BTNMT" },
        { Id: 1, Name: "UBND Tỉnh" }
    ];
    $scope.ListLicensingTypes = [
        { Id: -1, Name: "Chọn loại hình giấy phép" },
        { Id: 1, Name: "Cấp mới" },
        { Id: 2, Name: "Cấp lại" },
        { Id: 3, Name: "Gia hạn" },
        { Id: 4, Name: "Điều chỉnh" },
        { Id: 5, Name: "Thu hồi" },
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

    //change license type
    $scope.changeLicenseTypeAddNew = function (LicensingTypeId) {
        $scope.license.LicensingTypeId = LicensingTypeId;
        $scope.checkAddOldLicense = checkAddOldLicense(LicensingTypeId)
        if (LicensingTypeId == 1)
            $scope.license.ParentId = 0;
    }

    //filter license on page show list license
    //$scope.filterConsByType = function (Id, Name) {
    //    TypeOfConstructionId = Id;
    //    $scope.TypeOfConstructionFilter = Name;
    //    switch (pathName) {
    //        case "nuoc-mat":
    //            TypeOfConstructionId = 1;
    //            GetTypeOfConstruction(TypeOfConstructionId);
    //            break;
    //        case "xa-thai":
    //            TypeOfConstructionId = 3;
    //            GetTypeOfConstruction(TypeOfConstructionId);
    //            break;
    //    }

    //    if (pathName != undefined) { GetDataLicenseKTTV(); }
    //}

    $scope.filterLicenseByType = function (Id, Name) {
        LicensingTypeId = Id;
        $scope.LicensingTypeFilter = Name;
        if (pathName != undefined) { GetDataLicenseKTTV(); }
    }

    $scope.filterStationByType = function (Id, Name) {
        StationTypeId = Id;
        $scope.StationTypeFilter = Name;
        if (pathName != undefined) { GetStationType(); }
    }


    $scope.filterLicenseByEffect = function (Id, Name) {
        Effect = Id;
        $scope.LicenseEffectFilter = Name;
        if (pathName != undefined) { GetDataLicenseKTTV(); }
    };

    $scope.filterLicenseByLicensingAuthorities = function (Id, Name) {
        LicensingAuthorities = Id;
        $scope.LicensingAuthoritiesFilter = Name;
        if (pathName != undefined) { GetDataLicenseKTTV(); }
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
    $scope.SetKeyword = function (k) {
        $scope.Keyword = k;
    }
    $scope.filterLicenseByBusiness = function (item, inputId) {
        if (item != 0) { BusinessId = item.Id; $scope.LicenseHolderFilter = item.Name }
        else { BusinessId = 0; $scope.LicenseHolderFilter = '' }
        SetInputVal(item, inputId);
    }

    $scope.filterLicenseByDataYear = function (StartYear, EndYear) {
        $scope.StartYearFilter = 'Từ năm: ' + StartYear;
        $scope.EndYearFilter = 'Đến năm: ' + EndYear;
        $scope.StartYear = StartYear;
        $scope.EndYear = EndYear;
    }

    $scope.filterLicenseByCons = function (item, inputId) {
        if (item != 0) { StationId = item.Id; $scope.ConstructionFilter = item.ConstructionName; }
        else { StationId = 0; $scope.ConstructionFilter = '' }
        SetInputVal(inputId, item);
    }

    $scope.GetStationData = function (station) {
        $scope.license.Station.Id = station.Id;
        $scope.license.Station.DistrictId = station.DistrictId;
        $scope.license.Station.CommuneId = station.CommuneId;
        $scope.license.Station = station;

        GetDataDistrict(ProvinceId);
        GetCommune(construction.DistrictId);
    }

    $scope.SetBusiness = function (item) {
        $scope.license.Business = item;
        $scope.license.Business.Id = item.Id;
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

        if (pathName != undefined) { GetDataLicenseKTTV(); }
        else {
            //countLicenseForChart();
        }
    }

    function SetInputVal(Id, Data) {
        document.getElementById(Id).value = Data.Name;
    }

    init();
    function init() {
        $scope.AddBtn = true;
        GetDataLicenseKTTV();
        GetDataLicensingTypes();
        GetDataDistrict();
        GetDataBusiness();
        GetStationType();
    }

    function GetDataLicenseKTTV() {
        $scope.$watch('currentPage + numPerPage', function () {
            licenseService.getData($scope.Keyword, Status, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Data = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            alert('Lỗi lấy dữ liệu');
        });
        licenseService.getData('', Status, 0, 0).then(function (items) {
            $scope.ItemForSearch = items.data.ListData;
            items.data.ListData.forEach(row => {
                if (row.ExpireDate) {
                    if (row.ExpireDate <= new Date() && row.ExpireDate >= (new Date() - 6 * 30 * 24 * 60 * 60 * 1000)) // 6 * 30 * 24 * 60 * 60 * 1000 = 6 thang
                        $scope.CountLicenses[0] += 1;
                    if (row.ExpireDate < new Date())
                        $scope.CountLicenses[1] += 1;
                }
            })
            $scope.CountLicenses[2] = items.data.TotalCount - $scope.CountLicenses[1];
        });
    }

    function GetAllStation(StationTypeId) {
        $scope.ActiveStation = 0;
        $scope.TotalStation = 0;
        $scope.InActiveStation = 0;
        licenseService.getAllStation(DistrictId, CommuneId, StationTypeId, true, '', 0, 0, 1, 0).then(function (items) {
            $scope.DataStation = items.data.ListData;
            $scope.TotalStation = items.data.TotalCount;
        });
    }

    function GetDataLicensingTypes() {
        licenseService.getAllLicensingTypes(0, 0, '', 1, 0).then(function (items) {
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

    function GetDataDistrict() {
        licenseService.getDistrict(0, CityCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Districts = items.data.ListData;
        });
    }

    function GetCommune(DistrictId) {
        licenseService.getCommunes(DistrictId, CityCode, DistrictCode, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Communes = items.data.ListData;
        });
    }

    function GetDataBusiness() {
        businessService.getAllBusinesses(Status, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Business = items.data.ListData;
        });
    }

    function GetStationType() {
        $scope.$watch('currentPage + numPerPage', function () {
            licenseService.getAllStationType(true, '', 1, 0).then(function (items) {
                $scope.StationTypes = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
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

    function formatDate(date) {
        if (date !== undefined) {
            if (date.includes("/")) {
                return date;
            } else {
                var d = new Date(date);
                var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                var month = parseInt(d.getMonth()) + 1 < 10 ? "0" + (parseInt(d.getMonth()) + 1) : parseInt(d.getMonth()) + 1;
                // day/month/year
                return day + '/' + month + '/' + d.getFullYear();
            }
        }
    }

    //$scope.Add = function (asideId) {
    //    $scope.item = {};
    //    $scope.Action = "Add";
    //    openAside(asideId);
    //}
    //open form create

    //open view single license
    $scope.viewLicense = function (item, asideId) {

        $scope.asideHeader = '<span>THÔNG TIN GIẤY PHÉP</span>';
        $scope.license = item;
        businessService.getAllBusinesses(Status, $scope.Keyword, 0, 0).then(function (items) {
            $scope.Business = items.data.ListData;
        });
        $scope.license.SignDate = formatDate(item.SignDate);
        $scope.license.IssueDate = formatDate(item.IssueDate);
        $scope.license.ExpireDate = formatDate(item.ExpireDate);
        //if (item.OldLicense !== null || item.OldLicense == undefined) {
        //    $scope.license.OldLicense.SignDate = formatDate(item.OldLicense.SignDate);
        //}

        openAside(asideId);
    }

    $scope.GetStationData = function (station) {
        $scope.license.StationId = station.Id;
        $scope.license.DistrictId = station.DistrictId;
        $scope.license.CommuneId = station.CommuneId;
        $scope.license.Station = station;

        GetDataDistrict(station.ProvinceId);
        GetCommune(station.DistrictId);
    }

    function checkAddOldLicense(LicensingTypeId) {
        if (LicensingTypeId == 1 || LicensingTypeId == undefined) {
            return false;
        } else {
            return true;
        }
    }

    $scope.addNewStation = function () {
        $scope.license.Station.Id = undefined;
        $scope.license.Station = {};
    }

    $scope.openFormCreatLicense = function (navOpen) {
        $scope.item = {};
        $scope.license.Business = {};
        $scope.license = {};
        $scope.license.Station = {};
        $scope.asideHeader = '<span>TẠO MỚI GIẤY PHÉP</span>';
        $scope.Action = "Add";
        openAside(navOpen);
    }

    //change city to get cityId and district belong to this city
    $scope.ProvinceChange = function (ProvinceId) {
        if (ProvinceId !== null) {
            GetDataDistrict(ProvinceId);
            $scope.license.Station.ProvinceId = ProvinceId;
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
            $scope.license.Station.DistrictId = DistrictId;
        }
        else {
            $scope.Communes = [];
        }
    }

    //change commune to get communeId
    $scope.CommunesChange = function (CommuneId) {
        if (CommuneId !== null) {
            $scope.license.Station.CommuneId = CommuneId;
        }
    }

    //change type of cons for show cons
    $scope.changeTypeOfStation = function (typeOfStationId, isIndexPage) {
        changeTypeOfStation(typeOfStationId, isIndexPage);
    }

    function changeTypeOfStation(typeOfStationId, isIndexPage) {
        $scope.license.StationTypeId = typeOfStationId;
        $scope.license.Station.StationTypeId = typeOfStationId;
        if (isIndexPage == false) {
            if (typeOfStationId != null) {
                GetAllStation(typeOfStationId)
            }
        } 
    }

    //Begin create, edit, delete data license
    $scope.Edit = function (item, formId, formCloseId) {
        //$scope.item = {};
        //$scope.Action = "Update";
        //licenseService.getSingle(item.Id).then(item => {
        //    $scope.item = item.data
        //    $scope.LicenseType = item.data.LicenseType + '';
        //});
        //openAside()
        $scope.Action = "Update"
        $scope.asideHeader = '<span>CHỈNH SỬA GIẤY PHÉP</span>';
        licenseService.getSingle(item.Id).then(item => {
            $scope.license = item.data;
        });
        GetDataDistrict(item.Station.ProvinceId);
        GetCommune(item.Station.DistrictId);
        closeAside(formCloseId);
        openAside(formId);
    }

    $scope.CheckLicenseEffect = function (license) {
        var reverseDate = '';
        if (license.ExpireDate == null || license.LicenseTypeName == "Thu hồi") {
            return '<div class="license_status hsd-revoked"> Giấy phép thu hồi </div>';
        }
        if (license.ExpireDate.includes('/')) {
            reverseDate = license.ExpireDate.split('/').reverse().join('-');
        } else {
            reverseDate = license.ExpireDate;
        }
        var endDate = new Date(reverseDate);
        if (license.IsRevoked == false) {
            if (license.License_Fk.LicensingTypeId == 5) {
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

    function CheckRequired() {
        if ($scope.license.LicenseNumber == null || $scope.license.LicenseNumber == undefined || $scope.license.LicenseNumber == '')
            return 'Số giấy phép';
        if ($scope.license.LicenseName == null || $scope.license.LicenseName == undefined || $scope.license.LicenseName == '')
            return 'Tên văn bản';
        if ($scope.license.LicensingAuthorities == null || $scope.license.LicensingAuthorities == undefined || $scope.license.LicensingAuthorities == '')
            return 'Cơ quan cấp phép';
        if ($scope.license.SignDate == null || $scope.license.SignDate == undefined || $scope.license.SignDate == '')
            return 'Ngày ký';
        if ($scope.license.IssueDate == null || $scope.license.IssueDate == undefined || $scope.license.IssueDate == '')
            return 'Ngày có hiệu lực';
        if ($scope.license.Duration == null || $scope.license.Duration == undefined || $scope.license.Duration == '')
            return 'Thời hạn giấy phép';
        if ($scope.license.ExpireDate == null || $scope.license.ExpireDate == undefined || $scope.license.ExpireDate == '')
            return 'Ngày hết hạn';
        if ($scope.license.Business.Name == null || $scope.license.Business.Name == undefined || $scope.license.Business.Name == '')
            return 'Chủ giấy phép';
        if ($scope.license.Business.Address == null || $scope.license.Business.Address == undefined || $scope.license.Business.Address == '')
            return 'Địa chỉ chủ giấy phép';
        return false;
    }

    $scope.Save = function (formCloseId) {
        
        let checkRequired = CheckRequired()
        if ($scope.license.LicensingTypeId != 5) {
            if (checkRequired) {
                toastr.warning("Vui lòng nhập " + checkRequired);
                return;
            }
        }

        if ($scope.license.SignDate !== undefined && $scope.license.SignDate !== null) {
            $scope.license.SignDate = new Date($scope.license.SignDate);
        }
        if ($scope.license.ExpireDate !== undefined && $scope.license.ExpireDate !== null) {
            $scope.license.ExpireDate = new Date($scope.license.ExpireDate);
        }
        if ($scope.license.IssueDate !== undefined && $scope.license.IssueDate !== null) {
            $scope.license.IssueDate = new Date($scope.license.IssueDate);
        }

        //save stations
        var newStation = $scope.license.Station;
        licenseService.SaveStation(newStation).then(function (msg) {
            //save license
            if (msg.data.Id > 0) {
                $scope.license.Station = msg.data;
                $scope.license.Station.Id = msg.data.Id;
                SaveLicense();
            }
            toastr.success('Lưu thành công', 'Trạm quan trắc');
            $scope.closeAside(formCloseId);
            GetDataLicenseKTTV();
        }, function (msg) {
            if ($scope.Action === "Update") {
                toastr.error('Lỗi cập nhật thông tin trạm quan trắc', 'Trạm quan trắc');
            }
            else {
                toastr.error('Lỗi thêm mới trạm quan trắc', 'Trạm quan trắc');
            }
        });
    }

    function SaveBusiness(LicenseId) {
        $scope.license.Id = LicenseId;
        var newBusiness = $scope.license.Business;
        businessService.SaveBusiness(newBusiness).then(function (msg) {
            //save license
            if (msg.data.Id > 0) {
                $scope.license.Business = msg.data;
                $scope.license.Business.Id = msg.data.Id;
                toastr.success('Lưu thành công', 'Tổ chức/cá nhân');
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

    function SaveLicense() {
        let GetFileAttachsLicense = document.getElementById('fileAttachsLicense').files;
        let GetFileAttachsRelated = document.getElementById('fileAttachsRelated').files;
        let GetFileAttachsLicenseRequest = document.getElementById('fileAttachsLicenseRequest').files;
        let FileAttachsLicense = GetFileAttachsLicense;
        if ($scope.license.Business !== null) {
            $scope.license.BusinessId = $scope.license.Business.Id;
        }

        //let consId = TypeOfConstructionId;

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
                    licenseService.DeleteLicenseFile($scope.license.LicenseFile, $scope.license.RelatedDocumentFile, $scope.license.LicenseRequestFile); // xoa file cu khi update file moi
                }
                licenseService.SaveLicense($scope.license).then(function (msg) {
                    let licenseId = msg.data.Id;

                    if ($scope.license.Station != null) {
                        let consLic = {
                            LicenseId: licenseId,
                            StationId: $scope.license.Station.Id
                        }
                        licenseService.SaveLicenseKTTVStation(consLic).then(function (msg) {
                            toastr.success("Lưu thành công", "Trạm - Giấy phép");
                        }, function (err) {
                            toastr.error("Lưu thất bại", "Trạm - Giấy phép");
                        })
                    }
                    let Name = msg.data.LicenseNumber.split('_').join('_');
                    $.ajax({
                        type: "POST",
                        url: "/api/LicenseKTTV/upload?Id=" + licenseId + "&Name=" + Name,
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
                    if ($scope.license.Business !== null && $scope.license.Business.length !== 0 && $scope.license.Business !== undefined) {
                        SaveBusiness(licenseId);
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
                        if ($scope.license.Construction != null) {
                            let consLic = {
                                LicenseId: licenseId,
                                ConstructionId: $scope.license.Construction.Id
                            }
                            licenseService.SaveLicenseKTTVStation(consLic).then(function (msg) {
                                toastr.success("Lưu thành công", "Công trình - Giấy phép");
                            }, function (err) {
                                toastr.error("Lưu thất bại", "Công trình - Giấy phép");
                            })
                        }
                        if ($scope.license.Business !== null && $scope.license.Business.length !== 0 && $scope.license.Business !== undefined) {
                            SaveBusiness(licenseId);
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
        GetDataLicenseKTTV();
    }

    $scope.Delete = function (item) {
        if (confirm('Xoá giấy phép ' + item.LicenseNumber + ' ?')) {
            if (item.LicenseFile != null) {
                licenseService.DeleteLicenseFile(item.LicenseFile, item.RelatedDocumentFile, item.LicenseRequestFile).then(function (msg) {
                    if (msg) {
                        toastr.success('Xóa thành công', 'Giấy phép');
                    }
                    else {
                        toastr.error('Có lỗi khi xóa', 'Giấy phép');
                    }
                });
            }
            licenseService.Delete(item).then(function (msg) {
                GetDataLicenseKTTV();
                toastr.success('Xóa thành công', 'Giấy phép');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Giấy phép');
            });
        }
    }


    $scope.openAside = function (asideId) {
        closeAsideFile();
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }

    //$scope.closeAsideFile = function () {
    //    closeAsideFile();
    //}

    //function openAsideFile() {
    //    document.getElementById("sideViewFile").classList.add('sideViewFile');
    //}

    //function closeAsideFile() {
    //    document.getElementById("sideViewFile").classList.remove('sideViewFile');
    //}
    //// hết Lấy file pdf

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open-withmenu');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open-withmenu');
    }

    //function closeAllNav() {
    //    closeAsideFile();
    //    let sidenavs = document.getElementsByClassName('sidenav-open-w50');
    //    for (let sidenav of sidenavs) {
    //        sidenav.classList.remove('sidenav-open-w50');
    //    }
    //}

    //// Lấy file pdf
    //$scope.openAsideFile = function (folder, pdf) {
    //    openAsideFile();
    //    $scope.fileSource = '/LocalFiles/pdf/License/' + folder + '/' + pdf;
    //}
    //$scope.calcDate = function (date) {
    //    var endDate = new Date(date);
    //    if (getLicenseStatus(endDate) > 0) {
    //        return '<div class="license_status hsd-danger"> Hết hiệu lực </div>';
    //    }
    //    else if (getLicenseStatus(endDate) <= 0) {
    //        if (getLicenseStatus(endDate) > - 180) {
    //            return '<div class="license_status hsd-warning"> Sắp hết hiệu lực </div>';
    //        } else if (getLicenseStatus(endDate) < - 180) {
    //            return '<div class="license_status hsd-success"> Còn hiệu lực </div>';
    //        }
    //    }

    //}
    //function getLicenseStatus(dateAcquired) {
    //    return Math.floor((new Date() - new Date(dateAcquired)) / (1000 * 3600 * 24));;
    //}

    $scope.SetOldLicense = function (item) {
        $scope.license.OldLicense = {};
        $scope.license.OldLicense = item;
        $scope.license.OldLicense.SignDate = formatDate(item.SignDate);
    }

});