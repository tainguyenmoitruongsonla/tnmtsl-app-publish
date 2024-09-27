app.controller("myCntrl", function ($scope, myService, basinService, toastr) {
    'use strict'

    init()
    function init() {
        $scope.BieuMau18A = [];
        basinService.getAllBasins(true, '', false, 0, 0).then(function (items) {
            items.data.ListData.forEach(function (e) {
                var bieumau18a = { Name: e.Name, River: [] }
                e.River.forEach(function (river) {
                    var rivers = { Id: river.Id, Name: river.Name, CommuneName: '', X: river.X, Y: river.Y, Qtt: river.Qtt }
                    myService.getSingleCommune(river.CommuneId).then(function (item) {
                        rivers.CommuneName = item.data.CommuneName;
                    })
                    bieumau18a.River.push(rivers);
                })
                $scope.BieuMau18A.push(bieumau18a);
            })
        });
    }
});