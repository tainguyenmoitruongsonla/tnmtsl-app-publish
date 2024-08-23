app.service("monitoringSystemService", function ($http) {
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

    this.SendMultiMail = function (MailFromName, MailTo, MailSubject, strContent, IsHTMLFormat) {
        var response = $http({
            method: "post",
            url: "/api/Email/sendMulti",
            data: {
                MailFromName: MailFromName,
                MailTo: MailTo,
                MailSubject: MailSubject,
                strContent: strContent,
                IsHTMLFormat: IsHTMLFormat
            },
            datatype: "json"
        });
        return response;
    }
});