app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getTypeOfConstruction = function (PortalId, ParentId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/TypeOfConstruction/list",
            params: {
                PortalId: PortalId,
                ParentId: ParentId,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle TypeOfConstruction
    this.getSingleTypeOfConstruction = function (id) {
        var response = $http({
            method: "get",
            url: "/api/TypeOfConstruction/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
});