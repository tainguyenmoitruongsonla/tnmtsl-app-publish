app.service("myService", function ($http) {
    'use strict';

    this.SendMail = function (MailFromName, MailTo, MailSubject, strContent, IsHTMLFormat) {
        var response = $http({
            method: "post",
            url: "api/Email/send",
            data: {
                MailFromName: MailFromName,
                MailTo: [MailTo],
                MailSubject: MailSubject,
                strContent: strContent,
                IsHTMLFormat: IsHTMLFormat
            },
            datatype: "json"
        });
        return response;
    }
    this.SendMultiMail = function (MailFromName, MailTo, MailSubject, strContent, IsHTMLFormat) {
        var response = $http({
            method: "post",
            url: "api/Email/sendMulti",
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