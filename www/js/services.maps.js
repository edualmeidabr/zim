angular.module('map.services', [])

.factory('MapService', function($cordovaGeolocation, $rootScope, $timeout) {
    var service = {};
    service.AutoComplete = AutoComplete;
    service.ResetAddress = ResetAddress;
    service.ResetNeighborhood = ResetNeighborhood;
    service.GenerateMap = GenerateMap;
    service.ObjToAddress = ObjToAddress;
    //service.LatLngToAddress = LatLngToAddress;
    service.GetLatLng = GetLatLng;

    //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var origin = new google.maps.Point(0, 0);
    var anchor = new google.maps.Point(24, 48);
    var size = new google.maps.Size(64, 64);
    var scaledSize = new google.maps.Size(48, 48);

    var imgMarker = {
        url: 'img/marker.png',
        //origin: origin,
        size: size,
        scaledSize: scaledSize,
        anchor: anchor
    };

    var latLng, marker, map, mapOptions, myLocation, lat = "",
        lng = "";

    function GenerateMap() {
        ionic.Platform.ready(function() {
            latLng = new google.maps.LatLng(-18.5004, -44.0441);
            mapOptions = {
                center: latLng,
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                draggable: false,
                disableDefaultUI: true,
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }]
            };

            map = new google.maps.Map(document.getElementById("map"), mapOptions);


            /*
                        $cordovaGeolocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy: false }).then(function(pos) {
                            $rootScope.errorMap = false;

                            myLocation = google.maps.event.addListenerOnce(map, 'idle', function() {
                                lat = pos.coords.latitude;
                                lng = pos.coords.longitude;
                                latLng = new google.maps.LatLng(lat, lng);
                                //map.setCenter(latLng);                    
                                map.setOptions({ center: latLng, zoom: 15 });

                                marker = new google.maps.Marker({
                                    map: map,
                                    animation: google.maps.Animation.DROP,
                                    position: latLng,
                                    draggable: false,
                                    icon: imgMarker
                                });
                            });
                        }, function(err) {
                            //alert(err);
                            //console.log(JSON.stringify(err));
                            //console.log(err);
                            $rootScope.errorMap = true;
                            //$timeout(GenerateMap, 10000);
                            //lat = "-22.946096";
                            //lng = "-43.054909";
                        });

            */
        });


    }

    function GenerateMarker(map) {
        marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable: false,
            icon: imgMarker
        });
    }

    function AutoComplete(id) {
        if (id = '')
            id = 'pac-input';


        autocomplete = new google.maps.places.Autocomplete(document.getElementById(id), { types: ['geocode'] });
        autocomplete.addListener('place_changed', function() {
            //console.log('place_changed');
            //var place = autocomplete.getPlace();

            $scope.goTeacher();

            if (!place.geometry) {
                return;
            }
        });
    }



    function ResetAddress() {
        var address = {};
        address.id = "";
        address.name = "";
        address.street = "";
        address.number = "";
        address.comp = "";
        address.lat = "";
        address.lng = "";

        address.cep = "";
        address.neigh = "";
        address.city = "";
        address.uf = "";

        return address;
    }


    function ResetNeighborhood() {
        var neighborhood = {};
        neighborhood.id = "";
        neighborhood.name = "";
        neighborhood.lat = "";
        neighborhood.lng = "";

        return neighborhood;
    }

    function ObjToAddress(obj) {
        //console.log(obj);
        var address = ResetAddress();
        address.street = obj.structured_formatting.main_text;
        address.lat = obj.lat;
        address.lng = obj.lng;

        return address;
    }


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }


    /*
        function LatLngToAddress() {
            console.log(parseFloat(lng));
            console.log(parseFloat(lat));
            var geocoder = new google.maps.Geocoder;
            geocoder.geocode({ 'location': { lat: parseFloat(lat), lng: parseFloat(lng) } }, function(results, status) {
                if (status === 'OK') {
                    console.log(results);
                    if (results[0] && results[0].types[0] == 'street_address') {
                        if (confirm("Marcar aula no endereço " + results[0].formatted_address + "?")) {
                            var r = ResetAddress();
                            r.lat = lat;
                            r.lng = lng;
                            r.street = results[1].formatted_address;
                            r.name = "Meu Endereço";

                            console.log(r);

                            return r;
                        }
                    } else {
                        return ResetAddress();
                    }
                } else {
                    return ResetAddress();
                }
            });
        }
    */

    function GetLatLng() {

        if (lat != "" && lng != "")
            return { lat: lat, lng: lng };

        return null;
    }



    return service;

});