angular.module('signin.controllers', [])

.controller('SignInCtrl', function($scope, $ionicModal, $state, $stateParams, $ionicHistory, $http, ionicToast, AuthService, $rootScope, $cookies, ) {


    AuthService.GetCredentials(
        function() {
            if ($rootScope.userProfile === undefined && $rootScope.userProfile.id == "") {
                $scope.userProfile = AuthService.ResetUser();
            }
        }
    );




    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    $scope.doRegister = function(form) {
        //console.log(form);
        if (form.$valid) {
            $scope.userProfile.img = document.getElementById('user-photo').src;
            document.getElementById('photo-menu').src = document.getElementById('user-photo').src;
            $scope.userProfile.registrationId = $cookies.getObject('registrationIdZim');
            AuthService.Register($scope.userProfile);
        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }
    };

    $ionicModal.fromTemplateUrl('templates/signin-modal-login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };
    $scope.login = function() {
        $scope.modal.show();
    };

    $scope.doLogin = function(form) {
        //console.log(form);
        if (form.$valid) {
            //alert($scope.userProfile.registrationId);
            AuthService.Login($scope.userProfile);
            $scope.closeLogin();
        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }
    };


    $rootScope.codigo = "";
    $scope.codigo = "";

    if (undefined !== $stateParams.id) {
        $scope.id = $stateParams.id;
        console.log($scope.id);
    }

    $scope.doVerifyCode = function(form) {

        console.log($scope.userProfile);

        // 'Dl4mljnF9y34WRm4d9ABsTA3dNBd_blEtspc1Ub2a0M'
        if (form.$valid) {
            $http.post(url + "user/verifyCode", { 'id': $scope.id, 'codigo': $scope.userProfile.codigo }).then(function(res) {
                    var ret = res.data;
                    console.log(ret);

                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 20000000000);
                    } else {
                        if (ret.status == 'OK') {
                            AuthService.tratarRetorno(ret);
                            return true;
                        } else {
                            ionicToast.show(ret.msg, 'bottom', false, 2000000000000);
                            return false;
                        }

                    }
                },
                function(res) {
                    errorCallBack(res);
                    console.log(res);
                }
            );

        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }
    };

})


.controller('SignInLevelCtrl', function($scope, $state, $rootScope, AuthService, ionicToast, $http, $ionicHistory) {
    $rootScope.userProfile = AuthService.ResetUser();
    $rootScope.userProfile = AuthService.GetCredentials();
    $rootScope.userProfile.level = 1;

    $scope.saveLevelData = function(form) {
        if (form.$valid) {
            //$rootScope.userProfile.level = $scope.level;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });

            //console.log($rootScope.userProfile);

            $http.post(url + "user/edit", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                    var ret = res.data;
                    //console.log(ret);

                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            //console.log(document.getElementById('user-photo').src);
                            //$rootScope.userProfile = angular.fromJson(ret.msg);
                            $state.go('app.subjects');


                        } else {
                            ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                            return false;
                        }

                    }
                },
                function(res) {
                    errorCallBack(res)
                }
            );
        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }

    }
})



.controller('LogoutCtrl', function($scope, $state, $ionicHistory, AuthService) {
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    AuthService.ClearCredentials();
    $state.go('app.signin');
})



