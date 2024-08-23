app.service("myService", function ($http) {
    'use strict';

    //Begin NewsCategories
    this.getNewsCategories = function (PortalId, ParentId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/NewsCategory/list",
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
    //GetSingle
    this.getSingleNewsCategory = function (id) {
        var response = $http({
            method: "get",
            url: "/api/NewsCategory/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }
    //End NewsCategories/.
    //GetAll NewsContent
    this.getAllNewsContent = function (PortalId, CategoryId, Status, Keyword, PageIndex, PageSize) {
        var response = $http({
            method: "get",
            url: "/api/NewsContent/list",
            params: {
                PortalId: PortalId,
                CategoryId: CategoryId,
                Status: Status,
                Keyword: Keyword,
                PageIndex: PageIndex,
                PageSize: PageSize
            }
        });
        return response;
    }

    //GetSingle
    this.getSingleNewsContent = function (id) {
        var response = $http({
            method: "get",
            url: "/api/NewsContent/getbyid",
            params: {
                id: id
            }
        });
        return response;
    }

    // Update Doc type
    this.Save = function (Item) {
        var response = $http({
            method: "post",
            url: "/api/NewsContent/save",
            data: JSON.stringify(Item),
            datatype: "json"
        });
        return response;
    }

    //Delete
    this.DeleteItem = function (item) {
        var response = $http({
            method: "post",
            url: "/api/NewsContent/delete",
            data: item,
            dataType: "json"
        });
        return response;
    }
});