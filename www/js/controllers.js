angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicPopup, $ionicPopover, $http, AuthService, $rootScope, ionicToast, PhotoService) {
    $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
            title: '<i class="icon ion-alert-circled"></i> Aviso',
            template: msg,
            cssClass: 'alert'
        });
    };

    $scope.goUserProfile = function() {
        $state.go("app.profile");
    }

    $ionicModal.fromTemplateUrl('templates/user-profile.add-credit-card.html', {
        scope: $scope
    }).then(function(ionicModal) {
        $scope.ionicModal = ionicModal;
    });

    $scope.openPopoverCC = function($event) {
        $scope.ionicModal.show($event);

        $rootScope.card = AuthService.ResetCard();

        $scope.doAddCard = function(form) {
            if (form.$valid) {
                $http.post(url + "card/add", { 'userProfile': $rootScope.userProfile, 'card': $rootScope.card }).then(function(res) {
                        console.log(res.data);
                        var ret = res.data;
                        if (ret.status == 'erro') {
                            ionicToast.show(ret.msg, 'bottom', false, 2000);
                        } else {
                            if (ret.status == 'OK') {
                                $rootScope.userProfile.cards.push($scope.card);

                                if (undefined !== $rootScope.userProfile.order && undefined !== $rootScope.userProfile.order.card) {
                                    $rootScope.userProfile.order.card = $scope.card;
                                }
                                $scope.closePopoverCC();

                                ionicToast.show("Cartão cadastrado. :)", 'bottom', false, 2000);
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
    $scope.closePopoverCC = function() {
        $scope.ionicModal.hide();
    };
    $scope.cc = { cardNumber: "", securityCode: "", dueDate: "" };

    $scope.addCC = function() {
        $scope.userProfile.cards.push($scope.cc);
        $scope.popoverCC.hide();
    }
    closeLogin = function() {
        $scope.modal.hide();
    };

    $scope.isLogged = function() {
        if (undefined === $rootScope.userProfile || $rootScope.userProfile.id == "") {
            return false;
        }
        return true;
    }

    $ionicModal.fromTemplateUrl('templates/terms.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalTerms = modal;
    });
    $scope.openModalTerms = function() {
        $scope.modalTerms.show();
    };
    $scope.closeModalTerms = function() {
        $scope.modalTerms.hide();
    };

    $scope.getPhoto = function() {
        PhotoService.getPhoto('user-photo');
    }

    $scope.formatMoney = function(v) {
        return formatMoney(v)
    }
})


.controller('SubjectsCtrl', function($scope, $http, $ionicHistory, $rootScope, AuthService, $ionicLoading, OrderService, $state, ionicToast) {
    $scope.init = function() {
        OrderService.ClearOrder();
        $rootScope.userProfile.order = OrderService.ResetOrder();

        $ionicLoading.show();
        $http.get(url + 'subject/list').success(function(ret) {
            //console.log('veio aqui');
            //ionicToast.show(ret, 'bottom', false, 2000);
            $ionicLoading.hide();
            $scope.subjectList = ret;
        });


        //alert('Subject ' + $cookies.getObject('registrationIdZim'));
    }

    $scope.chooseSubject = function(subject) {
        console.log(subject);
        $rootScope.userProfile.order.subject = subject;
        OrderService.SetOrder();
        $state.go('app.map');
    }

    AuthService.GetCredentials($scope.init);
})


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $rootScope, AuthService, $ionicLoading, MapService, OrderService, ionicToast, $ionicPopup) {
    //$scope.init = function() {
    //$rootScope.userProfile.order = OrderService.GetOrder();
    $rootScope.userProfile = AuthService.GetCredentials();


    MapService.GenerateMap();

    if (undefined === $rootScope.userProfile.order || undefined === $rootScope.userProfile.order.subject) {
        //$rootScope.userProfile.order = OrderService.ResetOrder();
        ionicToast.show('Algum erro ocorreu.', 'bottom', false, 1000);
        $state.go('app.subjects');
    }

    $scope.selectAddress = function(location) {
        //alert('aquiiiii');
        //console.log($rootScope.userProfile);
        var address = MapService.ObjToAddress(location);
        //console.log(address);
        if (address.street != "") {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirmação',
                template: "Marcar aula no endereço " + address.street + "?",
                cssClass: 'alert',
                buttons: [
                    { text: 'Não' },
                    {
                        text: 'Sim',
                        onTap: function(e) {
                            address.name = "Meu Endereço";
                            address.lat = location.lat;
                            address.lng = location.lng;
                            $rootScope.userProfile.order.address = address;
                            $scope.goTeacher();
                        }
                    }
                ]
            });
        } else {
            ionicToast.show("Não conseguimos pegar o seu endereço. Por favor, tente novamente.", 'bottom', false, 2000);
        }
    }

    $scope.selectMyLocation = function() {
        //alert('GetLatLng');
        var latLng = MapService.GetLatLng();
        if (latLng != null) {
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({ 'location': { lat: parseFloat(latLng.lat), lng: parseFloat(latLng.lng) } }, function(results, status) {
                if (status === 'OK') {
                    //console.log(results);
                    if (results[0] && results[0].types[0] == 'street_address') {

                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Confirmação',
                            template: "Marcar aula no endereço " + results[0].formatted_address + "?",
                            cssClass: 'alert',
                            buttons: [
                                { text: 'Não' },
                                {
                                    text: 'Sim',
                                    onTap: function(e) {
                                        address.name = "Meu Endereço";
                                        address.lat = location.lat;
                                        address.lng = location.lng;
                                        address.street = results[1].formatted_address;

                                        console.log($rootScope.userProfile.order);
                                        $rootScope.userProfile.order.address = address;
                                        console.log($rootScope.userProfile.order.address);
                                        //console.log(address);

                                        $scope.goTeacher();
                                    }
                                }
                            ]
                        });

                    } else {
                        $rootScope.errorMap = true;

                    }
                } else {
                    $rootScope.errorMap = true;
                }
            });
        }
    }

    $scope.goTeacher = function() {
        //console.log("go.app.teachers");
        OrderService.SetOrder();
        $state.go("app.teachers");
    }




})

