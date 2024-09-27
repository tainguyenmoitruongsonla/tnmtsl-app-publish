app.service("myService", function ($http) {
    'use strict';

    this.GetData = function (StationCode, DataType, isDetail, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/RainData/getdata",
            params: {
                StationCode: StationCode,
                DataType: DataType,
                isDetail: isDetail,
                PageIndex: PageIndex,
                PageSize: PageSize,
            }
        });
        return response;
    }

    // Update Doc type
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/RainData/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }
});