app.controller("myCntrl", function ($scope, myService, toastr) {
    'use strict'
    var md = angular.element(document.getElementById("moduleval"));
    var ModuleId = md.val();
    var pt = angular.element(document.getElementById("portalval"));
    var PortalId = pt.val;
    var username = angular.element(document.getElementById("tbxUsername"));
    var Username = document.getElementById("tbxUsername").value;
    console.log(Username);
    $scope.divFrm = false;
    //To Get All Records  
    $scope.TotalItem = 0
        , $scope.Genders = [{ Id: 'M', Name: 'Nam' }, { Id: 'F', Name: 'Nữ' }]
        , $scope.Boarding = [{ Id: 1, Name: 'Ngoại trú' }, { Id: 2, Name: 'Nội trú' }]
        , $scope.CollectionDoc = [
        { Id: 1, Name: '1. Giấy khai sinh', Notation: 'GKS', FileName: '', ViewFileBrowser: true},
        { Id: 2, Name: '2. Chứng mình thư nhân dân/Căn cước công dân', Notation: '', FileName: '', ViewFileBrowser: false },
        { Id: 3, Name: '2.1 Mặt trước', Notation: 'CMT_Front', FileName: '', ViewFileBrowser: true },
        { Id: 4, Name: '2.2 Mặt sau', Notation: 'CMT_Back', FileName: '', ViewFileBrowser: true },
        { Id: 5, Name: '3. Ảnh màu 4x6cm', Notation: 'Anh4x6', FileName: '', ViewFileBrowser: true },
        { Id: 6, Name: '4. Học bạ THPT (bản chính)', Notation: '', FileName: '', ViewFileBrowser: false },
        { Id: 7, Name: '4.1 Trang đầu tiên có đóng dấu giáp lai vào ảnh', Notation: 'HocBa01', FileName: '', ViewFileBrowser: true },
        { Id: 8, Name: '4.2 Trang kết quả học tập lớp 10', Notation: 'Hocbalop10', FileName: '', ViewFileBrowser: true },
        { Id: 9, Name: '4.3 Trang kết quả học tập lớp 11', Notation: 'Hocbalop11', FileName: '', ViewFileBrowser: true },
        { Id: 10, Name: '4.4 Trang kết quả học tập lớp 12', Notation: 'Hocbalop12', FileName: '', ViewFileBrowser: true },
        { Id: 11, Name: '5 Bản gốc bằng tốt nghiệp THPT (nếu đã có)', Notation: '', FileName: '', ViewFileBrowser: false },
        { Id: 12, Name: '5.1 Mặt trước', Notation: 'BangTN_Front', FileName: '', ViewFileBrowser: true },
        { Id: 13, Name: '5.2 Mặt sau', Notation: 'BangTN_Back', FileName: '', ViewFileBrowser: true },
        ]
        , $scope.myprofile = {}
        , $scope.currentPage = 1
        , $scope.numPerPage = 0
        , $scope.maxSize = 5
        , $scope.StudentCode = Username//'1951064053'//
        , $scope.Keyword='';
    var CityCode = '';
    var DistrictCode = '';

    $scope.mydate = moment(new Date()).format('DD/MM/YYYY');
    console.log($scope.mydate);


    function GetAllItems() {
        GetProvince();
        GetEnthic();
        GetReligion();
        GetWebGisByCode();
    }
    GetAllItems();

    $scope.ExportProfileToPdf = function (stCode) {
        myService.exportProfileToPdf(stCode).then(function (msg) {
            console.log(msg.data);

            var a = document.createElement("a");
            document.body.appendChild(a);
            var url = msg.data;
            a.href = url;
            a.target = "_blank";
            a.click();
            window.URL.revokeObjectURL(url);

        })
    }

    $scope.loadFile = function (files, Notation, FileOrder, FileDescription, StudentCode) {
        console.log($scope.myprofile);
        console.log(files, Notation, FileOrder, FileDescription, StudentCode);
        for (var i = 0; i < files.length; i++) {
            (function (file) {
                //if (file.type.indexOf("image") === 0)
                //{
                var fileReader = new FileReader();
                fileReader.onload = function (f) {
                    console.log(file);
                    $scope.item = {
                        StudentCode: $scope.myprofile.student_code,
                        base64Content: f.target.result,
                        FileName: file.name,
                        FileDescription: FileDescription,
                        Notation: Notation,
                        FileOrder: FileOrder,
                        ContentType: file.type,
                        FileSize: file.size,
                        filePath: ''
                    }
                    console.log($scope.item);
                    //return;
                    myService.uploadFile($scope.item).then(function (msg) {
                        GetWebGisFile($scope.item.StudentCode,'',0,0);
                    })
                };
                fileReader.readAsDataURL(file);
                //}
            })(files[i]);
        }
    }
    $scope.ViewImage = function (myprofile, f) {
        $scope.fileview = {};
        myService.getWebGisFileByCode(myprofile.student_code, f.Notation).then(function (items) {
            $scope.fileview = items.data;
            console.log($scope.fileview);
            if ($scope.fileview.FileUrl === null) {
                $scope.fileview.IsView = false;
            }
            console.log($scope.fileview);
        })
    }

    var angle = 0;
    $scope.RotateImage = function (item) {
        var img = document.getElementById(item);
        angle = (angle + 90) % 360;
        img.className = "rotate" + angle;
    }
    $scope.CloseImage = function (item) {
        var img = document.getElementById(item);
        img.className = "";
    }
    $scope.drlCityChange = function (CityId) {
        console.log(CityId);
        if (CityId !== null) {
            GetDistricts(CityId);
        }
        else {
            $scope.Districts = [];
            $scope.Communes = [];
        }
    }
    $scope.drlDistrictChange = function (DistrictId) {
        if (DistrictId !== null) {
            GetCommune(DistrictId)
        }
        else {
            $scope.Communes = [];
        }
    }

    $scope.Search = function () {
        alert($scope.Keyword);
    }
   
    function GetProvince() {
        $scope.$watch('currentPage + numPerPage', function () {
            myService.getAllProvince($scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.Provinces = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetDistricts(CityId) {
        myService.getDistrict(CityId, CityCode, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
            $scope.Districts = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetCommune(DistrictId) {
        myService.getCommunes(DistrictId, CityCode, DistrictCode, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
            $scope.Communes = items.data.ListData;
            $scope.TotalItem = items.data.TotalCount;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetEnthic() {
        myService.getEnthics().then(function (items) {
            $scope.Enthics = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetReligion() {
        myService.getReligions().then(function (items) {
            $scope.Religions = items.data.ListData;
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }
    function GetWebGisFile(StudentCode, Notation, PageIndex, PageSize)
    {
        myService.getWebGisFiles(StudentCode, Notation, PageIndex, PageSize).then(function (items) {
            $scope.studentfiles = items.data.ListData;
            console.log($scope.studentfiles);
            if ($scope.studentfiles !== undefined) {
                $scope.studentfiles.forEach(function (row) {
                    $scope.CollectionDoc.forEach(function (docRow) {
                        if (docRow.Notation === row.Notation) {
                            docRow.FileName = row.FileName;
                        }
                    })
                })
            }
        })
    }
    function GetWebGisByCode() {
        myService.getWebGisByCode($scope.StudentCode).then(function (item) {
            $scope.myprofile = item.data;
            if ($scope.myprofile.gender !== undefined) {
                //$scope.myprofile.gender
            }
            if ($scope.myprofile.province_id > 0) {
                console.log($scope.myprofile.province_id);
                GetDistricts($scope.myprofile.province_id);
                if ($scope.myprofile.district_id > 0) {
                    console.log($scope.myprofile.district_id);
                    GetCommune($scope.myprofile.district_id);
                }
            }
            //$scope.myprofile.birth_date = moment($scope.myprofile.birth_date).format('DD/MM/YYYY');
            //$scope.myprofile.id_number_date_of_issue = moment($scope.myprofile.id_number_date_of_issue).format('DD/MM/YYYY');
        })
        console.log($scope.myprofile.military_service_reg_date)
    }
    
    $scope.AddItem = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divFrm = true;
    }
    $scope.EditItem = function (item) {
        $scope.Action = "Update";
        myService.getSingle(item.Id).then(function (item) {
            $scope.myitem = item.data;
            console.log($scope.myitem);
        })

    }

    $scope.SaveStudentWebGisProfile = function () {
        var getAction = $scope.Action;

        $scope.myprofile.id_number_date_of_expire = changeDateFormat(document.getElementById('id_number_date_of_expire').value);
        console.log($scope.myprofile.id_number_date_of_expire);

        $scope.myprofile.military_service_reg_date = changeDateFormat(document.getElementById('military_service_reg_date').value);
        console.log($scope.myprofile.military_service_reg_date);

        $scope.myprofile.group_admission_date = changeDateFormat(document.getElementById('group_admission_date').value);
        console.log($scope.myprofile.group_admission_date);

        $scope.myprofile.communist_adminssion_date = changeDateFormat(document.getElementById('communist_adminssion_date').value);
        console.log($scope.myprofile.communist_adminssion_date);
        
        //return;
        myService.saveStudentWebGisProfile($scope.myprofile).then(function (msg) {
            toastr.success(msg.data, 'Update');
            GetWebGisByCode();
            $scope.divFrm = false;
        }, function () {
            if (getAction === "Update") {
                toastr.error('Lỗi cập nhật', 'Error');
            }
            else {
                toastr.error('Lỗi thêm mới', 'Error');
            }
        });
    }
    $scope.DeleteItem = function (item) {
        if (confirm('Item will be deleted?')) {
            myService.DeleteItem(item).then(function (msg) {
                GetData();
                toastr.success('Xóa thành công', 'Success');
            }, function () {
                toastr.error('Có lỗi khi xóa', 'Error');
            });
        }
    }
    $scope.openAdmissionNav = function (navId, item) {
        //myService.getSingle(item.Id).then(function (user) {
        //    $scope.myitem = user.data;
        //    myService.getRoles('', 0, 0).then(function (items) {
        //        $scope.AllRoles = items.data.ListData;
        //        $scope.AllRoles.forEach(function (role) {
        //            role.IsUserInRole = false;
        //            $scope.myitem.MyRoles.forEach(function (myrole) {
        //                if (role.Id === myrole.Id) {
        //                    role.IsUserInRole = true;
        //                }
        //            })
        //        });
        //    });
        //})
        GetWebGisFile($scope.StudentCode, '', 0, 0);
        openAside(navId);
    }
    $scope.openHomeNav = function (navId, item) {
        //myService.getSingle(item.Id).then(function (user) {
        //    $scope.myitem = user.data;
        //    myService.getRoles('', 0, 0).then(function (items) {
        //        $scope.AllRoles = items.data.ListData;
        //        $scope.AllRoles.forEach(function (role) {
        //            role.IsUserInRole = false;
        //            $scope.myitem.MyRoles.forEach(function (myrole) {
        //                if (role.Id === myrole.Id) {
        //                    role.IsUserInRole = true;
        //                }
        //            })
        //        });
        //    });
        //})
        openAside(navId);
    }
    $scope.closeAside = function (navId) {
        closeAside(navId);
    }

    function openAside(navId) {
        document.getElementById(navId).classList.add('sidenav-open');
    }
    function closeAside(navId) {
        document.getElementById(navId).classList.remove('sidenav-open');
    }
    function ClearFields() {
        $scope.myitem = {};
    }

    function changeDateFormat(indate) {
        var datadate = indate.split("/");
        return (datadate[1] + '/' + datadate[0] + '/' + datadate[2]);
    }

    function getWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }
});

app.directive("xdHref", function () {
    return function linkFn(scope, elem, attrs) {
        scope.$watch(attrs.xdHref, function (newVal) {
            newVal && elem.attr("href", newVal);
        });
    };
});