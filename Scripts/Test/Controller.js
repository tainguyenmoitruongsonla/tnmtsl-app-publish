app.controller('ExcelReadCtrl', function ($scope, myService, toastr) {

    $scope.DataInput = [];

    GetData();
    function GetData() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.GetData('TVSUOITAN', '', false, 1, 0).then(function (items) {
                $scope.data = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    $scope.READ = function () {
        /*Checks whether the file is a valid excel file*/
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
        if ($("#ngexcelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
            xlsxflag = true;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            if (xlsxflag) {
                var workbook = XLSX.read(data, { type: 'binary' });
            }
            else {
                var workbook = XLS.read(data, { type: 'binary' });
            }

            var sheet_name_list = workbook.SheetNames;
            var cnt = 0;
            sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/

                if (xlsxflag) {
                    var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                }
                else {
                    var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                }
                if (exceljson.length > 0) {
                    for (var i = 0; i < exceljson.length; i++) {
                        $scope.DataInput.push(exceljson[i]);
                        $scope.$apply();
                    }
                }
            });
            if ($scope.DataInput !== null) {
                console.log($scope.DataInput)
                //$scope.DataInput.forEach(function (data) {
                //    data.StationCode = data.StationCode;
                //    myService.Save(data).then(function (msg) {
                //        console.log(msg.data);
                //        GetData();
                //    });
                //})
            }
        }
        if (xlsxflag) {
            reader.readAsArrayBuffer($("#ngexcelfile")[0].files[0]);
        }
        else {
            reader.readAsBinaryString($("#ngexcelfile")[0].files[0]);
        }


    };

});