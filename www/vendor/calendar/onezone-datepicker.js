! function(e, t) {
    var a = e.createElement("style");
    if (e.getElementsByTagName("head")[0].appendChild(a), a.styleSheet) a.styleSheet.disabled || (a.styleSheet.cssText = t);
    else try {
        a.innerHTML = t
    } catch (n) {
        a.innerText = t
    }
}(document, '.onezone-datepicker {\n  position: relative;\n  width: 100%;\n  display: block;\n  background-color: #FBFAFA;\n  color: #000000;\n  overflow: hidden;\n  max-height: 0;\n margin: 0 auto;\n  transition: max-height 0.4s; font-weight: bold; }\n\n.onezone-datepicker.onezone-datepicker-show {\n  max-height: 600px;\n }\n\n.onezone-datepicker-modal {\n  position: absolute;\n  z-index: 1;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  text-align: center;\n  background: rgba(255, 255, 255, 0.9); }\n\n.onezone-datepicker-loader {\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  -ms-transform: translateY(-50%);\n  transform: translateY(-50%);\n  margin-left: -10px; }\n\n.onezone-datepicker-loader svg {\n  width: 20px;\n  height: 20px; }\n\n.onezone-datepicker-button {\n  position: relative;\n  text-align: center;\n  display: inline-block;\n  cursor: pointer;\n  color: #000000;\n  font-size: 15px;\n  font-weight: bold;\n  margin-bottom: 5px;\n  padding: 8px 0;\n  border-bottom: 1px solid #53c5cf;\n  padding: 5px; }\n\n.onezone-datepicker-button:after {\n  position: absolute;\n  content: " ";\n  width: 0;\n  height: 0;\n  right: 0;\n  bottom: 0;\n  border-bottom: 6px solid #53c5cf;\n  border-left: 6px solid transparent; }\n\n.onezone-datepicker-select-year {\n  position: absolute;\n  top: 8px;\n  left: 5px;\n  width: 25%; }\n\n.onezone-datepicker-navigation-arrow {\n  display: inline-block;\n  cursor: pointer;\n  font-size: 24px;\n  color: #53c5cf;\n  text-align: center;\n  width: 24px;\n  padding-top: 10px;\n  line-height: 24px; }\n\n.onezone-datepicker-week {\n  font-weight: 600;\n  font-size: 13px;\n  text-align: center;\n  margin-bottom: 0px;\n  border-bottom: 1px solid #dddddd;\n  padding: px 0; }\n\n.onezone-datepicker-day {\n  -webkit-border-radius: 100%;\n  -moz-border-radius: 100%;\n  -ms-border-radius: 100%;\n  border-radius: 100%;\n  cursor: pointer;\n  display: block;\n  margin: 0 auto;\n  text-align: center;\n  font-size: 12px;\n  width: 26px;\n  height: 26px;\n  line-height: 22px;\n  border: 2px solid #FBFAFA; }\n\n.onezone-datepicker-current-day {\n  border: 2px solid #dddddd; }\n\n.onezone-datepicker-disable-day,\n.onezone-datepicker-different-month.onezone-datepicker-disable-day {\n  color: #a4a4a4;  font-weight: normal; }\n\n.onezone-datepicker-different-month {\n  color: #afafaf; }\n\n.onezone-datepicker-active-day,\n.onezone-datepicker-active-day:hover {\n  border: 2px solid #53c5cf;\n  font-weight: bold; }\n\n.onezone-datepicker-selection-button {\n  color: #53c5cf;\n  font-size: 34px;\n  padding-top: 5px;\n  display: inline-block;\n  cursor: pointer;\n  width: 40px; }\n\n.onezone-datepicker-close-button {\n  position: absolute;\n  right: 10px;\n  top: 10px;\n  z-index: 1;\n  font-size: 28px;\n  cursor: pointer;\n  color: #000000;\n  width: 50px;\n  text-align: right; }\n\n.onezone-datepicker-modal-content {\n  position: relative;\n  padding: 50px 5px 40px 5px; }\n\n.onezone-datepicker-modal-content .slider {\n  position: initial; }\n\n.onezone-datepicker-modal-content:after {\n  content: "";\n  display: table;\n  clear: both; }\n\n.onezone-datepicker-modal-item {\n  display: block;\n  float: left;\n  width: 25%;\n  line-height: 50px;\n  font-size: 14px;\n  text-transform: uppercase;\n  cursor: pointer; }\n\n.onezone-datepicker-modal-item.onezone-datepicker-modal-item-active {\n  background-color: #53c5cf;\n  color: white;\n  font-weight: bold; }'), ! function(e) {
    try {
        e = angular.module("onezone-datepicker.templates")
    } catch (t) {
        e = angular.module("onezone-datepicker.templates", [])
    }
    e.run(["$templateCache", function(e) {
        e.put("onezone-datepicker.html", '<div class=onezone-content><div class=onezone-transclude><ng-transclude></ng-transclude></div><div class=onezone-datepicker ng-class="{ \'onezone-datepicker-show\' : datepicker.showDatepicker }"><div class=onezone-datepicker-modal ng-if="datepicker.showLoader || datepicker.showMonthModal || datepicker.showYearModal"><div class="onezone-datepicker-close-button icon ion-ios-close-outline" ng-if="datepicker.showMonthModal || datepicker.showYearModal" ng-click=closeModals()></div><ion-spinner icon=spiral class="spinner-dark onezone-datepicker-loader" ng-if=datepicker.showLoader></ion-spinner><div class=onezone-datepicker-modal-content ng-if=datepicker.showMonthModal><div class="onezone-datepicker-button onezone-datepicker-select-year" ng-click=openYearModal()>{{currentMonth.getFullYear()}}</div><div class=onezone-datepicker-modal-item ng-repeat="m in months track by $index" ng-class="{\'onezone-datepicker-modal-item-active\': currentMonth.getMonth() == $index}" ng-click=selectMonth($index)>{{m.substr(0,3)}}</div></div><div class=onezone-datepicker-modal-content ng-if=datepicker.showYearModal><ion-slide-box show-pager=false active-slide=selectedYearSlide><ion-slide ng-repeat="slide in yearSlides"><div class=onezone-datepicker-modal-item ng-repeat="year in slide.years" ng-click=selectYear(year) ng-class="{\'onezone-datepicker-modal-item-active\': currentMonth.getFullYear() == year}">{{year}}</div></ion-slide></ion-slide-box></div></div><div class=row><div class=col-25><span class="onezone-datepicker-navigation-arrow ion-ios-arrow-back" ng-click=previousMonth()></span></div><div class="col text-center"><div class=onezone-datepicker-button ng-click=openMonthModal()>{{months[currentMonth.getMonth()]}} {{currentMonth.getFullYear()}}</div></div><div class="col-25 text-right"><span class="onezone-datepicker-navigation-arrow ion-ios-arrow-forward" ng-click=nextMonth()></span></div></div><div class=row><div class="col onezone-datepicker-week" ng-repeat="dayOfTheWeek in daysOfTheWeek track by $index">{{ dayOfTheWeek }}</div></div><div class=row ng-repeat="week in month" on-swipe-right=swipeRight() on-swipe-left=swipeLeft()><div class=col ng-repeat="day in week.days" ng-click="selectDate(day.fullDate, day.isDisabled)"><div class=onezone-datepicker-day ng-style="{ \'background-color\': day.highlight.color, \'color\': day.highlight.textColor }" ng-class="{ \'onezone-datepicker-current-day\' : day.isToday, \'onezone-datepicker-different-month\' : !day.isCurrentMonth, \'onezone-datepicker-active-day\' : sameDate(day.fullDate, selectedDate), \'onezone-datepicker-disable-day\' : day.isDisabled }">{{day.date}}</div></div></div><div class=row ng-if=!datepicker.calendarMode><div class=col><span class="onezone-datepicker-selection-button ion-ios-calendar-outline" ng-if=datepicker.showTodayButton ng-click=selectToday()></span></div><div class="col text-right"><span class="onezone-datepicker-selection-button ion-ios-close-outline" ng-if=!datepicker.hideCancelButton ng-click=hideDatepicker()></span> <span class="onezone-datepicker-selection-button ion-ios-checkmark" ng-if=!datepicker.hideSetButton ng-click=setDate()></span></div></div></div></div>')
    }])
}(), angular.module("onezone-datepicker.service", ["ionic"]).factory("onezoneDatepickerService", function() {
    "use strict";

    function e(e, t) {
        return angular.isDefined(e) && angular.isDate(e) && angular.isDefined(t) && angular.isDate(t) ? e.getDate() === t.getDate() && e.getMonth() === t.getMonth() && e.getFullYear() === t.getFullYear() : !1
    }

    function t(e, t) {
        var a, n = new Date(e.getFullYear(), e.getMonth(), 1);
        return (t || 0 === e.getDay() && 1 === e.getDate()) && (!t || 1 === e.getDay() && 1 === e.getDate()) || (a = n.getDay() - t, a = t && 0 > a ? 6 : a, n = new Date(e.getFullYear(), e.getMonth(), 1 - a)), n
    }

    function a(t, a, n, i, r, o, d) {
        var c, l, s, p, u = new Date;
        if (l = new Date(u.getFullYear(), u.getMonth(), u.getDate()), c = new Date(t.getFullYear(), t.getMonth(), t.getDate()), a && l > c) return !0;
        if (n && (s = c.getDay(), 0 === s || 6 === s)) return !0;
        if (angular.isDefined(o) && o > c) return !0;
        if (angular.isDefined(d) && c > d) return !0;
        if (angular.isDefined(i) && angular.isArray(i))
            for (var g = 0; g < i.length; g++)
                if (p = new Date(i[g].getFullYear(), i[g].getMonth(), i[g].getDate()), e(p, c)) return !0;
        if (angular.isDefined(r) && angular.isArray(r)) {
            var h = t.getDay();
            if (r.indexOf(h) > -1) return !0
        }
        return !1
    }

    function n(e, t) {
        if (angular.isDefined(e) && angular.isArray(e) && e.length > 0)
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                if (angular.isDefined(n.date) && u(t, n.date)) {
                    var i = "#53c5cf",
                        r = "#fff";
                    return angular.isDefined(n.color) && (i = n.color), angular.isDefined(n.textColor) && (r = n.textColor), {
                        color: i,
                        textColor: r
                    }
                }
            }
        return null
    }

    function i(e, t, i, r, o, d, c, l, s) {
        var p = [];
        e = angular.copy(e);
        for (var g = 0; 7 > g; g++) {
            p.push({
                fullDate: e,
                date: e.getDate(),
                month: e.getMonth(),
                year: e.getFullYear(),
                day: e.getDay(),
                isToday: u(e, new Date),
                isCurrentMonth: e.getMonth() === t.getMonth(),
                isDisabled: a(e, i, r, o, d, c, l),
                highlight: n(s, e)
            });
            var h = e;
            e = angular.copy(e), e.setDate(e.getDate() + 1), h.getDate() === e.getDate() && e.setDate(e.getDate() + 1)
        }
        return p
    }
    var r = {},
        o = function(e) {
            var t, a, n, i, r, o = !1,
                d = !1,
                c = !1,
                p = !1,
                u = !0,
                g = [],
                h = !1,
                k = !1,
                b = !1,
                f = !1,
                D = [],
                y = [];
            return angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.mondayFirst) && (o = e.datepickerObject.mondayFirst), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.disablePastDays) && (c = e.datepickerObject.disablePastDays), angular.isDefined(e.datepickerObject && angular.isDefined(e.datepickerObject.disableWeekend)) && (p = e.datepickerObject.disableWeekend), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.disableSwipe) && (d = e.datepickerObject.disableSwipe), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.disableDates) && angular.isArray(g) && (g = e.datepickerObject.disableDates), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.months) && angular.isArray(e.datepickerObject.months) && 12 === e.datepickerObject.months.length ? e.months = e.datepickerObject.months : e.months = l(), angular.isDefined(e.datepickerObject) ? e.daysOfTheWeek = s(o, e.datepickerObject.daysOfTheWeek) : e.daysOfTheWeek = s(o, null), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.startDate) && angular.isDate(e.datepickerObject.startDate) ? (a = e.datepickerObject.startDate.getFullYear(), i = e.datepickerObject.startDate) : a = e.currentMonth.getFullYear() - 120, angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.endDate) && angular.isDate(e.datepickerObject.endDate) ? (n = e.datepickerObject.endDate.getFullYear(), r = e.datepickerObject.endDate) : n = e.currentMonth.getFullYear() + 11, angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.showDatepicker) && (h = e.datepickerObject.showDatepicker), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.showTodayButton) && (u = e.datepickerObject.showTodayButton), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.callback) && angular.isFunction(e.datepickerObject.callback) && (t = e.datepickerObject.callback), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.calendarMode) && (k = e.datepickerObject.calendarMode), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.hideCancelButton) && (b = e.datepickerObject.hideCancelButton), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.hideSetButton) && (f = e.datepickerObject.hideSetButton), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.highlights) && angular.isArray(e.datepickerObject.highlights) && (D = e.datepickerObject.highlights), angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.disableDaysOfWeek) && angular.isArray(e.datepickerObject.disableDaysOfWeek) && (y = e.datepickerObject.disableDaysOfWeek), {
                mondayFirst: o,
                startYear: a,
                endYear: n,
                displayFrom: i,
                displayTo: r,
                disableSwipe: d,
                disablePastDays: c,
                disableWeekend: p,
                disableDates: g,
                showDatepicker: h,
                showTodayButton: u,
                calendarMode: k,
                hideCancelButton: b,
                hideSetButton: f,
                highlights: D,
                disableDaysOfWeek: y,
                callback: t
            }
        },
        d = function(e, t) {
            for (var a = 0, n = [], i = [], r = e; t >= r; r++) i.push(r), a++, a % 12 === 0 && (n.push({
                years: i
            }), i = []);
            return i.length > 0 && n.push({
                years: i
            }), n
        },
        c = function(e, t) {
            if (angular.isDefined(e) && angular.isArray(e))
                for (var a = 0; a < e.length; a++) {
                    var n = e[a].years.indexOf(t);
                    if (n > -1) return a
                }
            return 0
        },
        l = function() {
            var e = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return e
        },
        s = function(e, t) {
            var a = [];
            return a = angular.isDefined(t) && angular.isArray(t) && 7 === t.length ? angular.copy(t) : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], angular.isDefined(e) && e === !0 && a.push(a.shift()), a
        },
        p = function(e) {
            var t = e.getFullYear(),
                a = e.getMonth() - 1;
            return 0 > a && (t -= 1, a = 11), new Date(t, a, 1)
        },
        u = function(t, a) {
            return e(t, a)
        },
        g = function(e) {
            for (var a = !1, n = 0, r = [], o = t(e.date, e.mondayFirst), d = o.getMonth(); !a;) {
                r.push({
                    days: i(o, e.date, e.disablePastDays, e.disableWeekend, e.disableDates, e.disableDaysOfWeek, e.displayFrom, e.displayTo, e.highlights)
                }), o.setDate(o.getDate() + 7);
                var c = (r[r.length - 1] || {}).days;
                c && (c[c.length - 1] || {}).date === o.getDate() && o.setDate(o.getDate() + 1), a = n++ > 1 && d !== o.getMonth(), d = o.getMonth()
            }
            return r
        },
        h = function(e) {
            var t = new Date;
            return !e.showTodayButton || e.calendarMode ? !1 : !a(t, e.disablePastDays, e.disableWeekend, e.disableDates, e.displayFrom, e.displayTo)
        };
    return r.getParameters = o, r.getYears = d, r.getActiveYearSlide = c, r.getMonths = l, r.getDaysOfTheWeek = s, r.getPreviousMonth = p, r.sameDate = u, r.createMonth = g, r.showTodayButton = h, r
}), angular.module("onezone-datepicker", ["ionic", "onezone-datepicker.templates", "onezone-datepicker.service"]).directive("onezoneDatepicker", ["$ionicGesture", "onezoneDatepickerService", function(e, t) {
    "use strict";

    function a(e) {
        var a, n = {};
        return a = angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.date) && angular.isDate(e.datepickerObject.date) ? angular.copy(e.datepickerObject.date) : angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.date) && angular.isNumber(e.datepickerObject.date) ? new Date(e.datepickerObject.date) : new Date, e.selectedDate = a, e.currentMonth = angular.copy(a), n = t.getParameters(e), e.createDatepicker = function(e) {
            var a = {
                date: e,
                mondayFirst: n.mondayFirst,
                disablePastDays: n.disablePastDays,
                displayFrom: n.displayFrom,
                displayTo: n.displayTo,
                disableWeekend: n.disableWeekend,
                disableDates: n.disableDates,
                disableDaysOfWeek: n.disableDaysOfWeek,
                highlights: n.highlights
            };
            return t.createMonth(a)
        }, e.month = e.createDatepicker(e.selectedDate), e.yearSlides = t.getYears(n.startYear, n.endYear), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()), n
    }

    function n(e, t) {
        angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.showDatepicker) ? e.datepickerObject.showDatepicker = t : e.datepicker.showDatepicker = t
    }

    function i(e, t) {
        angular.isDefined(e.datepickerObject) && angular.isDefined(e.datepickerObject.date) && (e.datepickerObject.date = e.selectedDate), t.calendarMode || n(e, !1), angular.isDefined(t.callback) && t.callback(e.selectedDate)
    }
    var r = function(e, r, o) {
        var d = {};
        e.datepicker = {
            showDatepicker: !1,
            showLoader: !1,
            showMonthModal: !1,
            showYearModal: !1,
            showTodayButton: !1,
            calendarMode: !1,
            hideCancelButton: !1,
            hideSetButton: !1
        }, d = a(e), e.datepicker.showDatepicker = d.showDatepicker || d.calendarMode, e.datepicker.calendarMode = d.calendarMode, e.datepicker.hideCancelButton = d.hideCancelButton, e.datepicker.hideSetButton = d.hideSetButton, e.datepicker.showTodayButton = t.showTodayButton(d), e.sameDate = function(e, a) {
            return t.sameDate(e, a)
        }, e.selectDate = function(a, n) {
            n || (e.selectedDate = a, e.month = e.createDatepicker(e.selectedDate), e.currentMonth = angular.copy(a), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()), (d.calendarMode || d.hideSetButton) && i(e, d))
        }, e.selectToday = function() {
            var a = new Date;
            e.selectedDate = a, e.month = e.createDatepicker(e.selectedDate), e.currentMonth = angular.copy(a), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()), (d.calendarMode || d.hideSetButton) && i(e, d)
        }, e.selectMonth = function(t) {
            e.currentMonth = new Date(e.currentMonth.getFullYear(), t, 1), e.month = e.createDatepicker(e.currentMonth), e.closeModals()
        }, e.selectYear = function(a) {
            e.currentMonth = new Date(a, e.currentMonth.getMonth(), 1), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()), e.closeYearModal()
        }, e.nextMonth = function() {
            e.currentMonth = new Date(e.currentMonth.getFullYear(), e.currentMonth.getMonth() + 1, 1), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()), e.month = e.createDatepicker(e.currentMonth)
        }, e.previousMonth = function() {
            e.currentMonth = t.getPreviousMonth(e.currentMonth), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()), e.month = e.createDatepicker(e.currentMonth)
        }, e.swipeLeft = function() {
            d.disableSwipe || e.nextMonth()
        }, e.swipeRight = function() {
            d.disableSwipe || e.previousMonth()
        }, e.closeModals = function() {
            e.datepicker.showMonthModal = !1, e.datepicker.showYearModal = !1
        }, e.openMonthModal = function() {
            e.datepicker.showMonthModal = !0
        }, e.openYearModal = function() {
            e.datepicker.showMonthModal = !1, e.datepicker.showYearModal = !0
        }, e.closeYearModal = function() {
            e.datepicker.showYearModal = !1, e.datepicker.showMonthModal = !0
        }, e.showDatepicker = function() {
            e.datepicker.showDatepicker || n(e, !0)
        }, e.hideDatepicker = function() {
            n(e, !1)
        }, e.setDate = function() {
            i(e, d)
        }, e.$watch("datepickerObject.date", function(a) {
            angular.isNumber(a) && (a = new Date(a)), t.sameDate(a, e.selectedDate) || (e.selectedDate = a, e.month = e.createDatepicker(e.selectedDate), e.currentMonth = angular.copy(a), e.selectedYearSlide = t.getActiveYearSlide(e.yearSlides, e.currentMonth.getFullYear()))
        }), e.$watch("datepickerObject.showDatepicker", function(t) {
            e.datepicker.showDatepicker = t
        }), e.$watch("datepickerObject.showDatepicker", function(t) {
            e.datepicker.showDatepicker = t
        }), e.$watchCollection("datepickerObject.disableDaysOfWeek", function() {
            a(e)
        }), e.$watchCollection("datepickerObject.disableDates", function() {
            a(e)
        }), r.on("click", function(t) {
            var n = t.target;
            angular.isDefined(n) && angular.element(n).hasClass("show-onezone-datepicker") && e.$apply(function() {
                a(e), e.showDatepicker()
            })
        })
    };
    return {
        restrict: "AE",
        replace: !0,
        transclude: !0,
        link: r,
        scope: {
            datepickerObject: "=datepickerObject"
        },
        templateUrl: "onezone-datepicker.html"
    }
}]);