app.service("datainfoService", function ($http) {
    'use strict';
    ///-----Begin License-----///
    //License
    this.getAllLicense = function (ParentId, ConstructionId, BusinessId, LicensingTypeId, TypeOfConstructionId, StartYear, EndYear, DistrictId, BasinId, AquiferId, Effect, LicensingAuthorities, isDetail, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/License/list",
            params: {
                ParentId: ParentId,
                ConstructionId: ConstructionId,
                BusinessId: BusinessId,
                LicensingTypeId: LicensingTypeId,
                TypeOfConstructionId: TypeOfConstructionId,
                StartYear: StartYear,
                EndYear: EndYear,
                DistrictId: DistrictId,
                BasinId: BasinId,
                AquiferId: AquiferId,
                Effect: Effect,
                LicensingAuthorities: LicensingAuthorities,
                isDetail: isDetail,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAllBasins
    this.getBasins = function (Status, Keyword, isDetail, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Basin/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                isDetail: isDetail,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //Lay thong tin trung uong
    this.getDocument = function (TypeId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Document/list",
            params: {
                TypeId: TypeId,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle Document
    this.getSingleDocument = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Document/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Save Document
    this.SaveDocument = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/Document/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.DeleteFileDocument = function (FileName, FolderName) {
        var response = $http({
            method: "post",
            url: "/api/Document/deletefile",
            params: {
                FileName: FileName,
                FolderName: FolderName
            }
        });
        return response;
    }

    //Delete Document
    this.DeleteDocument = function (item) {
        var response = $http({
            method: "post",
            url: "/api/Document/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //Lay thong tin khao sat địa chất
    this.getDataThongTinKhaoSatDiaChat = function (TieuVung, Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinKhaoSatDiaChat/list",
            params: {
                TieuVung: TieuVung,
                Keyword: Keyword,
                Status: Status,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingleDataThongTinKhaoSatDiaChat = function (id) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinKhaoSatDiaChat/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.SaveThongTinKhaoSatDiaChat = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinKhaoSatDiaChat/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteThongTinKhaoSatDiaChat = function (item) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinKhaoSatDiaChat/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //Lay thong tin đánh giá tiềm năng nước ngầm
    this.getDataThongTinDanhGiaTiemNangNuoc = function (Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinDanhGiaTiemNangNuoc/list",
            params: {
                Keyword: Keyword,
                Status: Status,
                PageIndex: PageIndex,
                PageSize: PageSize,
            }
        });
        return response;
    }



    this.getSingleDataThongTinDanhGiaTiemNangNuoc = function (id) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinDanhGiaTiemNangNuoc/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.SaveThongTinDanhGiaTiemNangNuoc = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinDanhGiaTiemNangNuoc/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteThongTinDanhGiaTiemNangNuoc = function (item) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinDanhGiaTiemNangNuoc/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //Lay thong tin ho so cong trinh nuoc mat
    this.getDataThongTinDuLieuHoSoTram = function (LoaiHoSoTram, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinDuLieuHoSoTram/list",
            params: {
                LoaiHoSoTram: LoaiHoSoTram,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    // Save or update thong tin ho so cong trinh nuoc mat
    this.SaveThongTinDuLieuHoSoTram = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinDuLieuHoSoTram/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete thong tin ho so cong trinh nuoc mat
    this.DeleteThongTinDuLieuHoSoTram = function (item) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinDuLieuHoSoTram/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    // delete file thong tin ho so cong trinh nuoc mat
    this.DeleteFileThongTinDuLieuHoSoTram = function (FileName) {
        var response = $http({
            method: "post",
            url: "/api/ThongTinDuLieuHoSoTram/deletefile",
            params: {
                FileName: FileName
            }
        });
        return response;
    }

    //Lay thong tin danh muc song noi tinh
    this.getDataDanhMucSongNoiTinh = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/DanhMucSongNoiTinh/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    // Save, update DanhMucSongNoiTinh
    this.SaveDanhMucSongNoiTinh = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/DanhMucSongNoiTinh/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete DanhMucSongNoiTinh
    this.DeleteDanhMucSongNoiTinh = function (item) {
        var response = $http({
            method: "post",
            url: "/api/DanhMucSongNoiTinh/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //Lay thong tin danh muc ao ho
    this.getDataDanhMucAoHo = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/DanhMucAoHo/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    // Save, update DanhMucAoHo
    this.SaveDanhMucAoHo = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/DanhMucAoHo/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete DanhMucAoHo
    this.DeleteDanhMucAoHo = function (item) {
        var response = $http({
            method: "post",
            url: "/api/DanhMucAoHo/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.getAllProvince = function (Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Province/list",
            params: {
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    this.getDistrict = function (CityId, CityCode, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/District/list",
            params: {
                CityId: CityId,
                CityCode: CityCode,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getCommunes = function (DistrictId, CityCode, DistrictCode, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Commune/list",
            params: {
                DistrictId: DistrictId,
                CityCode: CityCode,
                DistrictCode: DistrictCode,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSurveyfiguresSurfacewater = function (Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/SurveyfiguresSurfacewater/list",
            params: {
                Keyword: Keyword,
                Status: Status,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingleSurveyfiguresSurfacewater = function (Id) {
        var response = $http({
            method: "get",
            url: "/api/SurveyfiguresSurfacewater/getbyid",
            params: {
                Id : Id,
            }
        });
        return response;
    }

    this.SaveSurveyfiguresSurfacewater = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/SurveyfiguresSurfacewater/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.DeleteSurveyfiguresSurfacewater = function (item) {
        var response = $http({
            method: "post",
            url: "/api/SurveyfiguresSurfacewater/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    this.getSurveyfiguresDischargewater = function (Keyword, Status, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/SurveyfiguresDischargewater/list",
            params: {
                Keyword: Keyword,
                Status: Status,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingleSurveyfiguresDischargewater = function (Id) {
        var response = $http({
            method: "get",
            url: "/api/SurveyfiguresDischargewater/getbyid",
            params: {
                Id: Id,
            }
        });
        return response;
    }

    this.SaveSurveyfiguresDischargewater = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/SurveyfiguresDischargewater/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    this.DeleteSurveyfiguresDischargewater = function (item) {
        var response = $http({
            method: "post",
            url: "/api/SurveyfiguresDischargewater/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    // Thong tin tieu vung TNN
    this.getWaterResourcesData = function (Status, Keyword, isDetail, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/WaterResourcesData/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                isDetail: isDetail,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    // Save, update WaterResourcesData
    this.SaveWaterResourcesData = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/WaterResourcesData/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete WaterResourcesData
    this.DeleteWaterResourcesData = function (item) {
        var response = $http({
            method: "post",
            url: "/api/WaterResourcesData/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
    //getStation
    this.getAllStation = function (DistrictId, CommuneId, StationTypeId, Status, Keyword, StartDate, EndDate, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Station/list",
            params: {
                DistrictId: DistrictId,
                CommuneId: CommuneId,
                StationTypeId: StationTypeId,
                Status: Status,
                Keyword: Keyword,
                StartDate: StartDate,
                EndDate: EndDate,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});