angular.module('auth.services', [])

.factory('AuthService', function($http, $cookies, ionicToast, $ionicModal, $state, $ionicHistory, $rootScope, MapService, $ionicLoading, OrderService, $cookies) {
    var service = {};
    service.Login = Login;
    service.SetCredentials = SetCredentials;
    service.GetCredentials = GetCredentials;
    service.ClearCredentials = ClearCredentials;
    service.Register = Register;
    service.Verify = Verify;
    service.ResetUser = ResetUser;
    service.Get = Get;
    service.ResetCard = ResetCard;
    service.AutoLogin = AutoLogin;
    service.IsLogged = IsLogged;
    service.GetLoggedUser = GetLoggedUser;
    service.tratarRetorno = tratarRetorno;


    return service;

    function Login(userProfile) {

        //console.log($rootScope.userProfile);
        //alert(userProfile.registrationId);
        userProfile.registrationId = $cookies.getObject('registrationIdZim');

        $http.post(url + "user/login", { 'userProfile': userProfile }).then(function(res) {
                //console.log($cookies.get('userProfile'));
                var ret = res.data;
                console.log(ret);
                //ionicToast.show(ret.msg, 'bottom', false, 2000);
                //console.log(ret.msg);
                //console.log(angular.fromJson(ret.msg));
                //ClearCredentials();

                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 20000000000);
                } else {
                    if (ret.status == 'OK') {
                        tratarRetorno(ret);
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
    }


    function Register(userProfile) {
        userProfile.registrationId = $cookies.getObject('registrationIdZim');
        $http.post(url + "user/save", { 'userProfile': userProfile }).then(function(res) {
                console.log(res.data);
                var ret = res.data;
                if (ret.status == 'OK') {
                    tratarRetorno(ret);
                } else {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);
                    //ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);
                    return false;
                }
            },
            function(res) {
                errorCallBack(res)
            }
        );
    }

    function tratarRetorno(ret) {

        var user = angular.fromJson(ret.msg);
        console.log(user);

        $rootScope.userProfile = ResetUser();
        $rootScope.userProfile.id = user.id;
        $rootScope.userProfile.name = user.name;
        $rootScope.userProfile.email = user.email;
        $rootScope.userProfile.img = user.img;
        $rootScope.userProfile.isTeacher = user.isTeacher;
        $rootScope.userProfile.isLogged = true;
        $rootScope.userProfile.codigo_indicacao = user.codigo_indicacao;

        $rootScope.userProfile.is_tel_confirmado = user.is_tel_confirmado;



        //console.log($rootScope.userProfile.img);

        if ($rootScope.userProfile.isTeacher) {
            $rootScope.userProfile.dados.rg = user.dados.rg;
            $rootScope.userProfile.dados.deslocamento = user.dados.deslocamento;
            $rootScope.userProfile.dados.valor_aula = user.dados.valor_aula;
            $rootScope.userProfile.availability = user.availability;
            $rootScope.userProfile.subjects = user.subjects;


            $rootScope.userProfile.dados.banco = user.dados.banco;
            $rootScope.userProfile.dados.agencia = user.dados.agencia;
            $rootScope.userProfile.dados.conta = user.dados.conta;
            $rootScope.userProfile.dados.tipo_conta_banco = user.dados.tipo_conta_banco;
            $rootScope.userProfile.dados.peridiocidade = user.dados.peridiocidade;

            $rootScope.userProfile.dados.nome_titular = user.dados.nome_titular;
            $rootScope.userProfile.dados.cpf_titular = user.dados.cpf_titular;


        } else {
            $rootScope.userProfile.level = user.level;
        }
        SetCredentials();
        GoFirstPage();
    }


    function SetCredentials() {
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 30);
        $cookies.putObject('userProfile', $rootScope.userProfile, { expires: cookieExp });
    }

    function GetCredentials(callback) {
        var ret = ResetUser();
        ret = $cookies.getObject('userProfile');
        //console.log(callback);
        if (ret === undefined)
            ret = ResetUser();

        $rootScope.userProfile = ret;
        $rootScope.userProfile.isLogged = $rootScope.userProfile.id != "";
        $rootScope.userProfile.order = OrderService.GetOrder();

        if (undefined !== callback && callback != null) {
            callback();
        }
        return ret;
    }


    function GetLoggedUser(callback) {
        var ret = ResetUser();
        ret = $cookies.getObject('userProfile');
        //console.log(callback);
        if (ret === undefined)
            ret = ResetUser();

        console.log(ret);
        return ret;
    }


    function AutoLogin() {
        var ret = GetCredentials();

        if ($rootScope.userProfile.isLogged) {
            GoFirstPage();
        }
    }


    function IsLogged() {
        var ret = GetCredentials();

        return $rootScope.userProfile.isLogged;
    }

    function ClearCredentials() {
        $rootScope.userProfile = ResetUser();
        $cookies.remove('userProfile');
    }

    function GoFirstPage() {
        //console.log($rootScope.userProfile);
        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        if ($rootScope.userProfile !== undefined && $rootScope.userProfile.id != "") {
            //console.log($rootScope.userProfile);
            //alert($rootScope.userProfile.dados.descricao);

            if ($rootScope.userProfile.is_tel_confirmado == false || $rootScope.userProfile.is_tel_confirmado == 0 || $rootScope.userProfile.is_tel_confirmado == "0") {
                var id = $rootScope.userProfile.id;
                ClearCredentials();
                $rootScope.userProfile.id = id;
                console.log($rootScope.userProfile.id);
                $state.go('app.confirmphone', { 'id': id });



            } else if ($rootScope.userProfile.isTeacher) {
                //console.log($rootScope.userProfile.dados);
                if ($rootScope.userProfile.dados.rg == "" || $rootScope.userProfile.dados.rg == null) {
                    $state.go('app.signinteacherdocs');
                } else if ($rootScope.userProfile.dados.deslocamento == "" || $rootScope.userProfile.dados.deslocamento == null) {
                    $state.go('app.signinteacheraddress');
                } else if ($rootScope.userProfile.availability == "" || $rootScope.userProfile.availability == null) {
                    $state.go('app.signinteacheravailability');
                } else if ($rootScope.userProfile.subjects == "" || $rootScope.userProfile.subjects == null) {
                    $state.go('app.signinteachersubjects');
                }
                /*else if ($rootScope.userProfile.dados.descricao == "") {
                                   $state.go('app.signinteacherdescription');
                               }*/
                else {
                    $state.go('app.hometeacher');
                }
            } else {
                //console.log('app.subjects');
                //ionicToast.show('app.subjects', 'bottom', false, 2000);
                console.log($rootScope.userProfile);
                if ($rootScope.userProfile.level == "" || $rootScope.userProfile.level == null) {
                    $state.go('app.signinlevel');
                } else {
                    $state.go('app.subjects');
                }
            }
        }
    }


    function Verify() {
        //$rootScope.userProfile = GetCredentials();
        //console.log($rootScope.userProfile);
        if ($rootScope.userProfile === undefined || $rootScope.userProfile.id == "") {
            //console.log('aqui');
            ResetUser();
            $state.go('app.signin');
        }
    }


    function ResetUser() {
        var userProfile = {};
        userProfile.isLogged = false;
        userProfile.isTeacher = false;
        userProfile.id = "";
        userProfile.email = "";
        userProfile.password = "";
        userProfile.name = "";
        userProfile.phone = "";
        userProfile.img = "";
        userProfile.addresses = [];
        userProfile.cards = [];
        userProfile.classes = [];
        userProfile.codigo = "";

        userProfile.is_tel_confirmado = false;

        userProfile.order = {};
        userProfile.order.subject = {};
        userProfile.order.address = {};
        userProfile.order.teacher = {};
        userProfile.order.schedule = [];

        userProfile.dados = {};
        userProfile.dados.data_nascimento = "";
        userProfile.dados.sexo = "M";

        userProfile.colegio = {};
        userProfile.colegio.id = "";
        userProfile.colegio.nome = "";
        userProfile.colegio.url = "";

        userProfile.level = "1";
        userProfile.registrationId = "";

        /***TEACHER */
        userProfile.address = {};
        userProfile.neighborhood = [];
        userProfile.availability = [];
        userProfile.subjects = [];

        userProfile.dados.rg = "";
        userProfile.dados.cpf = "";
        userProfile.dados.experiencia = "";
        userProfile.dados.deslocamento = "";
        userProfile.dados.valor_aula = "";
        userProfile.dados.descricao = "";


        userProfile.dados.banco = "";
        userProfile.dados.agencia = "";
        userProfile.dados.conta = "";
        userProfile.dados.tipo_conta_banco = "";
        userProfile.dados.peridiocidade = "";
        userProfile.dados.nome_titular = "";
        userProfile.dados.cpf_titular = "";


        return userProfile;
    }


    function Get(callback) {
        $ionicLoading.show();
        //console.log(callback);

        if (undefined === $rootScope.userProfile) {
            $rootScope.userProfile = GetCredentials();
        }
        $http.post(url + "user/get", { 'userProfile': $rootScope.userProfile }).then(function(res) {
                $ionicLoading.hide();
                var ret = res.data;
                //console.log(ret.msg);

                if (ret.status == 'erro') {
                    ionicToast.show(ret.msg, 'bottom', false, 2000);

                    /* if (undefined !== callback && callback != null) {
                         callback();
                         return;
                     }*/
                } else {
                    if (ret.status == 'OK') {
                        $rootScope.userProfile = angular.fromJson(ret.msg);
                        //console.log($rootScope.userProfile);


                        if (undefined !== callback && callback != null) {
                            callback();
                            return;
                        }

                        return true;
                    } else {
                        ionicToast.show("Algum erro ocorreu. Por favor, tente novamente.", 'bottom', false, 2000);

                        /*if (undefined !== callback && callback != null) {
                            callback();
                            return;
                        }*/
                        return false;
                    }
                }
            },
            function(res) {
                errorCallBack(res)
            }
        );
    }

    function ResetCard() {
        var card = {};
        card.id = "";
        card.name = "";
        card.name_print = "";
        card.number = "";
        card.code = "";
        card.date = "";
        card.month = "";
        card.year = "";
        card.phone = "";
        card.cpf = "";
        card.birth = "";

        card.brand = "";
        card.bin = "";

        card.address = MapService.ResetAddress();

        return card;
    }
})

;