.controller('UserProfileCtrl', function($scope, $rootScope, $http, $ionicPopover, $state, ionicToast, AuthService, PhotoService, MapService, $ionicLoading, $ionicPopup, $timeout) {
    //AuthService.Verify();
    AuthService.GetCredentials();
    AuthService.Get();


    $scope.activeSlide = 0;

    //document.getElementById('photo-menu').src = 'https://www.google.com.br/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

    //console.log($scope.userProfile);
    //AuthService.Get();
    //console.log($rootScope.userProfile);

    $scope.doEditUser = function(form) {
        $scope.userProfile.img = document.getElementById('user-photo').src;

        //document.getElementById('photo-menu').src = document.getElementById('user-photo').src;
        //$rootScope.userProfile.img = $scope.userProfile.img;
        //alert(document.getElementById('user-photo').src);
        //alert(document.getElementById('photo-menu').src);

        if (form.$valid) {
            $http.post(url + "user/edit", { 'userProfile': $scope.userProfile }).then(function(res) {
                    //console.log(res.data);
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            //console.log(document.getElementById('user-photo').src);
                            $rootScope.userProfile = $scope.userProfile;
                            $rootScope.userProfile = angular.fromJson(ret.msg);

                            AuthService.SetCredentials();

                            //console.log(ret.msg.img);
                            //$rootScope.userProfile.img = ret.msg.img;

                            document.getElementById('user-photo').src = $rootScope.userProfile.img;
                            ionicToast.show("Seu perfil foi alterado :)", 'bottom', false, 2000);
                        } else {
                            ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                            return false;
                        }
                    }
                },
                function(res) {
                    errorCallBack(res)
                }
            );
        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }
    };


    $scope.showDelete = false;
    $scope.onHold = function(e) {
        //console.log('veio');
        $scope.showDelete = true;
    }
    $scope.deleteItem = function(index) {
        //console.log($scope.userProfile.addresses[index]);

        $http.post(url + "address/del", { 'userProfile': $rootScope.userProfile, 'address': $scope.userProfile.addresses[index] }).then(function(res) {
                console.log(res.data);
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show('Não foi possível excluir este endereço', 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        $scope.userProfile.addresses.splice(index, 1);
                    }
                }
            },
            function(res) {
                errorCallBack(res)
            }
        );
    }

    $ionicPopover.fromTemplateUrl('templates/user-profile.add-address.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);

        $rootScope.address = MapService.ResetAddress();

        $scope.doAddAddress = function(form) {
            if (form.$valid) {
                $http.post(url + "address/add", { 'userProfile': $scope.userProfile, 'address': $scope.address }).then(function(res) {
                        console.log(res.data);
                        var ret = res.data;
                        if (ret.status == 'erro') {
                            ionicToast.show(ret.msg, 'bottom', false, 2000);
                        } else {
                            if (ret.status == 'OK') {
                                //console.log(document.getElementById('user-photo').src);

                                $rootScope.userProfile.addresses.push($scope.address);
                                $scope.closePopover();
                                $scope.address = MapService.ResetAddress();

                                ionicToast.show("Endereço cadastrado. :)", 'bottom', false, 2000);
                            } else {
                                ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                                return false;
                            }

                        }
                    },
                    function(res) {
                        errorCallBack(res)
                    }
                );
            } else {
                ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
            }
        };
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };


    $scope.showInfoValor = function($event) {
        var template = '<ion-popover-view style="height: 90px;" ><ion-content scroll="false" style="color: #53c5cf; padding: 10px !important;">Considere o desconto de 20% pelos custos operacionais da plataforma Zim</ion-content></ion-popover-view>';
        //console.log(template);
        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });
        $scope.openPopover1 = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        $scope.openPopover1($event);
    }



    /*****ENDERECO**/
    $scope.selectLocation = function(location) {
        //console.log(location);
        var address = MapService.ResetAddress();
        address.name = location.structured_formatting.main_text;
        address.lat = location.lat;
        address.lng = location.lng;

        $rootScope.userProfile.address = address;
        $rootScope.userProfile.address.street = address.name;

        $rootScope.searchQuery = '';

    }
    $scope.neighArr = new Array();
    $scope.addNeighborhood = function(location) {
        if ($rootScope.userProfile.neighborhood.length == 3) {
            ionicToast.show("Você pode selecionar até 3 bairros.", 'bottom', false, 2000);
            return false;
        }
        //$rootScope.userProfile.neighborhood.push(neighborhood);
        //console.log(location.structured_formatting.main_text);
        var neigh = MapService.ResetNeighborhood();
        neigh.name = location.structured_formatting.main_text;
        neigh.lat = location.lat;
        neigh.lng = location.lng;

        $rootScope.userProfile.neighborhood.push(neigh);
        $scope.neighArr.push(neigh);

        //console.log($scope.neighArr);

        //$scope.neighborhood = '';
        $rootScope.searchQuery = '';

    }
    $scope.remNeighborhood = function(index) {
        $rootScope.userProfile.neighborhood.splice(index, 1);
        $scope.neighArr.splice(index, 1);
    }


    /*    $scope.loadPersonalData = function() {
            $state.go('app.signinteacherdocs')
        }*/

    $scope.saveAddressTeacher = function(form) {
        //console.log($rootScope.userProfile);
        //return;

        if (form.$valid) {
            if ($rootScope.userProfile.neighborhood.length == 0) {
                ionicToast.show("Selecione pelo menos um bairro para atendimento", 'bottom', false, 2000);
                return false;
            }
            $http.post(url + "address/saveTeacher", { 'userProfile': $scope.userProfile }).then(function(res) {
                    console.log(res.data);
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            ionicToast.show("Dados Alterados", 'bottom', false, 2000);
                        } else {
                            ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                            return false;
                        }

                    }
                },
                function(res) {
                    errorCallBack(res)
                }
            );
        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }

        //$state.go('app.signinteacheravailability')
    }

    /****FIM ENDERECO */




    /****MATERIAS */
    $scope.saveSubjects = function() {
        //console.log($scope.selectedSubject)
        //$state.go('app.hometeacher')

        if ($scope.selectedSubject.length <= 0) {
            ionicToast.show("Escolha as matérias que leciona.", 'bottom', false, 1000);
            return false;
        }

        if ($rootScope.selectedSubject.length > 3) {
            ionicToast.show("Escolha até 3 matérias.", 'bottom', false, 2000);
            return false;
        }

        $rootScope.userProfile.subjects = $scope.selectedSubject;
        console.log($scope.userProfile.subjects);
        $http.post(url + "subject/add", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                console.log(res.data);
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        //$state.go('app.signinteacherdescription')
                        ionicToast.show("Dados Alterados", 'bottom', false, 2000);

                    } else {
                        ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                        return false;
                    }

                }
            },
            function(res) {
                errorCallBack(res)
            }
        );
    }
    $http.get(url + 'subject/list').success(function(ret) {
        angular.forEach(ret, function(v, k) {
            v.selected = false;
            v.levels = [];
        });
        //console.log(ret);
        $scope.subjects = ret;
    });

    $http.get('json/subject.level.json').success(function(data) {
        //console.log(data);
        $scope.subjectLevel = data;
    });


    $scope.selectedSubject = [];
    //$scope.selectedSubject = $rootScope.userProfile.subjects;
    $scope.showPopupSubject = function(subject) {

        if ($scope.selectedSubject.length >= 3) {
            ionicToast.show("Você pode escolher até 3 matérias.", 'bottom', false, 2000);
            return false;
        }


        angular.forEach($scope.subjectLevel, function(v, k) {
            v.selected = false;
        });

        $scope.selectedSubject.push(subject);

        var index = $scope.selectedSubject.indexOf(subject);
        $scope.selectLevel = function(ind, isAdd) {
            /*console.log(ind);
            console.log(isAdd);
            console.log(index);*/

            if (!isAdd) {
                var inex = $scope.selectedSubject[index].levels.indexOf($scope.subjectLevel[ind]);
                if (inex > -1) {
                    $scope.selectedSubject[index].levels.splice(inex, 1);
                }
            } else if (isAdd) {
                $scope.selectedSubject[index].levels.push($scope.subjectLevel[ind]);
            }


        }

        var myPopup = $ionicPopup.confirm({
            templateUrl: 'templates/signin-teacher-subjects-level.html',
            scope: $scope,
            title: 'Nível',
            cssClass: 'popup-level',
            buttons: [{
                    text: 'Cancelar',
                    onTap: function(e) {
                        subject.selected = false;
                        $scope.selectedSubject.splice(index, 1);
                    }
                },
                {
                    text: '<b>Escolher</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.selectedSubject[index].levels.length > 0) {
                            subject.selected = false;
                            $scope.selectedSubject.splice(index, 1);
                        }
                    }
                }
            ]
        });
    };

    /***FIM MATERIAS */




    /*****DISPONIBILIDADE */
    var shift = {};
    shift.first = "";
    shift.last = "";
    //$scope.shift = shift;

    var day = {};
    day.enum = "";
    day.shift = shift;
    $scope.day = day;


    $http.get('json/days.shift.json').success(function(data) {
        $scope.shiftDays = data;
    });

    $http.get('json/hours.int.json').success(function(data) {
        $scope.hours = data;
    });


    $http.get('json/days.json').success(function(data) {
        $scope.weekDays = data;
    });

    function autoSelectDay() {
        angular.forEach($rootScope.userProfile.availability, function(b, j) {
            angular.forEach($scope.weekDays, function(v, k) {
                //console.log(b);
                if (v.id == b.id) {
                    v.selected = true;
                    v.shift = b.shift;
                    //console.log(v);
                }
            });

        });
    }
    var countUp = function() {
        if (undefined !== $rootScope.userProfile) {
            autoSelectDay();
        } else {
            $timeout(countUp, 500);
        }
    }
    $timeout(countUp, 500);

    $scope.showPopupDay = function(index) {
        $scope.personalized = {
            minValue: 3,
            maxValue: 11,
            step: 1,
            tip: false
        };


        var myPopup = $ionicPopup.confirm({
            templateUrl: 'templates/signin-teacher-availability-shifts.clean.html',
            scope: $scope,
            title: $scope.weekDays[index].name,
            cssClass: 'popup-shift',
            buttons: [{
                    text: 'Cancelar',
                    onTap: function(e) {
                        $scope.weekDays[index].selected = false;
                    }
                },
                {
                    text: '<b>OK</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        var first = $scope.hours[$scope.personalized.minValue].split(":");
                        var last = $scope.hours[$scope.personalized.maxValue].split(":");
                        $scope.weekDays[index].shift.first = first[0];
                        $scope.weekDays[index].shift.last = last[0];
                    }
                }
            ]
        });
    };


    /*$scope.loadAddress = function() {
        $state.go('app.signinteacheraddress')
    }*/


    $scope.saveAvailability = function() {
        if ($scope.weekDays.length <= 0) {
            ionicToast.show("Escolha os dias e as horas em que trabalhará.", 'bottom', false, 1000);
            return false;
        }
        console.log($scope.weekDays);
        $rootScope.userProfile.availability = $scope.weekDays;

        $http.post(url + "disponibility/add", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                //console.log(res.data);
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        //console.log("ooook");
                        //$state.go('app.signinteachersubjects')
                        ionicToast.show("Dados Atualizados", 'bottom', false, 2000);
                    } else {
                        ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                        return false;
                    }

                }
            },
            function(res) {
                errorCallBack(res)
            }
        );
    }

    /***FIM DISPONIBILIDADE */




    /*****NIVEL ESCOLARIDADE ALUNO */
    $scope.doEditLevel = function(form) {

            if (form.$valid) {
                //$rootScope.userProfile.level = $scope.level;

                //console.log($rootScope.userProfile);

                $http.post(url + "user/edit", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                        var ret = res.data;
                        //console.log(ret);

                        if (ret.status == 'erro') {
                            ionicToast.show(ret.msg, 'bottom', false, 2000);
                        } else {
                            if (ret.status == 'OK') {
                                ionicToast.show("Dados Atualizados", 'bottom', false, 2000);
                            } else {
                                ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                                return false;
                            }

                        }
                    },
                    function(res) {
                        errorCallBack(res)
                    }
                );
            } else {
                ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
            }

        }
        /** FIM NIVEL ESCOLARIDADE ALUNO */




    var verifica = $scope.$watch('userProfile', function() {
        //$scope.selectedSubject = $rootScope.userProfile.subjects;

        console.log($rootScope.userProfile);

        if (undefined !== $rootScope.userProfile) {
            $scope.selectedSubject = $rootScope.userProfile.subjects;

            if (undefined === $scope.subjects) {
                $http.get(url + 'subject/list').success(function(ret) {
                    $scope.subjects = ret;
                });
            }

            angular.forEach($scope.subjects, function(v, k) {
                console.log(v);
                v.selected = findWithAttr($scope.selectedSubject, 'id', v.id) > -1;
            });

            //$scope.weekDays = $rootScope.userProfile.availability;

            angular.forEach($scope.subjects, function(v, k) {
                v.selected = findWithAttr($scope.selectedSubject, 'id', v.id) > -1;
            });

            //console.log($scope.userProfile.availability);

            angular.forEach($scope.weekDays, function(v, k) {
                console.log(v);
                v.selected = findWithAttr($scope.userProfile.availability, 'id', v.id) > -1;
            });


            //console.log($scope.selectedSubject);
            //console.log($scope.subjects);

            verifica();
        }

    });




})

;