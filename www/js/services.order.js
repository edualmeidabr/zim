angular.module('order.services', [])

.factory('OrderService', function($http, ionicToast, $cookies, $rootScope) {
    var service = {};
    service.ResetOrder = ResetOrder;
    service.ResetSchedule = ResetSchedule;
    service.ResetCheckout = ResetCheckout;
    service.SetOrder = SetOrder;
    service.GetOrder = GetOrder;
    service.ClearOrder = ClearOrder;

    return service;


    function ResetOrder() {
        var order = {};
        order.id = "";

        order.hash = "";
        order.token = "";

        order.subject = {};
        order.address = {};
        order.teacher = {};
        order.schedule = [];
        order.checkout = {};

        return order;
    }

    function ResetSchedule() {
        var schedule = {};
        schedule.hour = "";
        schedule.date = "";
        schedule.duration = "";
        schedule.hourEnd = "";
        schedule.factor = "";

        return schedule;
    }


    function ResetCheckout() {
        var checkout = {};
        checkout.total = 0;
        checkout.card = "";

        return checkout;
    }


    function SetOrder() {
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 30);
        $cookies.putObject('ordrZim', $rootScope.userProfile.order, { expires: cookieExp });
    }

    function GetOrder() {
        var ret = $cookies.getObject('ordrZim');
        //console.log(ret);

        if (undefined === ret)
            ret = ResetOrder();

        //console.log(ret);

        //$rootScope.userProfile.order = ret;

        return ret;
    }

    function ClearOrder() {
        $rootScope.userProfile.order = ResetOrder();
        $cookies.remove('ordrZim');
    }


});