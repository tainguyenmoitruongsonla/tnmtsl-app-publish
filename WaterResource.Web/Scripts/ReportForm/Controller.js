app.controller("myCntrl", function ($scope, reportFormService, basinService, constructionService, licenseService, inspectionService, $window, $timeout, Excel, toastr) {
    'use strict'

    $scope.divFrm = false;

    $scope.TotalItem = 0, $scope.myitem = {}, $scope.currentPageInBieuMauSo7 = 1, $scope.numPerPageInBieuMauSo7 = 12, $scope.maxSize = 5, $scope.Keyword = '';
    var Status = true;

    //Ket qua cap phep
    //licensingResult()
    var ParentId = 0, ConstructionId = 0, BusinessId = 0, LicensingTypeId = 0, TypeOfConstructionId = 0, DistrictId = 0, CommuneId = 0, ProvinceId = 0, Status = true, PortalId = 0;
    $scope.currentPage = 1, $scope.numPerPage = 10;

    //so lieu chenh lech 2 cot
    $scope.Caculator = function (a, b) {
        return a - b;
    }

    //tính tổng của 1 cột
    $scope.Caculator1 = function (a, b) {
        return a - b;
    }

    $scope.max = function (max) {
        return max;
    }

    //bieu mau 1
    BieuMau1();
    function BieuMau1() {
        $scope.$watch('currentPage + numPerPage', function () {
            reportFormService.getBaoCaoBieuMauSoMot(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.BaoCaoBieuMauSoMot = items.data.ListData;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    // Bieu Mau 2
    BieuMau2();
    function BieuMau2() {
        $scope.$watch('currentPage + numPerPage', function () {
            reportFormService.getBaoCaoBieuMauSoHai(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.BaoCaoBieuMauSoHai = items.data.ListData;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    // Bieu Mau 3
    BieuMau3();
    function BieuMau3() {
        $scope.$watch('currentPage + numPerPage', function () {
            reportFormService.getBaoCaoBieuMauSoBa(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.BaoCaoBieuMauSoBa = items.data.ListData;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    // Bieu mau 4
    function BieuMau4() {
        $scope.currentPageInBieuMauSo4 = 1;
        $scope.numPerPageInBieuMauSo4 = 12;
        $scope.$watch('currentPageInBieuMauSo4 + numPerPageInBieuMauSo4', function () {
            reportFormService.getBaoCaoBieuMauSoBon(Status, $scope.Keyword, $scope.currentPageInBieuMauSo4, $scope.numPerPageInBieuMauSo4).then(function (items) {
                $scope.DataBieuMauSo4 = items.data.ListData;
                $scope.TotalItemBieuMauSo4 = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function BieuMau5() {
        $scope.currentPageInBieuMauSo5 = 1;
        $scope.numPerPageInBieuMauSo5 = 12;
        $scope.$watch('currentPageInBieuMauSo5 + numPerPageInBieuMauSo5', function () {
            reportFormService.getBaoCaoBieuMauSoNam(Status, $scope.Keyword, $scope.currentPageInBieuMauSo5, $scope.numPerPageInBieuMauSo5).then(function (items) {
                $scope.DataBieuMauSo5 = items.data.ListData;
                $scope.TotalItem = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    //bieu 6A dem ho thuy dien, 6B dem ho chua
    function BieuMau6(bieumau) {
        $scope.BieuMau6 = [];
        $scope.TotalDataBieuMau6 = [];

        //lay ra huyen
        reportFormService.getDistrict(0, '', '', 1, 0).then(function (items) {
            items.data.ListData.forEach(function (row) {
                //bien luu doi tuong  them vao mang $scope.BieuMau6
                var itemBieuMau6 = { Id: row.Id, DistrictName: row.DistrictName, TotalConstructions: 0, Constructions: [] }
                constructionService.getAllConstructions(TypeOfConstructionId, -1, 0, row.Id, 0, 0, -1, true, -1, '', 1, 0).then(function (items) {
                    //day tong so cong trinh vao mang luu du lieu
                    itemBieuMau6.TotalConstructions = items.data.TotalCount;
                    items.data.ListData.forEach(function (row) {
                        if (bieumau == 6) {
                            if (row.TotalCapacity == null) {
                                row.TotalCapacity = 0;
                            }
                            if (row.UsefulCapacity == null) {
                                row.UsefulCapacity = 0;
                            }
                            $scope.TotalDataBieuMau6.push({ TotalCapacity: row.TotalCapacity, UsefulCapacity: row.UsefulCapacity })
                            var consItem = { Id: row.Id, TotalCapacity: row.TotalCapacity, UsefulCapacity: row.UsefulCapacity }
                            itemBieuMau6.Constructions.push(consItem);
                        }
                    });
                })
                //Bieu mau 6
                $scope.BieuMau6.push(itemBieuMau6);
            })
        });
    }

    function BieuMau7() {
        $scope.currentPageInBieuMauSo7 = 1;
        $scope.numPerPageInBieuMauSo7 = 12;
        $scope.$watch('currentPageInBieuMauSo7 + numPerPageInBieuMauSo7', function () {
            reportFormService.getBaoCaoBieuMauSoBay(Status, $scope.Keyword, $scope.currentPageInBieuMauSo7, $scope.numPerPageInBieuMauSo7).then(function (items) {
                $scope.DataBieuMauSo7 = items.data.ListData;
                $scope.TotalItemBieuMauSo7 = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    BieuMau8();
    function BieuMau8() {
        $scope.$watch('currentPage + numPerPage', function () {
            reportFormService.getBaoCaoBieuMauSoTam(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.BaoCaoBieuMauSoTam = items.data.ListData;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    } 
    
    // lấy biểu số 9
    function BieuMau9(yearData) {
        $scope.BieuMau9 = [];
        $scope.TotalCons = [];

        var totalCons = { TotalThisPeriodSufacewaterCons: [], TotalPreviousPeriodSurfacewaterCons: [], TotalThisPeriodGroundwaterCons: [], TotalPreviousPeriodGroundwaterCons: [] }

        reportFormService.getDistrict(0, '', '', 1, 0).then(function (items) {
            items.data.ListData.forEach(function (row) {
                var itemBieuMau9 = { Id: row.Id, DistrictName: row.DistrictName, ThisPeriodSufacewaterCons: [], PreviousPeriodSurfacewaterCons: [], ThisPeriodGroundwaterCons: [], PreviousPeriodGroundwaterCons: [] }

                //nuocmat
                constructionService.getAllConstructions(1, -1, ProvinceId, row.Id, 0, CommuneId, yearData, Status,-1,'', $scope.currentPage, $scope.numPerPage).then(function (items) {
                    var itemdata9 = { num: items.data.TotalCount };
                    totalCons.TotalPreviousPeriodSurfacewaterCons.push(itemdata9);
                    $scope.TotalPreviousPeriodSurfacewaterCons = totalCons.TotalPreviousPeriodSurfacewaterCons.reduce((a, b) => a + Number(b.num), 0);
                    itemBieuMau9.PreviousPeriodSurfacewaterCons.push(itemdata9);
                });

                constructionService.getAllConstructions(1, -1, ProvinceId, row.Id, 0, CommuneId, -1, Status, -1, '', $scope.currentPage, $scope.numPerPage).then(function (items) {
                    var itemdata9 = { num: items.data.TotalCount };
                    totalCons.TotalThisPeriodSufacewaterCons.push(itemdata9);
                    $scope.TotalThisPeriodSufacewaterCons = totalCons.TotalThisPeriodSufacewaterCons.reduce((a, b) => a + Number(b.num), 0);
                    itemBieuMau9.ThisPeriodSufacewaterCons.push(itemdata9);
                });

                //nuocduoidat
                constructionService.getAllConstructions(2, -1, ProvinceId, row.Id, 0, CommuneId, yearData, Status, -1, '', $scope.currentPage, $scope.numPerPage).then(function (items) {
                    var itemdata9 = { num: items.data.TotalCount };
                    totalCons.TotalPreviousPeriodGroundwaterCons.push(itemdata9);
                    $scope.TotalPreviousPeriodGroundwaterCons = totalCons.TotalPreviousPeriodGroundwaterCons.reduce((a, b) => a + Number(b.num), 0);
                    itemBieuMau9.PreviousPeriodGroundwaterCons.push(itemdata9);
                });

                constructionService.getAllConstructions(1, -1, ProvinceId, row.Id, 0, CommuneId, -1, Status, -1, '', $scope.currentPage, $scope.numPerPage).then(function (items) {
                    var itemdata9 = { num: items.data.TotalCount };
                    totalCons.TotalThisPeriodGroundwaterCons.push(itemdata9);
                    $scope.TotalThisPeriodGroundwaterCons = totalCons.TotalThisPeriodGroundwaterCons.reduce((a, b) => a + Number(b.num), 0);
                    itemBieuMau9.ThisPeriodGroundwaterCons.push(itemdata9);
                });

                $scope.BieuMau9.push(itemBieuMau9);
            })
        });
        $scope.TotalCons.push(totalCons)
    }

    // BieuMauSo10
    function BieuMau10() {
        $scope.BieuMau10 = [];

        reportFormService.getDistrict(0, '', '', 1, 0).then(function (items) {
            items.data.ListData.forEach(function (row) {
                var itemBieuMau10 = { Id: row.Id, DistrictName: row.DistrictName, SurfaceWaterUsedForIrrigation: 0, GroundWaterUsedForIrrigation: 0, Hydroelectric: 0, SurfaceWaterUsedForOtherPurposes: 0, GroundWaterUsedForOtherPurposes: 0 }

                constructionService.getAllConstructions(1, -1, 0, row.Id, 0, 0, -1, true, -1, '', $scope.currentPage, $scope.numPerPage).then(function (items) {
                    var SurfaceWaterUsedForIrrigation = 0, SurfaceWaterUsedForOtherPurposes = 0, Hydroelectric = 0, GroundWaterUsedForIrrigatio = 0, GroundWaterUsedForOtherPurposes = 0;

                    items.data.ListData.forEach(function (cons) {
                        if (cons.ParentConstructionId !== 3) {
                            if (cons.ParentConstructionId == 1) {
                                if (cons.TypeOfConstructionId == 5) {
                                    SurfaceWaterUsedForIrrigation++;
                                    itemBieuMau10.SurfaceWaterUsedForIrrigation = SurfaceWaterUsedForIrrigation;
                                } else if (cons.TypeOfConstructionId == 4) {
                                    Hydroelectric++;
                                    itemBieuMau10.Hydroelectric = Hydroelectric;
                                } else {
                                    SurfaceWaterUsedForOtherPurposes++;
                                    itemBieuMau10.SurfaceWaterUsedForOtherPurposes = SurfaceWaterUsedForOtherPurposes;
                                }
                            } else {
                                if (cons.TypeOfConstructionId == 8) {
                                    GroundWaterUsedForIrrigatio++;
                                    itemBieuMau10.GroundWaterUsedForIrrigation = GroundWaterUsedForIrrigatio;
                                } else {
                                    GroundWaterUsedForOtherPurposes++;
                                    itemBieuMau10.GroundWaterUsedForOtherPurposes = GroundWaterUsedForOtherPurposes;
                                }
                            }
                        }
                    })
                });
                $scope.BieuMau10.push(itemBieuMau10);
            })
        });
    }

    // BieuMauSo11
    function BieuMau11() {
        $scope.BieuMau11 = [];

        reportFormService.getDistrict(0, '', '', 1, 0).then(function (items) {
            items.data.ListData.forEach(function (row) {
                var itemBieuMau11 = { Id: row.Id, DistrictName: row.DistrictName, Hydroelectric: 0, IrrigationLake: 0, SpillDam: 0, DrainForWater: 0, PumpStation: 0, OtherSurfaceWater: 0, DrillingWell: 0, OtherGroundWater: 0 }
                //all
                constructionService.getAllConstructions(1, -1, 0, row.Id, 0, 0, -1, true, -1, '', 1, 0).then(function (items) {
                    var Hydroelectric = 0, IrrigationLake = 0, SpillDam = 0, DrainForWater = 0, PumpStation = 0, OtherSurfaceWater = 0, DrillingWell = 0, OtherGroundWater = 0;

                    items.data.ListData.forEach(function (cons) {
                        if (cons.ParentConstructionId < 3) {
                            if (cons.ParentConstructionId == 1) {
                                switch (cons.TypeOfConstructionId) {
                                    case 4:
                                        Hydroelectric++;
                                        itemBieuMau11.Hydroelectric = Hydroelectric;
                                        break;
                                    case 5:
                                        IrrigationLake++;
                                        itemBieuMau11.IrrigationLake = IrrigationLake;
                                        break;
                                    case 6:
                                        PumpStation++;
                                        itemBieuMau11.PumpStation = PumpStation;
                                        break;
                                    case 12:
                                        SpillDam++;
                                        itemBieuMau11.SpillDam = SpillDam;
                                        break;
                                    case 13:
                                        DrainForWater++;
                                        itemBieuMau11.DrainForWater = DrainForWater;
                                        break;
                                    default:
                                        OtherSurfaceWater++;
                                        itemBieuMau11.OtherSurfaceWater = OtherSurfaceWater;
                                }
                            } else {
                                switch (cons.TypeOfConstructionId) {
                                    case 8:
                                        DrillingWell++;
                                        itemBieuMau11.DrillingWell = DrillingWell;
                                        break;
                                    default:
                                        OtherGroundWater++;
                                        itemBieuMau11.OtherGroundWater = OtherGroundWater;
                                }
                            }
                        }
                    })
                });
                $scope.BieuMau11.push(itemBieuMau11);
            })
        });
    }

    // Bieu Mau 12
    BieuMau12();
    function BieuMau12() {
        $scope.$watch('currentPage + numPerPage', function () {
            reportFormService.getBaoCaoBieuMauSoMuoiHai(Status, $scope.Keyword, $scope.currentPage, $scope.numPerPage).then(function (items) {
                $scope.BaoCaoBieuMauSoMuoiHai = items.data.ListData;
            });
            
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    } 
   

    function BieuMau13() { return; }
    function BieuMau14() { return; }

    // lấy kết quả cấp phép

    function BieuMau16() {
        $scope.BieuMau16 = [];
        const LicenseType = [
            { Name: 'Khai thác nước mặt', typeId: 1, Id: 1 },
            { Name: 'Khai thác nước dưới đất', typeId: 8, Id: 2 },
            { Name: 'Thăm dò nước dưới đất', typeId: 9, Id: 3 },
            { Name: 'Hành nghề khoan nước dưới đất', typeId: 10, Id: 4 },
            { Name: 'Xả nước thải vào nguồn nước', typeId: 3, Id:5 }
        ];
        LicenseType.forEach(function (e) {
            var itemBieuMau16 = {
                Id: e.Id,
                Name: e.Name,
                TWPreviousPeriod: 0,
                TWThisPeriod: 0,
                LocalPreviousPeriod: 0,
                LocalThisPeriod: 0
            };
            licenseService.getAllLicenses(-1, 0, 0, 0, e.typeId, -1, -1, 0, 0, -1, -1, -1, false, true, '', 1, 0).then(function (items)
            {
                items.data.ListData.forEach(function (license) {
                    const isWithinLastYear = new Date(license.IssueDate).getFullYear() <= (new Date().getFullYear() - 1);
                    const isTW = license.LicensingAuthorities == 0;
                    const isSurfaceWaterCons = license.ParentConstructionId == 1;
                    const isGroundWaterCons = license.ParentConstructionId == 2;
                    const isDischargeCons = license.ParentConstructionId == 3;
                    const typeOfConstructionId = license.TypeOfConstructionId;

                    if (isTW) {
                        if (isSurfaceWaterCons) {
                            itemBieuMau16.TWThisPeriod++;
                        } else if (isGroundWaterCons) {
                            if (typeOfConstructionId == 8) {
                                itemBieuMau16.TWThisPeriod++;
                            } else if (typeOfConstructionId == 9) {
                                itemBieuMau16.TWThisPeriod++;
                            } else if (typeOfConstructionId == 10) {
                                itemBieuMau16.TWThisPeriod++;
                            }
                        } else if (isDischargeCons) {
                            itemBieuMau16.TWThisPeriod++;
                        }

                        if (isWithinLastYear) {
                            if (isSurfaceWaterCons) {
                                itemBieuMau16.TWPreviousPeriod++;
                            } else if (isGroundWaterCons) {
                                if (typeOfConstructionId == 8) {
                                    itemBieuMau16.TWPreviousPeriod++;
                                } else if (typeOfConstructionId == 9) {
                                    itemBieuMau16.TWPreviousPeriod++;
                                } else if (typeOfConstructionId == 10) {
                                    itemBieuMau16.TWPreviousPeriod++;
                                }
                            } else if (isDischargeCons) {
                                itemBieuMau16.TWPreviousPeriod++;
                            }
                        }
                    } else {
                        if (isSurfaceWaterCons) {
                            itemBieuMau16.LocalThisPeriod++;
                        } else if (isGroundWaterCons) {
                            if (typeOfConstructionId == 8) {
                                itemBieuMau16.LocalThisPeriod++;
                            } else if (typeOfConstructionId == 9) {
                                itemBieuMau16.LocalThisPeriod++;
                            } else if (typeOfConstructionId == 10) {
                                itemBieuMau16.LocalThisPeriod++;
                            }
                        } else if (isDischargeCons) {
                            itemBieuMau16.LocalThisPeriod++;
                        }

                        if (isWithinLastYear) {
                            if (isSurfaceWaterCons) {
                                itemBieuMau16.LocalPreviousPeriod++;
                            } else if (isGroundWaterCons) {
                                if (typeOfConstructionId == 8) {
                                    itemBieuMau16.LocalPreviousPeriod++;
                                } else if (typeOfConstructionId == 9) {
                                    itemBieuMau16.LocalPreviousPeriod++;
                                } else if (typeOfConstructionId == 10) {
                                    itemBieuMau16.LocalPreviousPeriod++;
                                }
                            } else if (isDischargeCons) {
                                itemBieuMau16.LocalPreviousPeriod++;
                            }
                        }
                    }
                })
                $scope.BieuMau16.push(itemBieuMau16);
            })
        })
    }

    function BieuMau17() { return; }
    //Lay Luu vuc song
    function BieuMau18() {
        $scope.BieuMau18A = [];
        $scope.BieuMau18B = [];
        basinService.getAllBasins(true, '', true, 0, 0).then(function (items) {
            items.data.ListData.forEach(function (e) {
                //18A
                var bieumau18a = { Name: e.Name, River: [] }
                e.River.forEach(function (river) {
                    var rivers = { Id: river.Id, Name: river.Name, CommuneName: '', X: river.X, Y: river.Y, Qtt: river.Qtt }
                    reportFormService.getSingleCommune(river.CommuneId).then(function (item) {
                        rivers.CommuneName = item.data.CommuneName;
                    })
                    bieumau18a.River.push(rivers);
                })
                $scope.BieuMau18A.push(bieumau18a);

                //18B
                var bieumau18b = { Name: e.Name, Construction: [] }
                e.Construction.forEach(function (construction) {
                    var constructions = { Id: construction.Id, Name: construction.ConstructionName, CommuneName: '', X: construction.X, Y: construction.Y, Qtt: construction.MinimumFlow }
                    reportFormService.getSingleCommune(construction.CommuneId).then(function (item) {
                        constructions.CommuneName = item.data.CommuneName;
                    })
                    bieumau18b.Construction.push(constructions);
                })
                $scope.BieuMau18B.push(bieumau18b);
            })
        });
    }

    function BieuMau20() {
        $scope.CurrPageDataConstruction = 1;
        $scope.NumDataConstructionPerPage = 10;
        $scope.$watch('CurrPageDataConstruction + NumDataConstructionPerPage', function () {
            constructionService.getAllConstructions(1, -1, 0, 0, 0, 0, -1, true, -1, '', $scope.CurrPageDataConstruction, $scope.NumDataConstructionPerPage).then(function (items) {
                $scope.DataConstruction = items.data.ListData;
                $scope.DataConstruction.forEach(function (e) {
                    reportFormService.getSingleDistrict(e.DistrictId).then(function (item) {
                        e.DistrictName = item.data.DistrictName;
                    })
                    reportFormService.getSingleCommune(e.License.Construction.CommuneId).then(function (item) {
                        e.CommuneName = item.data.CommuneName;
                    })
                })
                $scope.TotalDataConstruction = items.data.TotalCount;
            });
        }, function () {
            toastr.error('Error in getting records', 'Error');
        });
    }

    function BieuMau25() { return; }

    function checkNum(data) {
        if (data != null || data != undefined) {
            return parseInt(data);
        } else {
            return 0;
        }
    }
    $scope.sumOfData = function (num1, num2, num3, num4, num5, num6, num7, num8, num9, num10) {
        return checkNum(num1) + checkNum(num2) + checkNum(num3) + checkNum(num4) + checkNum(num5) + checkNum(num6) + checkNum(num7) + checkNum(num8) + checkNum(num9) + checkNum(num10);
    }

    // Lay du lieu thong tin chất lượng nuoc mat biểu số 13
    var BasinCode = 0, RiverCode = 0, StationId = 0;
    $scope.numPerPageThongTinChatLuongNuocMat = 12;
    getDataThongTinChatLuongNuocMat()
    function getDataThongTinChatLuongNuocMat() {
        reportFormService.getDataThongTinChatLuongNuocMat(BasinCode, RiverCode, StationId, true, $scope.currentPage, $scope.numPerPageThongTinChatLuongNuocMat).then(function (items) {
            $scope.DataThongTinChatLuongNuocMat = items.data.ListData;
        });
    }

    // Lay du lieu thong tin chat lượng nuoc đuoi dat biểu số 14

    $scope.numPerPageThongTinChatLuongNuocDuoiDat = 12;
    getDataThongTinChatLuongNuocDuoiDat()
    function getDataThongTinChatLuongNuocDuoiDat() {
        reportFormService.getDataThongTinChatLuongNuocDuoiDat(BasinCode, RiverCode, StationId, true, $scope.currentPage, $scope.numPerPageThongTinChatLuongNuocDuoiDat).then(function (items) {
            $scope.DataThongTinChatLuongNuocDuoiDat = items.data.ListData;
        });
    }
    // Lay du lieu thong tin thanh tra kiểm tra
    var Inspection = 0, RiverCode = 0, StationId = 0;
    $scope.numPerPage_Inspection = 12;

    function getDataInspection() {
        constructionService.getAllConstructions(1, -1, 0, 0, 0, 0, -1, true, -1, '', 1,0).then(function (items) {
            $scope.AllConstruction = items.data.ListData;

            $scope.$watch('currentPage + numPerPage_Inspection', function () {
                inspectionService.getAllInspections(-1, true, $scope.Keyword, $scope.currentPage, $scope.numPerPage_Inspection).then(function (items) {
                    $scope.getDataInspection = items.data.ListData;
                    $scope.totalInspection = items.data.TotalCount

                    for (let i = 0; i < $scope.getDataInspection.length; i++) {
                        if ($scope.getDataInspection[i].ConstructionId !== null)
                            $scope.AllConstruction.forEach(function (row) {
                                if ($scope.getDataInspection[i].ConstructionId == row.Id) {
                                    $scope.getDataInspection[i].ConstructionName = row.ConstructionName;
                                    $scope.getDataInspection[i].TypeOfConstructionId = row.TypeOfConstructionId;
                                    return;
                                }
                            });
                    }
                });
            }, function () {
                toastr.error('Error in getting records', 'Error');
            });

            inspectionService.getAllInspections(-1, true, '', 0, 0).then(function (items) {
                $scope.AllInspection = items.data.ListData;
                for (let i = 0; i < $scope.AllInspection.length; i++) {
                    if ($scope.AllInspection[i].ConstructionId !== null)
                        $scope.AllConstruction.forEach(function (row) {
                            if ($scope.AllInspection[i].ConstructionId == row.Id) {
                                $scope.AllInspection[i].ConstructionName = row.ConstructionName;
                                return;
                            }
                        });
                }
            });
        });
    }
    // show file license fee
    $scope.openThanhTraFile = function (item) {
        openAsideFile();
        $scope.fileSource = '/LocalFiles/pdf/ThanhTra/' + getFolderThanhTra(item.TypeOfConstructionId) + '/' + item.FilePDF;
    }

    $scope.closeAsideFile = function () {
        closeAsideFile();
    }

    function openAsideFile() {
        document.getElementById("sideViewFile").classList.add('sideViewFile');
    }

    function closeAsideFile() {
        document.getElementById("sideViewFile").classList.remove('sideViewFile');
    }

    //openAside(asideId, loai cong trinh Id, bieu mau so)
    $scope.openAside = function (asideId, typeOfConsId, bieumau) {
        $scope.currentPage = 1;
        $scope.Keyword = '';
        if (typeOfConsId != undefined) {
            TypeOfConstructionId = typeOfConsId;
            switch (bieumau) {
                case 1: BieuMau1(); break;
                case 2: BieuMau2(); break;
                case 3: BieuMau3(); break;
                case 4: BieuMau4(); break;
                case 5: BieuMau5(); break;
                case 6: BieuMau6(bieumau); break;
                case 7: BieuMau7(); break;
                case 8: BieuMau8(); break;
                case 9: BieuMau9(0); break;
                case 10: BieuMau10(); break;
                case 11: BieuMau11(); break;
                case 12: BieuMau12(); break;
                case 13: BieuMau13(); break;
                case 14: BieuMau14(); break;
                case 15: BieuMau15(); break;
                case 16: BieuMau16(); break;
                case 17: BieuMau17(); break;
                case 18: BieuMau18(); break;
                case 19: getDataInspection(); break;
                case 20: BieuMau20(); break;
                case 25: BieuMau25(); break;
            }
        } else {
            TypeOfConstructionId = 0;
        }
        openAside(asideId);
    }

    $scope.closeAside = function (asideId) {
        closeAside(asideId);
    }

    function openAside(asideId) {
        document.getElementById(asideId).classList.add('sidenav-open');
    }
    function closeAside(asideId) {
        document.getElementById(asideId).classList.remove('sidenav-open');
    }
    $scope.getDatetime = new Date().toJSON("yyyy/MM/dd HH:mm");

    const now = new Date().getUTCFullYear();
    $scope.listYears = Array(now - (now - 22)).fill('').map((v, idx) => now - idx);

    $scope.selectYear = function (yearData) {
        BieuMau9(yearData);
    }

    //thêm mới dữ liệu biểu mẫu 19
    $scope.SearchThanhTra = function () {
        getDataInspection();
    }

    $scope.SetKeyword = function (keyword) {
        $scope.Keyword = keyword;
    }

    $scope.AddThanhTra = function (asideId) {
        $scope.item = {};
        $scope.construction_name = null;
        $scope.Action = "Add";
        $scope.HeaderAction = "THÊM MỚI";

        openAside(asideId)
    }
    $scope.SetConsId = function (Id, consName, typeId) {
        SetConsId(Id, consName, typeId);
    }
    function SetConsId(Id, consName, typeId) {
        $scope.item.ConstructionId = Id;
        $scope.item.TypeOfConstructionId = typeId;
        $scope.construction_name = consName;
    }

    $scope.EditThanhTra = function (asideId, item) {
        $scope.item = {};
        $scope.Action = "Update";
        $scope.HeaderAction = "CHỈNH SỬA";
        $scope.item = item;
        $scope.item.InspectionDate = item.InspectionDate.split("T")[0];
        SetConsId(item.ConstructionId, item.ConstructionName, item.TypeOfConstructionId);
        openAside(asideId)
    }

    function getFolderThanhTra(id) {
        if (id == 4 || id == 5 || id == 6 || id == 11 || id == 12 || id == 13 || id == 14 || id == 15)
            return 'NuocMat';
        else if (id == 8 || id == 9 || id == 10 || id == 16 || id == 24)
            return 'NuocDuoiDat';
        else if (id == 17 || id == 18 || id == 19 || id == 20 || id == 21 || id == 22 || id == 23)
            return 'XaThai';
        return '';
    }

    $scope.SaveThanhTra = function (asideV2Id, asideV1Id) {
        var files = document.getElementById('fileAttachs').files;
        var myfileAttach = files;

        if ($scope.item.ConstructionId === null || $scope.item.ConstructionId == undefined) {
            toastr.warning("Vui lòng chọn công trình phù hợp", "Cảnh báo");
            return;
        }

        var data = new FormData();
        if (files !== undefined) {// veryfile type pdf or png or ..
            // Add the uploaded file to the form data collection
            if (files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var str = files[i].name.toLowerCase();
                    if (str.includes("pdf", str.length - 4)) {
                        data.append("UploadedFile", files[i]);
                    }
                    else {
                        document.getElementById('fileAttachs').value = null;
                        toastr.warning("File " + str + " không được chấp nhận. Vui lòng chọn File PDF", "Cảnh báo")
                        return;
                    }
                }
            }
        }

        if (myfileAttach !== undefined) {// save file on sql frist then to local if file not undefined
            if (myfileAttach.length > 0) {
                if ($scope.Action === "Update") {
                    inspectionService.DeleteFileInspection($scope.item.FilePDF, getFolderThanhTra($scope.item.TypeOfConstructionId)); // xoa file cu khi update file moi
                }
                inspectionService.SaveInspection($scope.item).then(function (msg) {
                    var docId = msg.data.Id;
                    $.ajax({
                        type: "POST",
                        url: "/api/Inspection/upload?Id=" + docId + "&FolderName=" + getFolderThanhTra($scope.item.TypeOfConstructionId),
                        contentType: false,
                        processData: false,
                        dataType: 'JSON',
                        data: data,
                        success: function (data) {
                            toastr.success("Lưu thành công", "Thành công");
                            getDataInspection();
                        },
                        error: function (data) {
                            toastr.error("Lỗi khi tải file", "Lỗi");
                        }
                    });
                }, function () {
                    toastr.error("Lỗi khi Lưu", "Lỗi");
                });
                document.getElementById('fileAttachs').value = null;
            }
            else {
                if ($scope.Action === "Add") {
                    toastr.warning("Bạn chưa chọn File PDF", "Cảnh báo");
                    return;
                }
                if ($scope.Action === "Update") {
                    inspectionService.SaveInspection($scope.item).then(function (msg) {
                        toastr.success("Cập nhật thành công", "Thành công");
                        getDataInspection();
                        document.getElementById('fileAttachs').value = null;
                    }, function () {
                        toastr.success("Lỗi khi cập nhật", "Lỗi");
                    });
                }
            }
        }
        closeAside(asideV2Id);
        openAside(asideV1Id);
    }

    $scope.DeleteThanhTra = function (item) {
        if (confirm("Công trình này sẽ bị xoá?")) {
            inspectionService.DeleteFileInspection(item.FilePDF, getFolderThanhTra(item.TypeOfConstructionId)).then(function (msg) {
                if (msg) {
                    inspectionService.DeleteInspection(item).then(function (msg) {
                        toastr.success('Xóa thành công', 'Thành công');
                        getDataInspection();
                    }, function () {
                        toastr.error('Có lỗi khi xóa', 'Lỗi');
                    });
                }
                else {
                    toastr.error('Có lỗi khi xóa', 'Lỗi');
                }
            });
        }
    }


    function BieuMau15() {
        $scope.BieuMau15 = { Name: "Ủy ban nhân dân tỉnh", KyTruoc: 0, KyNay: 0, ThayDoi: 0 };
        reportFormService.getDocument(2, true, '', 0, 0).then(function (items) {
            items.data.ListData.forEach(function (e) {
                if (e.IssuedDate) {
                    let year = new Date(e.IssuedDate).getFullYear();
                    let curYear = new Date().getFullYear();
                    if (year < curYear)
                        $scope.BieuMau15.KyTruoc += 1;
                    if (year <= curYear)
                        $scope.BieuMau15.KyNay += 1;
                }
            });
            $scope.BieuMau15.ThayDoi = $scope.BieuMau15.KyNay - $scope.BieuMau15.KyTruoc;
        });
    }

    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        //date to file name
        let d = new Date();
        let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
        let month = parseInt(d.getMonth()) + 1 < 10 ? "0" + (parseInt(d.getMonth()) + 1) : parseInt(d.getMonth()) + 1;

        $timeout(function () {
            var a = document.createElement('a')
            a.href = exportHref
            a.download = tableId + '_' + day + month + d.getFullYear() + ".xls";
            a.click()
        }, 100);
        var exportHref = Excel.tableToExcel(tableId, 'Sheet1');
    }

});
app.factory('Excel', ['$window', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table { font-family: "Times New Roman", Times, serif; font-size: 12pt; border-collapse: collapse; } td, th { border: 1px solid black; }</style></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };

    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
}]);