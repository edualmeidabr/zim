angular.module('checkout.controllers', [])

.controller('CheckoutCtrl', function($scope, $state, $http, $rootScope, AuthService, ionicToast, OrderService, $ionicHistory, $window, $ionicLoading, $timeout, $ionicPopup) {
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $rootScope.userProfile = AuthService.GetLoggedUser();

    AuthService.Get(function() {
        $rootScope.userProfile.order = OrderService.GetOrder();
        var checkout = OrderService.ResetCheckout();

        angular.forEach($rootScope.userProfile.order.schedule, function(v, k) {
            checkout.total += (v.factor * $rootScope.userProfile.order.teacher.price);
        });

        $rootScope.userProfile.order.checkout = checkout;
        if (checkout.total > 0) {
            $scope.total = formatMoney(checkout.total);
        }
    });

    $scope.goFinalized = function(form) {
        if (form.$valid) {
            if ($rootScope.userProfile.cards.length == 0) {
                ionicToast.show('Cadastre um cartão de crédito', 'bottom', false, 2000);
                return;
            }
            //$scope.showAlert('Suas aulas foram agendadas. Aproveite!');


            $ionicLoading.show();
            //obter a sessao
            $http.post(url + "order/session", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                    var ret = res.data;
                    if (ret.status == 'erro') {
                        $ionicLoading.hide();
                        ionicToast.show(ret.msg, 'bottom', false, 2000);
                    } else {
                        if (ret.status == 'OK') {
                            console.log(ret.msg);
                            PagSeguroDirectPayment.setSessionId(ret.msg);

                            //obter a hash
                            $rootScope.userProfile.order.hash = PagSeguroDirectPayment.getSenderHash();
                            console.log($rootScope.userProfile.order.hash);

                            $scope.card = AuthService.ResetCard();

                            //obter o cartao, para o token
                            $http.post(url + "card/get", { 'userProfile': $rootScope.userProfile }).then(function(ress) {
                                    console.log(ress.data);

                                    var ret = ress.data;
                                    if (ret.status == 'erro') {
                                        $ionicLoading.hide();
                                        ionicToast.show(ret.msg, 'bottom', false, 2000);

                                    } else {
                                        if (ret.status == 'OK') {
                                            $scope.card = ret.msg;
                                            $scope.card.brand = "";

                                            PagSeguroDirectPayment.getBrand({
                                                cardBin: $scope.card.bin,
                                                success: function(r) {
                                                    $scope.card.brand = r.brand.name;

                                                    PagSeguroDirectPayment.createCardToken({
                                                        cardNumber: $scope.card.number,
                                                        brand: $scope.card.brand,
                                                        cvv: $scope.card.code,
                                                        expirationMonth: $scope.card.month,
                                                        expirationYear: $scope.card.year,
                                                        success: function(r) {
                                                            $scope.card.token = r.card.token;
                                                            $rootScope.userProfile.order.token = r.card.token;

                                                            //salva a aula
                                                            $http.post(url + "class/add", { 'userProfile': $rootScope.userProfile }).then(function(resss) {
                                                                $ionicLoading.hide();
                                                                console.log(resss.data);

                                                                var rettt = resss.data;
                                                                if (rettt.status == 'erro') {
                                                                    ionicToast.show(rettt.msg, 'bottom', false, 2000);
                                                                } else {
                                                                    /*******   OK *********************/
                                                                    $scope.showPopup = function() {
                                                                        $state.go("app.subjects");

                                                                        var alertPopup = $ionicPopup.alert({
                                                                            title: 'Parabéns!',
                                                                            template: 'Sua aula foi agendada. Aproveite!',
                                                                            cssClass: 'alert'
                                                                        });
                                                                        alertPopup.then(function(res) {
                                                                            $window.location.reload();
                                                                        });
                                                                    }
                                                                    $scope.showPopup();



                                                                    /**
                                                                     * 
                                                                     if (rettt.status == 'OK') {

                                                                        //ionicToast.show('Sua aula foi agendada. Aproveite!', 'bottom', false, 2000);


                                                                        var alertPopup = $ionicPopup.alert({
                                                                            title: '<i class="icon ion-alert-circled"></i> Parabéns!',
                                                                            template: 'Sua aula foi agendada. Aproveite!',
                                                                            cssClass: 'alert'
                                                                        });

                                                                        $state.go("app.subjects");



                                                                    } else {
                                                                        ionicToast.show(rettt.msg, 'bottom', false, 2000);
                                                                        return false;
                                                                    }

                                                                    */
                                                                }
                                                            });

                                                        },
                                                        //erro createCardToken
                                                        error: function(r) {
                                                            //$ionicLoading.hide();
                                                            //console.log(r);
                                                            ionicToast.show('Algum erro ocorreu. O processo reiniciará.', 'bottom', false, 2000);
                                                            $timeout(function() {
                                                                //myPopup.close(); //close the popup after 3 seconds for some reason                                                                
                                                                $window.location.reload();
                                                            }, 2000);

                                                        },
                                                        complete: function(r) {

                                                        }
                                                    });


                                                },
                                                //erro getBrand
                                                error: function(r) {
                                                    //$ionicLoading.hide();
                                                    //console.log(r);
                                                    //$window.location.reload();
                                                    ionicToast.show('Algum erro ocorreu. O processo reiniciará.', 'bottom', false, 2000);
                                                    $timeout(function() {
                                                        //myPopup.close(); //close the popup after 3 seconds for some reason                                                                
                                                        $window.location.reload();
                                                    }, 2000);
                                                },
                                                complete: function(r) {

                                                }
                                            });
                                            //class/add
                                        } else {
                                            $ionicLoading.hide();
                                            ionicToast.show("Algum erro ocorreu. Por favor, tente novamente. ", 'bottom', false, 2000)
                                            return false;
                                        }
                                    }
                                },
                                function(res) {
                                    $ionicLoading.hide();
                                    errorCallBack(res)
                                }
                            );
                            //card/get
                        } else {
                            $ionicLoading.hide();
                            ionicToast.show("Algum erro ocorreu. Por favor, tente novamente. 2", 'bottom', false, 2000);
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