angular.module('starter', [
    'ionic',
    'starter.controllers',
    'signin.controllers',
    'checkout.controllers',

    'teacher.controllers',
    'signin.teacher.controllers',

    'auth.services',
    'map.services',
    'order.services',
    'photo.services',

    'ngCordova',
    'tabSlideBox',
    'onezone-datepicker',
    'ionic.rating',
    'ngMask',
    'ion-place-tools',
    'ionicCustomRange',
    'chart.js',
    'ionic-toast',
    'ngCookies',
    'ionic-timepicker',
    'ui.mask'
])

.run(function($ionicPlatform, AuthService, $cookies, ionicToast) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        //AuthService.AutoLogin();

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            //alert(1);
            var push = PushNotification.init({
                "android": {
                    "senderID": "852911291177",
                    'icon': 'res://iconpush.png',
                    'color': '#53c5cf'
                },
                "ios": { "alert": "true", "badge": "true", "sound": "true" },
                "windows": {}
            });
            push.on('registration', function(data) {
                var cookieExp = new Date();
                cookieExp.setDate(cookieExp.getDate() + 30);
                $cookies.putObject('registrationIdZim', data.registrationId, { expires: cookieExp });
                //alert('App ' + $cookies.getObject('registrationIdZim'));
            });


            /*push.on('notification', function(data) {
                ionicToast.show(data.message, 'bottom', false, 10000);
                //alert(JSON.stringify(data));
            });
            push.on('error', function(e) {
                //alert('registration error: ' + e.message);
            });*/


            //cordova.plugins.autoStart.enable();
            /*
                        window.FirebasePlugin.getToken(function(token) {
                            // save this server-side and use it to push notifications to this device
                            //console.log(token);
                            //alert('FirebasePlugin ' + token);
                        }, function(error) {
                            //console.error(error);
                            //alert('FirebaseError ' + error);
                        });
                        window.FirebasePlugin.onTokenRefresh(function(token) {
                            // save this server-side and use it to push notifications to this device
                            //console.log(token);
                            //alert('onTokenRefresh ' + token);
                        }, function(error) {
                            //alert('onTokenRefresh ' + error);
                        });
                        window.FirebasePlugin.onNotificationOpen(function(notification) {
                            //console.log(notification);
                            //alert('onNotificationOpen ' + token);
                        }, function(error) {
                            //console.error(error);
                            //alert('onNotificationOpen ' + token);
                        });*/

            //cordova.plugins.backgroundMode.enable();


            /*
                        cordova.plugins.backgroundMode.setDefaults({
                            'title': 'Zim',
                            'text': 'Aguardando notificações. :)',
                            'icon': 'icon.png', // this will look for icon.png in platforms/android/res/drawable|mipmap
                            'color': '000000' // hex format like 'F14F4D'
                        });
                        cordova.plugins.backgroundMode.enable();
                        */


        }


    });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
            /*,
            onEnter: function($state, AuthService) {
                if (!AuthService.IsLogged()) {
                    $state.go('app.signin');
                }
            }*/
    })


    .state('app.signin', {
        url: '/signin',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin.html',
                controller: 'SignInCtrl'
            }
        }
    })

    .state('app.confirmphone', {
        url: '/confirmphone/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-confirmphone.html',
                controller: 'SignInCtrl'
            }
        }
    })

    .state('app.signinlevel', {
        url: '/signinlevel',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-level.html',
                controller: 'SignInLevelCtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/user-profile.html',
                controller: 'UserProfileCtrl'
            }
        }
    })



    .state('app.subjects', {
        url: '/subjects',
        views: {
            'menuContent': {
                templateUrl: 'templates/subjects.html',
                controller: 'SubjectsCtrl'
            }
        }
    })

    .state('app.map', {
            url: '/map',
            views: {
                'menuContent': {
                    templateUrl: 'templates/map.html',
                    controller: 'MapCtrl'
                }
            }


        })
        .state('app.teachers', {
            url: '/teachers',
            views: {
                'menuContent': {
                    templateUrl: 'templates/teachers.html',
                    controller: 'TeachersCtrl'
                }
            }
        })
        .state('app.teacherprofile', {
            url: '/teacherprofile/:teacherId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/teacher-profile.html',
                    controller: 'TeacherProfileCtrl'
                }
            }


        })

    .state('app.messages', {
            url: '/messages',
            views: {
                'menuContent': {
                    templateUrl: 'templates/messages.html',
                    controller: 'MessagesCtrl'
                }
            }
        })
        .state('app.chat', {
            url: '/messages/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/messages.chat.html',
                    controller: 'ChatCtrl'
                }
            }
        })

    .state('app.classes', {
        url: '/classes',
        views: {
            'menuContent': {
                templateUrl: 'templates/classes.html',
                controller: 'ClassesCtrl'
            }
        }
    })

    .state('app.class', {
        url: '/classes/:classId',
        views: {
            'menuContent': {
                templateUrl: 'templates/class.html',
                controller: 'ClassCtrl'
            }
        }
    })

    .state('app.checkout', {
        url: '/checkout',
        views: {
            'menuContent': {
                templateUrl: 'templates/checkout.html',
                controller: 'CheckoutCtrl'
            }
        }
    })

    .state('app.help', {
        url: '/help',
        views: {
            'menuContent': {
                templateUrl: 'templates/help.html',
                controller: 'HelpCtrl'
            }
        }
    })

    .state('app.terms', {
        url: '/terms',
        views: {
            'menuContent': {
                templateUrl: 'templates/terms.html',
                controller: 'TermsCtrl'
            }
        }
    })

    .state('app.indicate', {
        url: '/indicate',
        views: {
            'menuContent': {
                templateUrl: 'templates/indicate.html',
                controller: 'IndicateCtrl'
            }
        }
    })

    .state('app.logout', {
        url: '/logout',
        views: {
            'menuContent': {
                controller: 'LogoutCtrl'
            }
        }
    })

    /******* teacher */
    .state('app.signinteacherdocs', {
        url: '/signinteacherdocs',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-teacher-personal-data.html',
                controller: 'SignInTeacherDocsCtrl'
            }
        }
    })

    .state('app.signinteacheraddress', {
        url: '/signinteacher/address',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-teacher-address.html',
                controller: 'SignInTeacherAddressCtrl'
            }
        }
    })

    .state('app.signinteacheravailability', {
        url: '/signinteacher/availability',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-teacher-availability.html',
                controller: 'SignInTeacherAvailabilityCtrl'
            }
        }
    })

    .state('app.signinteachersubjects', {
        url: '/signinteacher/subjects',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-teacher-subjects.html',
                controller: 'SignInTeacherSubjectsCtrl'
            }
        }
    })

    .state('app.signinteacherdescription', {
        url: '/signinteacher/description',
        views: {
            'menuContent': {
                templateUrl: 'templates/signin-teacher-description.html',
                controller: 'SignInTeacherDescriptionCtrl'
            }
        }
    })


    .state('app.hometeacher', {
            url: '/hometeacher',
            views: {
                'menuContent': {
                    templateUrl: 'templates/hometeacher.html',
                    controller: 'HomeTeacherCtrl'
                }
            }
        })
        /****
            .state('app.teacherclass', {
                url: '/teacherclass/:classId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/class-teacher.html',
                        controller: 'ClassTeacherCtrl'
                    }
                }
            })
        **/
        .state('app.gain', {
            url: '/gain',
            views: {
                'menuContent': {
                    templateUrl: 'templates/gain.html',
                    controller: 'GainCtrl'
                }
            }
        })



    .state('app.verify', {
        url: '/verify',
        views: {
            'menuContent': {
                controller: 'VerifyCtrl'
            }
        }

    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/verify');


    $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.form.checkbox("circle");

    $ionicConfigProvider.views.maxCache(0);
});


//var url = "http://192.168.1.10/Zim/app-data/";
var url = "http://www.zimapp.com/app-data/";

var MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
var DAYSOFWEEK = ["D", "S", "T", "Q", "Q", "S", "S"];

var placeSearch, autocomplete;

var errorCallBack = function(res) {
    console.log(res);
}

var formatMoney = function(n) {
    n = n + "";
    return n.replace(/(\d)(?=(\d{3})+\.)/g, "$1.") + ",00";
}

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] == value) {
            return i;
        }
    }
    return -1;
}