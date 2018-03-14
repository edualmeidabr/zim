angular.module('teacher.controllers', [])


.controller('HomeTeacherCtrl', function($scope, $state, $ionicHistory, $http, $rootScope, AuthService, ionicToast, $ionicLoading, $ionicModal, ionicTimePicker) {
    //console.log($scope.userProfile);
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    $scope.is_indisponivel = false;

    $rootScope.userProfile = AuthService.GetCredentials(
        function() {
            //$scope.itemsSchedule = [];
            $ionicLoading.show();
            $http.post(url + "schedule/list", { 'userProfile': $scope.userProfile }).then(function(res) {
                    //console.log(res.data);
                    $ionicLoading.hide();
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                        $scope.itemsSchedule = [];
                    } else {
                        if (ret.status == 'OK') {
                            $scope.itemsSchedule = ret.msg;
                        } else {
                            $scope.itemsSchedule = [];
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
    );
    $scope.openClass = function(classe) {
        //console.log(classe);
        $state.go("app.class", { "classId": classe.id });
    }




    var disableDates = [];
    var disableDaysWeek = [];
    var selectedDates = [];
    var currentDate = new Date();
    var date = new Date();
    $scope.date = date;
    $scope.onezoneDatepicker = {
        date: date,
        mondayFirst: false,
        months: MONTHS,
        daysOfTheWeek: DAYSOFWEEK,
        startDate: new Date(2017, 1, 1),
        endDate: new Date(date.getFullYear() + 1, date.getMonth() + 1, date.getDay()),
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
            $scope.dateScheduleBd = year + "-" + month + "-" + day;
            $scope.day = day;
            $scope.month = month;
            $scope.year = year;
            $scope.monthIndex = monthIndex - 1;

            $scope.openModalDay();
        },
        highlights: selectedDates
    };
    $ionicModal.fromTemplateUrl('templates/hometeacher.schedule.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModalDay = function() {

        $scope.hour = "";
        $scope.hora = "";
        $scope.minuto = "";
        $scope.hourFim = "";
        $scope.is_indisponivel = false;
        $scope.is_indisponivel.checked = false;

        $http.post(url + "schedule/list", { 'userProfile': $scope.userProfile, 'date': $scope.year + '-' + $scope.month + '-' + $scope.day }).then(function(res) {
                $ionicLoading.hide();
                var ret = res.data;
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                    $scope.itemsScheduleDay = [];
                } else {
                    if (ret.status == 'OK') {
                        $scope.itemsScheduleDay = ret.msg;
                    } else {
                        $scope.itemsScheduleDay = [];
                        ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                        return false;
                    }
                }
            },
            function(res) {
                errorCallBack(res)
            }
        );

        $http.post(url + "disponibility/get", { 'userProfile': $scope.userProfile, 'date': $scope.year + '-' + $scope.month + '-' + $scope.day }).then(function(res) {
                $ionicLoading.hide();
                var ret = res.data;
                console.log(ret);
                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        var dados = ret.msg;
                        console.log(dados);

                        $scope.hour = dados.start != "" && dados.start != null ? dados.start + ":00" : "";

                        $scope.hourFim = dados.end != "" && dados.end != null ? dados.end + ":00" : "";

                        $scope.is_indisponivel = dados.is_disponivel == 0;

                        $scope.modal.show();

                    } else {
                        ionicToast.show("Algum erro ocorreu. Por favor, tente novamente. 2", 'bottom', false, 2000);
                        return false;
                    }
                }
            },
            function(res) {
                errorCallBack(res)
            }
        );



    };
    $scope.closeModalDay = function() {
        $scope.modal.hide();
    };




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
                    //minuto = selectedTime.getUTCMinutes();
                    minuto = 0;

                    var msg = '';
                    if (hora < 7) {
                        hora = 7;
                        msg = 'A hora foi automaticamente alterada.';
                    } else if (hora > 22) {
                        hora = 22;
                        msg = 'A hora foi automaticamente alterada.';
                    } else if (hora >= $scope.horaFim) {
                        hora = $scope.horaFim - 1;
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
                    if (today.getTime() === date.getTime()) {
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

                    //$scope.hour = hora + ':' + minuto;
                    $scope.hour = hora + ':00';

                    $scope.hora = hora;
                    $scope.minute = minuto;

                    if (msg != '') {
                        ionicToast.show(msg, 'bottom', false, 2000);
                    }

                    console.log(((8 * 60 * 60) + (30 * 60)))

                }
            },
            inputTime: (8 * 60 * 60),
            //inputTime:((8 * 60 * 60) + (30 * 60)),
            format: 24,
            step: 60,
            setLabel: 'Definir',
            closeLabel: 'X'
        };

        ionicTimePicker.openTimePicker(dateTime);
    }

    $scope.openHourFim = function() {
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
                    } else if (hora <= $scope.hora) {
                        hora = $scope.hora + 2;
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
                    if (today.getTime() === date.getTime()) {
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

                    //$scope.hourFim = hora + ':' + minuto;
                    $scope.hourFim = hora + ':00';

                    $scope.horaFim = hora;
                    $scope.minuteFim = minuto;

                    if (msg != '') {
                        ionicToast.show(msg, 'bottom', false, 2000);
                    }
                }
            },
            //inputTime: ((8 * 60 * 60) + (30 * 60)),
            inputTime: (8 * 60 * 60),
            format: 24,
            step: 60,
            setLabel: 'Definir',
            closeLabel: 'X'
        };

        ionicTimePicker.openTimePicker(dateTime);
    }


    $scope.changeDisponibilityDay = function() {
        //console.log($scope.is_indisponivel);
        //return;

        $http.post(url + "disponibility/addDay", { 'userProfile': $scope.userProfile, 'date': $scope.dateScheduleBd, 'horaIni': $scope.hour, 'horaFim': $scope.hourFim, 'is_disponivel': !$scope.is_indisponivel ? "true" : "false" }).then(function(res) {
                console.log(res.data);
                $ionicLoading.hide();
                var ret = res.data;

                $scope.closeModalDay();

                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                } else {
                    if (ret.status == 'OK') {
                        ionicToast.show("A sua agenda foi alterada.", 'bottom', false, 2000);
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


    $scope.changeCheckBox = function(v) {
        //$scope.is_indisponivel = !$scope.is_indisponivel;
        //console.log(v);
        $scope.is_indisponivel = v;
    }



})


.controller('GainCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, $rootScope, AuthService, ionicToast, $ionicLoading) {
    $ionicLoading.show();
    $rootScope.userProfile = AuthService.GetCredentials();

    $rootScope.gain = {};

    $http.post(url + "teacher/gain", { 'userProfile': $scope.userProfile }).then(function(res) {
            $ionicLoading.hide();
            console.log(res.data);
            var ret = res.data;
            if (ret.status == 'erro') {
                ionicToast.show(ret.msg, 'bottom', false, 2000);
            } else {
                if (ret.status == 'OK') {
                    $rootScope.gain = ret.msg;
                    console.log($rootScope.gain);
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



    $scope.doChangeBank = function(form) {
        //console.log(form);

        console.log($rootScope.userProfile);


        if (form.$valid) {
            $ionicLoading.show();

            $http.post(url + "user/editBank", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                    $ionicLoading.hide();
                    var ret = res.data;
                    console.log(ret);
                    if (ret.status == 'erro') {
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            //console.log(document.getElementById('user-photo').src);
                            //$rootScope.userProfile = angular.fromJson(ret.msg);
                            //$state.go('app.subjects');

                            AuthService.SetCredentials();
                            ionicToast.show("Dados bancários alterados.", 'bottom', false, 1000);


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



});