app.service("myService", function ($http) {
    'use strict';

    //GetAll
    this.getData = function (TypeOfStandardsSet, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/ClimateChangeStandardsSet/list",
            params: {
                TypeOfStandardsSet: TypeOfStandardsSet,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }
});