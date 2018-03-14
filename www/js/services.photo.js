angular.module('photo.services', [])

.factory('PhotoService', function($cordovaCamera, $ionicActionSheet) {
    var service = {};
    service.getPhoto = getPhoto;
    //service.takePhoto = takePhoto;
    //service.choosePhoto = choosePhoto;


    return service;

    function getPhoto(id) {
        var photo = $ionicActionSheet.show({
            buttons: [
                { text: '<i class="icon ion-camera"></i> Câmera' },
                { text: '<i class="icon ion-filing"></i> Arquivo' }
            ],
            //cssClass: 'action-sheet',
            //cancelText: '<i class="icon ion-close"></i> Cancelar',
            /*cancel: function() {
                // add cancel code..
            },*/
            buttonClicked: function(index) {
                switch (index) {
                    case 0:
                        takePhoto(id);
                        break;
                    case 1:
                        choosePhoto(id);
                        break;
                }
                console.log(index);
                return true;
            }
        });
    }

    function takePhoto(id) {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 150,
            targetHeight: 150,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            //$scope.imgURI = "data:image/jpeg;base64," + imageData;
            //console.log(id);
            var image = document.getElementById(id);
            image.src = "data:image/jpeg;base64," + imageData;
            console.log('ok');
            //variavel = 

        }, function(err) {
            console.log('erro');
            console.log(err);
        });
    }

    function choosePhoto(id) {
        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 150,
            targetHeight: 150,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            //$scope.imgURI = "data:image/jpeg;base64," + imageData;
            var image = document.getElementById(id);
            image.src = "data:image/jpeg;base64," + imageData;

        }, function(err) {
            console.log('erro');
            console.log(err);
        });
    }


});