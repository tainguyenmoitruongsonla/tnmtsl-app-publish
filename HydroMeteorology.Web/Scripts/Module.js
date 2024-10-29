var app = angular.module("myApp", ['ui.bootstrap', 'ngSanitize', 'angularjs-datetime-picker', 'ngFileUpload', 'slickCarousel']);
var baseUrl = "api";
app.filter('limitHtml', function () {
    return function (text, limit) {

        var changedString = String(text).replace(/<[^>]+>/gm, '');
        var length = changedString.length;

        return length > limit ? changedString.substr(0, limit - 1) + '...' : changedString;
    }
});

app.filter('limitHtmlWord', function () {
    return function (text, limit) {
        var changedString = String(text).split(' ');
        var returnStr = '';

        if (changedString.length > limit) {
            returnStr = changedString[0];
            var x;
            for (x = 1; x < limit; x++) {
                returnStr = returnStr + " " + changedString[x];
            }
            returnStr = returnStr + "...";
        }
        else {
            returnStr = text;
        }
        return returnStr;
    }
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});