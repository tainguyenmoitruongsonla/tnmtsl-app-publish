app.service("oneGateService", function ($http) {
    'use strict';


    this.getStorePreData = function (ConstructionCode, StartDate, EndDate, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/StoragePreData/getall",
            params: {
                ConstructionCode: ConstructionCode,
                StartDate: StartDate,
                EndDate: EndDate,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});