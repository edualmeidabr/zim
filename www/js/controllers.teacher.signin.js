angular.module('signin.teacher.controllers', [])


.controller('SignInTeacherDocsCtrl', function($scope, $state, $rootScope, AuthService, ionicToast, $http) {
    $rootScope.userProfile = AuthService.ResetUser();
    $rootScope.userProfile = AuthService.GetCredentials();

    $scope.savePersonalData = function(form) {
        if (form.$valid) {
            $http.post(url + "user/edit", { 'userProfile': $scope.userProfile }).then(function(res) {
                    console.log(res.data);
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            //console.log(document.getElementById('user-photo').src);
                            $rootScope.userProfile = $scope.userProfile;
                            $state.go('app.signinteacheraddress');

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

    if (undefined !== $rootScope.userProfile) {
        if ($rootScope.userProfile.dados.experiencia == null || $rootScope.userProfile.dados.experiencia == "") {
            $rootScope.userProfile.dados.experiencia = 0;
        }
        if ($rootScope.userProfile.dados.sexo == null || $rootScope.userProfile.dados.sexo == "") {
            $rootScope.userProfile.dados.sexo = 'M';
        }
    }


})


.controller('SignInTeacherAddressCtrl', function($scope, $state, $http, $rootScope, AuthService, MapService, ionicToast) {
    $rootScope.userProfile = AuthService.GetCredentials();
    $rootScope.userProfile.address = MapService.ResetAddress();

    if (undefined !== $rootScope.userProfile) {
        if (!$rootScope.userProfile.neighborhood) {
            $rootScope.userProfile.neighborhood = [];
        }

        if ($rootScope.userProfile.dados.deslocamento == null || $rootScope.userProfile.dados.deslocamento == "") {
            $rootScope.userProfile.dados.deslocamento = 3;
        }
    }


    $scope.selectLocation = function(location) {
        console.log(location);
        var address = MapService.ResetAddress();
        //$rootScope.searchQuery = '';
        $scope.isChangeLocation = false;

        address.name = location.structured_formatting.main_text;
        address.lat = location.lat;
        address.lng = location.lng;

        $rootScope.userProfile.address = address;
        $rootScope.userProfile.address.street = address.name;

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
                    //console.log(res.data);
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            $state.go('app.signinteacheravailability');
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

})


.controller('SignInTeacherAvailabilityCtrl', function($scope, $state, $http, $ionicPopup, $rootScope, AuthService, ionicToast) {
    $rootScope.userProfile = AuthService.GetCredentials();

    var shift = {};
    shift.first = "";
    shift.last = "";
    //$scope.shift = shift;

    var day = {};
    day.enum = "";
    day.shift = shift;
    $scope.day = day;

    $http.get('json/days.json').success(function(data) {
        //console.log($rootScope.userProfile.availability);


        $scope.weekDays = data;

        //TODO rever
        /*angular.forEach($scope.weekDays, function(v, k) {
            if ($rootScope.userProfile.availability.indexOf(v.id) > -1) {
                v.selected = true;
            }

        });*/

    });
    $http.get('json/days.shift.json').success(function(data) {
        //console.log(data);
        $scope.shiftDays = data;
    });

    $http.get('json/hours.int.json').success(function(data) {
        console.log(data);
        $scope.hours = data;
    });


    /*
        $scope.selectedDay = [];
        $scope.selectDay = function(index) {
            //console.log($scope.selectDay.length);
            if ($scope.isDaySelected(index)) {
                $scope.selectedDay.splice($scope.selectedDay.indexOf(index));
                return true;
            }

            $scope.selectedSubject.push(index);
        }
        $scope.isDaySelected = function(index) {
            return $scope.selectedDay.indexOf(index) !== -1;
        }
    */


    $scope.showPopupDay = function(index) {
        $scope.personalized = {
            minValue: 3,
            maxValue: 11,
            step: 1,
            tip: false
        };

        var myPopup = $ionicPopup.confirm({
            templateUrl: 'templates/signin-teacher-availability-shifts.html',
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

        myPopup.then(function(res) {
            //console.log('Tapped!', res);
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
        //console.log($scope.weekDays);
        $rootScope.userProfile.availability = $scope.weekDays;

        $http.post(url + "disponibility/add", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                //console.log(res.data);
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        //console.log("ooook");

                        $state.go('app.signinteachersubjects')

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

})


.controller('SignInTeacherSubjectsCtrl', function($scope, $state, $ionicHistory, $http, $ionicPopup, ionicToast, $rootScope, AuthService) {
    $rootScope.userProfile = AuthService.GetCredentials();
    /*$scope.loadAvailability = function() {
        $state.go('app.signinteacheravailability')
    }*/


    $scope.saveSubjects = function() {


        //console.log($scope.selectedSubject)
        //$state.go('app.hometeacher')

        if ($scope.selectedSubject.length <= 0) {
            ionicToast.show("Escolha as matérias que leciona.", 'bottom', false, 1000);
            return false;
        }

        if ($scope.selectedSubject.length > 3) {
            ionicToast.show("Você pode escolher até 3 matérias.", 'bottom', false, 2000);
            return false;
        }


        //console.log($scope.weekDays);
        $rootScope.userProfile.subjects = $scope.selectedSubject;

        $http.post(url + "subject/add", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                //console.log(res.data);
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        //console.log("ooook");

                        $state.go('app.signinteacherdescription')

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



    /*$http.get('json/subjects.list.json').success(function(data) {
        //console.log(data);
        $scope.subjects = data;
    });*/


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
    $scope.showPopupSubject = function(subject) {
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
                if ($scope.selectedSubject.length > 3) {
                    ionicToast.show("Você pode escolher até 3 matérias.", 'bottom', false, 2000);
                    return false;
                }
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

})


.controller('SignInTeacherDescriptionCtrl', function($scope, $state, $rootScope, AuthService, ionicToast, $http, $ionicHistory, $ionicPopover) {
    $ionicHistory.nextViewOptions({
        disableBack: true
    });


    $rootScope.userProfile = AuthService.GetCredentials();
    //$rootScope.userProfile.dados.valor_aula = '';
    $scope.saveDescription = function(form) {
        if (form.$valid) {
            $http.post(url + "user/edit", { 'userProfile': $scope.userProfile }).then(function(res) {
                    //console.log(res.data);
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            //console.log('okokokok');
                            //$rootScope.userProfile = $scope.userProfile;
                            $state.go('app.hometeacher');

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

    /*
        $scope.showInfoValor = function($event) {
            var template = '<ion-popover-view style="height: 90px;" ><ion-content scroll="false" style="color: #53c5cf; padding: 10px !important;">Considere o desconto de 20% pelos custos operacionais da plataforma Zim</ion-content></ion-popover-view>';
            console.log(template);
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
    */

})


;