window.placeTools = angular.module('ion-place-tools', []);
placeTools.directive('ionGooglePlace', [
    '$ionicTemplateLoader',
    '$ionicPlatform',
    '$q',
    '$timeout',
    '$rootScope',
    '$document',
    function($ionicTemplateLoader, $ionicPlatform, $q, $timeout, $rootScope, $document) {
        return {
            require: '?ngModel',
            restrict: 'E',
            templateUrl: 'src/ionGooglePlaceTemplate.html',
            replace: true,
            scope: {
                searchQuery: '=ngModel',
                locationChanged: '&',
                //radius: '='
            },
            link: function(scope, element, attrs, ngModel) {


                scope.dropDownActive = false;
                var service = new google.maps.places.AutocompleteService();
                var searchEventTimeout = undefined;
                var latLng = null;
                var geocoder = new google.maps.Geocoder;

                /*
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            var circle = new google.maps.Circle({
                                center: geolocation,
                                radius: position.coords.accuracy
                            });
                            //service.setBounds(circle.getBounds());
                        });
                    }
                */

                var searchInputElement = angular.element(element.find('input'));

                scope.selectLocation = function(location) {
                    console.log(location);

                    scope.dropDownActive = false;
                    geocoder.geocode({
                            'placeId': location.place_id
                        },
                        function(responses, status) {
                            if (status == 'OK') {
                                location.lat = responses[0].geometry.location.lat();
                                location.lng = responses[0].geometry.location.lng();
                                //console.log(location);
                            }
                            scope.dropDownActive = false;
                            scope.searchQuery = location.description;
                            if (scope.locationChanged) {
                                //scope.locationChanged()(location.description);
                                scope.locationChanged()(location);
                                scope.searchQuery = "";
                            }
                        });
                };

                if (!scope.radius) {
                    scope.radius = 15000;
                    //scope.radius = 1500;
                }

                scope.locations = []

                scope.$watch('searchQuery', function(query) {
                    if (!query) {
                        query = '';
                    }
                    scope.dropDownActive = (query.length >= 1 && scope.locations.length);
                    if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                    searchEventTimeout = $timeout(function() {
                        if (!query) return;
                        if (query.length < 3) {
                            scope.locations = [];
                            return;
                        };

                        var req = {};
                        req.input = query;

                        //console.log(req);

                        if (latLng) {
                            req.location = latLng;
                            req.radius = scope.radius;
                        }
                        req.types = ['geocode'];
                        req.componentRestrictions = { country: 'br' };

                        //service.getQueryPredictions(req, function(predictions, status) {
                        service.getPlacePredictions(req, function(predictions, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                //console.log(predictions);
                                scope.locations = predictions;
                                scope.$apply();
                                /*
                                                                geocoder.geocode({
                                                                        'placeId': predictions[0].place_id
                                                                    },
                                                                    function(responses, status) {
                                                                        if (status == 'OK') {
                                                                            var lat = responses[0].geometry.location.lat();
                                                                            var lng = responses[0].geometry.location.lng();
                                                                            //console.log(lat, lng);
                                                                        }
                                                                    });*/
                            }
                        });
                    }, 350); // we're throttling the input by 350ms to be nice to google's API
                });

                var onClick = function(e) {

                    e.preventDefault();
                    e.stopPropagation();
                    scope.dropDownActive = true;
                    scope.$digest();
                    searchInputElement[0].focus();
                    setTimeout(function() {
                        searchInputElement[0].focus();
                    }, 0);
                };

                var onCancel = function(e) {
                    setTimeout(function() {
                        scope.dropDownActive = false;
                        scope.$digest();
                        scope.searchQuery = "";
                    }, 0);
                };

                element.find('input').bind('click', onClick);
                element.find('input').bind('blur', onCancel);
                element.find('input').bind('touchend', onClick);

                if (attrs.placeholder) {
                    element.find('input').attr('placeholder', attrs.placeholder);
                }
            }
        };
    }
]);

// Add flexibility to template directive
var template = '<div class="item ion-place-tools-autocomplete">' +
    '<input type="text" autocomplete="off" ng-model="searchQuery" style="border: none; padding-top: 10px;">' +
    '<div class="ion-place-tools-autocomplete-dropdown" ng-if="dropDownActive">' +
    '<ion-list>' +
    '<ion-item ng-repeat="location in locations" ng-click="selectLocation(location)">' +
    '{{location.description}}' +
    '</ion-item>' +
    '</ion-list>' +
    '</div>' +
    '</div>';
placeTools.run(["$templateCache", function($templateCache) { $templateCache.put("src/ionGooglePlaceTemplate.html", template); }]);