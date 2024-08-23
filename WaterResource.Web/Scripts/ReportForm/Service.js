app.service("reportFormService", function ($http) {
    'use strict';

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoMot = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoMot/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoHai = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoHai/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoBa = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoBa/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoTam = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoTam/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoBon = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoBon/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoNam = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoNam/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleBaoCaoBieuMauSoNam = function (id) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoNam/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
    // Update Doc type
    this.SaveBaoCaoBieuMauSoNam = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/BaoCaoBieuMauSoNam/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteBaoCaoBieuMauSoNam = function (item) {
        var response = $http({
            method: "post",
            url: "/api/BaoCaoBieuMauSoNam/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoSau = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoSau/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoBay = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoBay/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoChin = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoChin/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoMuoi = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoMuoi/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoMuoiMot = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoMuoi/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
    //GetAll
    // TRong ngoặc tương ứng với khai báo trong service
    this.getBaoCaoBieuMauSoMuoiHai = function (Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/BaoCaoBieuMauSoMuoiHai/list",
            params: {
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //Lay luu vực sông dùng cho tất cả các file trong thong tin cong trinh
    this.GetCommunes = function (CommuneId, ProvinceId, DistrictId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/Commune/list",
            params: {
                ProvinceId: ProvinceId,
                DistrictId: DistrictId,
                CommuneId: CommuneId,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    this.getSingleCommune = function (id) {
        var response = $http({
            method: "get",
            url: "/api/Commune/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    //lay ra huyen
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
    this.getSingleDistrict = function (id) {
        var response = $http({
            method: "get",
            url: "/api/District/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    //Lay thong tin so lieu nuoc mat biểu số 13
    this.getDataThongTinChatLuongNuocMat = function (BasinCode, RiverCode, StationId, Status) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinChatLuongNuocMat/list",
            params: {
                BasinCode: BasinCode,
                RiverCode: RiverCode,
                StationId: StationId,
                Status: Status,
            }
        });
        return response;
    }

    //Lay thong tin so lieu chat luong nuoc duoi dat biểu 14
    this.getDataThongTinChatLuongNuocDuoiDat = function (BasinCode, RiverCode, StationId, Status) {
        var response = $http({
            method: "get",
            url: "/api/ThongTinChatLuongNuocDuoiDat/list",
            params: {
                BasinCode: BasinCode,
                RiverCode: RiverCode,
                StationId: StationId,
                Status: Status,
            }
        });
        return response;
    }

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
});