.controller('TeachersCtrl', function($scope, $http, ionicToast, $rootScope, AuthService, $state, $ionicLoading, OrderService) {
    //$rootScope.userProfile = AuthService.GetCredentials();
    //OrderService.GetOrder();


    $rootScope.init = function() {
        console.log($rootScope.userProfile);
        //console.log($rootScope.userProfile.order.subject);
        if (undefined === $rootScope.userProfile.order || undefined === $rootScope.userProfile.order.address) {
            //$rootScope.userProfile.order = OrderService.ResetOrder();
            //ionicToast.show('Algum erro ocorreu.', 'bottom', false, 1000);
            $state.go('app.subjects');
        }

        console.log($rootScope.userProfile.order);

        $ionicLoading.show();

        $scope.teacherList = [];
        $scope.searchInput = {};
        $scope.searchInput.filter = "";
        $http.post(url + "teacher/list", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                $ionicLoading.hide();

                console.log(res.data);
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        $scope.teacherList = ret.msg;
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

        $rootScope.chooseTeacher = function(teacher) {
            $rootScope.userProfile = {};
            $rootScope.userProfile.order = {};
            $rootScope.userProfile.order = OrderService.GetOrder();
            console.log($rootScope.userProfile);
            $rootScope.userProfile.order.teacher = teacher;
            OrderService.SetOrder();
            //console.log(teacher);
            $state.go("app.teacherprofile", { "teacherId": teacher.id });
        }
    }

    $rootScope.userProfile = AuthService.GetCredentials($rootScope.init);

})



.controller('TeacherProfileCtrl', function($scope, $http, $ionicModal, $state, $stateParams, $rootScope, AuthService, ionicToast, ionicTimePicker, OrderService, $ionicLoading) {
    //console.log($scope.teacherId);
    $rootScope.userProfile = AuthService.GetCredentials();
    //$rootScope.userProfile.order = OrderService.GetOrder();

    $rootScope.userProfile.teacherId = $stateParams.teacherId;
    $scope.profile = {};
    //var disableDate = [new Date(date.getFullYear(), date.getMonth(), 15), new Date(date.getFullYear(), date.getMonth(), 25), new Date(date.getFullYear(), date.getMonth(), 30)];
    var disableDates = [];
    var disableDaysWeek = [];
    var selectedDates = [];

    if (undefined === $rootScope.userProfile.order || undefined === $rootScope.userProfile.order.schedule) {
        //$rootScope.userProfile.order = OrderService.ResetOrder();
        //ionicToast.show('Algum erro ocorreu.', 'bottom', false, 1000);
        $state.go('app.subjects');
    }

    $http.post(url + "teacher/get", { 'userProfile': $rootScope.userProfile }).then(function(res) {
            console.log(res.data);
            var ret = res.data;
            if (ret.status == 'erro') {
                ionicToast.show(ret.msg, 'bottom', false, 2000);
            } else {
                if (ret.status == 'OK') {
                    //console.log(ret.msg);
                    $scope.profile = ret.msg;

                    var disableDay = [0, 1, 2, 3, 4, 5, 6, 7];

                    //desabilita dias sem disponibilidade
                    ret.msg.availability.forEach(function(v) {
                        var index = disableDay.indexOf(parseInt(v.day));

                        if (index > -1) {
                            disableDay.splice(index, 1);
                        }
                        if (undefined !== v.date && v.date != "" && v.is_disponivel == 0) {
                            disableDates.push(new Date(v.ano, v.mes, v.dia));
                        }

                    });
                    //console.log(ret.msg.availability);
                    //console.log(disableDates);
                    $scope.onezoneDatepicker.disableDaysOfWeek = disableDay;

                    if (disableDates.length > 0) {
                        $scope.onezoneDatepicker.disableDates = disableDates;
                    }

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

    var currentDate = new Date();
    var date = new Date();
    $scope.date = date;

    $scope.onezoneDatepicker = {
        date: date,
        mondayFirst: false,
        months: MONTHS,
        daysOfTheWeek: DAYSOFWEEK,
        startDate: new Date(2017, 1, 1),
        endDate: new Date(2024, 1, 26),
        disablePastDays: true,
        disableSwipe: false,
        disableWeekend: false,
        disableDates: disableDates,
        disableDaysOfWeek: disableDaysWeek,
        showDatepicker: true,
        showTodayButton: false,
        calendarMode: true,
        hideCancelButton: true,
        hideSetButton: true,
        callback: function(date) {
            //console.log(date.getMonth());
            var day = date.getDate();
            var monthIndex = date.getMonth() + 1;
            var month = monthIndex < 10 ? "0" + monthIndex : monthIndex;
            var year = date.getFullYear();
            var w = date.getDay();

            $scope.dateSchedule = day + "/" + month + "/" + year;
            $scope.day = day;
            $scope.month = month;
            $scope.year = year;
            $scope.monthIndex = monthIndex - 1;

            $scope.duration = 1;
            $scope.hour = '';

            $scope.openModalListSchedule();
        },
        highlights: selectedDates
    };


    $ionicModal.fromTemplateUrl('templates/teachers-schedule.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModalHour = function() {
        $scope.modal.show();
    };
    $scope.closeModalHour = function() {
        $scope.modal.hide();
    };


    $ionicModal.fromTemplateUrl('templates/teachers-schedule.list.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.horas = [];
    $scope.openModalListSchedule = function() {
        $ionicLoading.show();
        $http.post(url + "disponibility/list", { 'userProfile': $rootScope.userProfile, 'date': $scope.dateSchedule }).then(function(res) {
                console.log(res.data);
                $ionicLoading.hide();
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        $scope.horas = ret.msg;
                        $scope.modal.show();
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



        $scope.selectHour = function(hora) {
            //console.log(hora);
            if (hora.disabled) {
                ionicToast.show("Este horário está reservado", 'bottom', false, 1000);
                return false;
            }

            var selecionar = hora.selected = !hora.selected;

            var qtdeSelecionada = 0;
            var primeiroIndexSelecionado = ultimoIndexSelecionado = null;
            angular.forEach($scope.horas, function(v, k) {
                var h;
                if (v == hora) {
                    if (k < $scope.horas.length) {
                        h = $scope.horas[k + 1];
                        if (h.disabled == false) {
                            h.selected = selecionar;
                        } else {
                            h = $scope.horas[k - 1];
                            if (h.disabled == false) {
                                h.selected = selecionar;
                            } else {
                                hora.selected = false;
                            }
                        }
                    } else {
                        h = $scope.horas[k - 1];
                        if (h.disabled == false) {
                            h.selected = selecionar;
                        } else {
                            hora.selected = false;
                        }
                    }
                }

                if (v.selected) {
                    if (primeiroIndexSelecionado == null || primeiroIndexSelecionado > k) {
                        primeiroIndexSelecionado = k;
                    }

                    if (ultimoIndexSelecionado == null || ultimoIndexSelecionado < k) {
                        ultimoIndexSelecionado = k;
                    }

                    qtdeSelecionada++;
                }
            });

            for (i = primeiroIndexSelecionado; i <= ultimoIndexSelecionado; i++) {
                if ($scope.horas[i].disabled) {
                    ionicToast.show("Alguns horários estão indisponíveis. Por favor, tente horários diferentes.", 'bottom', false, 2000);
                    angular.forEach($scope.horas, function(v, k) {
                        v.selected = false;
                    });
                    break;
                } else {
                    $scope.horas[i].selected = true;
                }
            }

            //$rootScope.userProfile.order.schedule = [];

            var schedule = OrderService.ResetSchedule();
            schedule.hour = $scope.horas[primeiroIndexSelecionado].inicio;
            schedule.date = $scope.dateSchedule;
            schedule.hourEnd = $scope.horas[ultimoIndexSelecionado].fim;
            schedule.factor = ((ultimoIndexSelecionado - primeiroIndexSelecionado) + 1) / 2;

            $scope.schedule = schedule;

            /*if (qtdeSelecionada == 1) {
                $scope.horas[ultimoIndexS + 1].selected = true;
            }*/

            //console.log(hora);
            return true;
        }

    };
    $scope.closeModalListSchedule = function() {
        $scope.modal.hide();
    };



    $scope.showDatepicker = function() {
        $scope.onezoneDatepicker.showDatepicker = true;
    };


    $scope.hour = "";
    $scope.hora = "";
    $scope.minuto = "";
    $scope.hourEnd = "";
    $scope.factor = 1;
    $scope.dateSchedule = "";
    $scope.duration = 1;
    $scope.arrDurationText = ['', '1h', '1h30m', '2h', '2h:30m', '3h'];
    $scope.arrDurationValue = ['', 60, 90, 120, 150, 180];
    $scope.arrDurationFactor = ['', 1, 1.5, 2, 2.5, 3];

    $scope.openHour = function() {
        var dateTime = {
            callback: function(val) {
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    //console.log(val);
                    var selectedTime = new Date(val * 1000);
                    //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                    var hora, minuto;
                    hora = selectedTime.getUTCHours();
                    minuto = selectedTime.getUTCMinutes();

                    var msg = '';

                    if (hora < 7) {
                        hora = 7;
                        msg = 'A hora foi automaticamente alterada.';
                    } else if (hora > 22) {
                        hora = 22;
                        msg = 'A hora foi automaticamente alterada.';
                    }

                    var q = new Date();
                    var m = q.getMonth();
                    var d = q.getDate();
                    var y = q.getFullYear();
                    var h = q.getHours();
                    var w = q.getDay();
                    var today = new Date(y, m, d);
                    var date = new Date($scope.year, $scope.monthIndex, $scope.day);
                    //console.log(today);
                    //console.log(date);
                    if (today.getTime() === date.getTime()) {
                        //console.log('hoje');
                        if (hora < h + 2) {
                            hora = h + 2;
                            if (hora > 22) {
                                hora = 22;
                            }
                            msg = 'A hora foi automaticamente alterada.';
                        }
                    }
                    minuto = minuto == '0' ? '00' : minuto;
                    hora = hora < 10 ? "0" + hora : hora;

                    $scope.hour = hora + ':' + minuto;

                    $scope.hora = hora;
                    $scope.minute = minuto;

                    $scope.changeDuration($scope.duration);

                    if (msg != '') {
                        ionicToast.show(msg, 'bottom', false, 2000);
                    }

                    /*var ends = new Date();
                    ends.setHours(hora);
                    ends.setMinutes(minuto + $scope.arrDurationValue[$scope.duration]);
                    $scope.hourEnd = ends.getHours() + ':' + ends.getMinutes();
                    //console.log($scope.hourEnd);
*/
                }
            },
            inputTime: ((8 * 60 * 60) + (30 * 60)),
            format: 24,
            step: 30,
            setLabel: 'Definir',
            closeLabel: 'X'
        };
        ionicTimePicker.openTimePicker(dateTime);


        /* inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
             format: 12,
             step: 15,
             setLabel: 'Set',
             closeLabel: 'Close'*/
    }


    $scope.changeDuration = function(v) {
        //console.log(v);
        var ends = new Date();
        ends.setHours($scope.hora);
        ends.setMinutes($scope.minute + $scope.arrDurationValue[v]);
        var hora, minuto;
        hora = ends.getHours();
        minuto = ends.getMinutes();
        minuto = minuto == '0' ? '00' : minuto;
        hora = hora < 10 ? "0" + hora : hora;

        $scope.hourEnd = hora + ':' + minuto;
        $scope.factor = $scope.arrDurationFactor[v];
        //console.log($scope.hourEnd);
    }

    $rootScope.userProfile.order.schedule = [];

    $scope.confirmScheduleDay = function() {
        if (undefined != $scope.schedule) {
            //console.log($scope.schedule);
            if ($scope.schedule.length == 0 || $scope.schedule.factor < 1) {
                ionicToast.show("Defina um horário, no mínimo, de uma hora.", 'bottom', false, 2000);
                return false;
            }
            //console.log($rootScope.userProfile.order.schedule);
            $ionicLoading.show();
            $http.post(url + "disponibility/check", { 'userProfile': $rootScope.userProfile, 'schedule': $scope.schedule }).then(function(res) {
                    //console.log(res.data);
                    $ionicLoading.hide();
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            $rootScope.userProfile.order.schedule.push($scope.schedule);
                            console.log($rootScope.userProfile.order.schedule);

                            $scope.modal.hide();

                            //caso permitam-se varias marcacoes, retirar a linha abaixo
                            //$scope.goCheckout();
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
            ionicToast.show('Defina o início da aula', 'bottom', false, 2000);
        }
    };

    /****    $scope.addScheduleDay = function() {
            //console.log($scope.arrDuratioValue);
            //dateAdd(new Date())
            //console.log($rootScope.userProfile.order.schedule);

            if ($scope.hour != '') {



                var schedule = OrderService.ResetSchedule();
                schedule.hour = $scope.hour;
                schedule.date = $scope.dateSchedule;
                schedule.duration = $scope.duration;
                schedule.hourEnd = $scope.hourEnd;
                schedule.factor = $scope.factor;

                console.log(schedule);

                $ionicLoading.show();
                $http.post(url + "disponibility/check", { 'userProfile': $rootScope.userProfile, 'schedule': schedule }).then(function(res) {
                        console.log(res.data);
                        $ionicLoading.hide();
                        var ret = res.data;
                        if (ret.status == 'erro') {
                            ionicToast.show(ret.msg, 'bottom', false, 2000);
                        } else {
                            if (ret.status == 'OK') {
                                $rootScope.userProfile.order.schedule.push(schedule);
                                console.log($rootScope.userProfile.order.schedule);

                                $scope.modal.hide();

                                //caso permitam-se varias marcacoes, retirar a linha abaixo
                                //$scope.goCheckout();
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
                ionicToast.show('Defina o início da aula', 'bottom', false, 2000);
            }
        };
        ***/


    $ionicModal.fromTemplateUrl('templates/teachers-profile-modal-assessments.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modalAssessents) {
        $scope.modalAssessents = modalAssessents;
    });
    $scope.openModalAssessents = function() {
        $scope.modalAssessents.show();
    };
    $scope.closeModalAssessents = function() {
        $scope.modalAssessents.hide();
    };
    $ionicModal.fromTemplateUrl('templates/teachers-profile-modal-description.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modalDescription) {
        $scope.modalDescription = modalDescription;
    });
    $scope.openModalDescription = function() {
        $scope.modalDescription.show();
    };
    $scope.closeModalDescription = function() {
        $scope.modalDescription.hide();
    };

    $scope.goCheckout = function() {
        if ($rootScope.userProfile.order.schedule.length == 0) {
            //$scope.showAlert('Por favor, selecione um horário.');
            ionicToast.show('Defina as suas aulas', 'bottom', false, 2000);
            return;
        }

        OrderService.SetOrder();
        $state.go("app.checkout");
    }
})





.controller('HelpCtrl', function($scope, $http, $rootScope, AuthService) {
    $scope.helpList = [];
    $rootScope.userProfile = AuthService.GetCredentials(function() {
        $http.get('json/help.json').success(function(data) {
            //console.log(data);
            data.forEach(function(element) {
                //console.log(element);
                if (element.isTeacher == $rootScope.userProfile.isTeacher) {
                    $scope.helpList.push(element);
                }
            }, this);

            //$scope.helpList = data;
        });

        $scope.groups = [];
        for (var i = 0; i < 10; i++) {
            $scope.groups[i] = {
                name: i,
                items: []
            };
            for (var j = 0; j < 3; j++) {
                $scope.groups[i].items.push(i + '-' + j);
            }
        }

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };
    });




})


.controller('TermsCtrl', function($ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(true);
})


.controller('MessagesCtrl', function($scope, $state, $http, AuthService, $rootScope, ionicToast, $ionicLoading) {
    $rootScope.userProfile = AuthService.GetCredentials();

    $scope.messages = [];

    /***$http.get('json/messages.json').success(function(list) {
        $scope.messages = list
    });***/
    $ionicLoading.show();
    $http.post(url + "message/list", { 'userProfile': $rootScope.userProfile }).then(function(res) {
            console.log(res.data);
            $ionicLoading.hide();
            var ret = res.data;
            if (ret.status == 'erro') {
                ionicToast.show(ret.msg, 'bottom', false, 2000);
            } else {
                if (ret.status == 'OK') {
                    //console.log("ooook");
                    $scope.messages = ret.msg;
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
})


.controller('ChatCtrl', function($scope, $state, $http, $ionicScrollDelegate, AuthService, $rootScope, ionicToast, $stateParams, $ionicLoading, $interval) {

    //console.log($stateParams.id);
    $rootScope.userProfile = AuthService.GetCredentials();
    $rootScope.userProfile.message_id = $stateParams.id;

    $scope.avatarMe = '';
    $scope.avatarUser = '';
    $scope.msgChat = "";

    /*$http.get('json/messages.chat.users.json').success(function(list) {
        //console.log(list)
        $scope.avatarMe = list[0].me.avatar;
        $scope.avatarUser = list[0].user.avatar;


        //console.log($scope.avatarMe);
        //console.log($scope.avatarUser);
    });*/

    /*$scope.messagesChat = [];
    $http.get('json/messages.chat.json').success(function(list) {
        $scope.messagesChat = list
    });*/

    $ionicLoading.show();
    $scope.messagesChat = [];

    $scope.list = function() {
        $http.post(url + "message/get", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                //console.log(res.data);
                $ionicLoading.hide();
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        //console.log("ooook");
                        $scope.avatarMe = ret.msg.users.me.avatar;
                        $scope.avatarUser = ret.msg.users.user.avatar;
                        $scope.messagesChat = ret.msg.msgs;
                        $ionicScrollDelegate.scrollBottom();
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
    };

    //$scope.list();
    $scope.interval = $interval(function() {
        $scope.list();
    }, 5000);

    $scope.$on("$destroy", function() {
        if (angular.isDefined($scope.interval)) {
            $interval.cancel($scope.interval);
        }
    });


    $scope.sendMsg = function() {
        if ($scope.msgChat != "") {
            $rootScope.userProfile.message = $scope.msgChat;
            $http.post(url + "message/add", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                    console.log(res.data);
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            $scope.messagesChat.push({
                                id: 1,
                                me: true,
                                text: $scope.msgChat
                            });

                            $scope.msgChat = "";
                            $rootScope.userProfile.message = "";
                            $ionicScrollDelegate.scrollBottom();
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
    }
})



.controller('ClassesCtrl', function($scope, $state, $http, $ionicLoading, $rootScope, AuthService, ionicToast) {
    $rootScope.userProfile = AuthService.GetCredentials();
    //console.log($scope.id);
    $scope.classes = null;
    $scope.classes = [];


    $ionicLoading.show();
    $http.post(url + "class/list", { 'userProfile': $rootScope.userProfile }).then(function(res) {
            console.log(res.data);
            $ionicLoading.hide();
            var ret = res.data;
            if (ret.status == 'erro') {
                ionicToast.show(ret.msg, 'bottom', false, 2000);
            } else {
                if (ret.status == 'OK') {
                    //console.log("ooook");
                    $scope.classes = ret.msg;
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

    $scope.openClass = function(classe) {
        $state.go("app.class", { "classId": classe.id });
    }

    //console.log($scope.classes);

})

.controller('ClassCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, $rootScope, AuthService, $ionicLoading, ionicToast, $ionicModal) {
    $rootScope.userProfile = AuthService.GetCredentials();
    //console.log($stateParams.classId);
    $rootScope.userProfile.classId = $stateParams.classId;

    $scope.class = {};
    $ionicLoading.show();
    $http.post(url + "class/get", { 'userProfile': $rootScope.userProfile }).then(function(res) {
            console.log(res.data);
            $ionicLoading.hide();
            var ret = res.data;
            if (ret.status == 'erro') {
                ionicToast.show(ret.msg, 'bottom', false, 2000);
            } else {
                if (ret.status == 'OK') {
                    $scope.class = ret.msg;
                    $scope.rating = {};
                    $scope.rating.rate = 3;
                    $scope.rating.max = 5;
                    $scope.rating.comment = '';
                    $scope.rating.classId = $scope.class.id;
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
    /*
        $http.get('json/classes.json').success(function(list) {
            $scope.class = list[$scope.classId];

            // set the rate and max variables
            $scope.rating = {};
            $scope.rating.rate = 3;
            $scope.rating.max = 5;
            //console.log($scope.class);

        });
    */

    $scope.cancelClass = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '<i class="icon ion-alert-circled"></i> Aviso',
            template: 'Deseja cancelar a aula?',
            cssClass: 'alert',
            buttons: [
                { text: 'Não' },
                {
                    text: 'Sim',
                    onTap: function(e) {

                        $ionicLoading.show();
                        $http.post(url + "class/cancel", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                                console.log(res.data);
                                $ionicLoading.hide();
                                var ret = res.data;
                                if (ret.status == 'erro') {
                                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                                } else {
                                    if (ret.status == 'OK') {
                                        ionicToast.show("A aula foi cancelada.", 'bottom', false, 2000);
                                        $scope.class.status = 'cancel';
                                    }

                                }
                            },
                            function(res) {
                                errorCallBack(res)
                            }
                        );
                    }
                }
            ]
        });
    }





    $scope.sendRating = function() {

        /*var confirmPopup = $ionicPopup.confirm({
            title: '<i class="icon ion-alert-circled"></i> Aviso',
            template: 'Confirma o envio desta avaliação?',
            cssClass: 'alert',
            buttons: [
                { text: 'Não' },
                {
                    text: 'Sim',
                    onTap: function(e) {
                        console.log($scope.rating);
                        $ionicLoading.show();*/
        $http.post(url + "evaluation/add", { 'userProfile': $rootScope.userProfile, 'rating': $scope.rating }).then(function(res) {
                console.log(res);
                $ionicLoading.hide();
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        ionicToast.show("A avaliação foi enviada.", 'bottom', false, 2000);
                        $scope.class.showEvaluation = false;
                        //$scope.class.status = 'cancel';
                    } else {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                        return false;
                    }

                }
            },
            function(res) {
                errorCallBack(res)
            }
        );
        /*}
                }
            ]
        });*/
    }

    $scope.openMap = function() {
        address = $scope.class.address;
        lat = parseFloat($scope.class.address.lat);
        long = parseFloat($scope.class.address.lng);
        text = encodeURIComponent($scope.class.address.street);
        console.log(address.lat);
        if (ionic.Platform.isIOS())
            window.open("http://maps.apple.com/?q=" + text + "&ll=" + lat + "," + long + "&near=" + lat + "," + long, '_system', 'location=no');
        else
            window.open("geo:" + lat + "," + long + "?q=" + text, '_system', 'location=no');
    }







    $ionicModal.fromTemplateUrl('templates/class-modal-problem.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    $scope.openProblemModal = function() {
        $scope.modal.show();
    };
    $scope.motivo = "";
    //$scope.texto = "";
    $scope.doProblem = function(form) {
        /*console.log(form);
        console.log(form.texto.$viewValue);
        console.log($scope.texto);*/

        if ($scope.motivo == "") {
            ionicToast.show("Escolha o problema ocorrido em sua aula", 'bottom', false, 2000);
            return;
        }

        if (form.texto.$viewValue == "") {
            ionicToast.show("Diga um pouco mais sobre o problema", 'bottom', false, 2000);
            return;
        }

        $ionicLoading.show();

        $http.post(url + "class/problem", { 'userProfile': $rootScope.userProfile, 'motivo': $scope.motivo, 'texto': form.texto.$viewValue }).then(function(res) {
                console.log(res.data);
                $ionicLoading.hide();
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        ionicToast.show("O problema foi enviado para a nossa equipe.", 'bottom', false, 2000);
                        $scope.closeModal();
                        //$scope.class.status = 'cancel';
                    }
                }
            },
            function(res) {
                errorCallBack(res)
            }
        );



        /*if (form.$valid) {
            //alert($scope.userProfile.registrationId);
            AuthService.Login($scope.userProfile);
            $scope.closeLogin();
        } else {
            ionicToast.show("Preencha corretamente os campos destacados", 'bottom', false, 2000);
        }*/
    };

    $rootScope.changeMotivo = function(q) {
        $scope.motivo = q;
    }










})


.controller('IndicateCtrl', function($ionicHistory, $scope, $rootScope, AuthService, $ionicLoading) {
    $ionicLoading.show();
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    AuthService.Get(function() {
        $ionicLoading.hide();
        $scope.codigo = $rootScope.userProfile.codigo_indicacao;
        //console.log($scope.codigo);
    });


    $scope.copy = function() {
        //console.log('blablabla');

        var clipboard = new Clipboard('.error', {
            text: function() {
                return 'http://www.zimapp.com/?i=' + $scope.codigo;
            }
        });
    }



})

.controller('VerifyCtrl', function($scope, $http, $ionicHistory, $rootScope, AuthService, $ionicLoading, OrderService, $state, ionicToast) {
    //$ionicLoading.show();
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $scope.init = function() {
        //console.log($rootScope.userProfile);
        if ($rootScope.userProfile.isLogged) {
            AuthService.Get(function() {
                console.log($rootScope.userProfile);
                if ($rootScope.userProfile.isTeacher) {
                    $state.go('app.hometeacher');
                } else {
                    $state.go('app.subjects');
                }
            });


        } else {
            $state.go('app.signin');
        }

    }
    AuthService.GetCredentials($scope.init);
})






;