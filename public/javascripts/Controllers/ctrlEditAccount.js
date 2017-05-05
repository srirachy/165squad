angular.module('myApp').controller('ctrlEditAccount', ['$scope', '$uibModal', '$log', '$http', 'ImageService', 'Upload', '$window', function($scope, $uibModal, $log, $http, ImageService, Upload, $window){

	var maskedPassword = '********';
	$scope.image = {
      originalImage: '',
      croppedImage: ''
    };
    $scope.loading = false;
    $scope.cropping = false;
    $scope.picChanged = false;


	$scope.init = function(value) {
	   $http.get('/api/userInfo')
	    .success(function (result){
	      $scope.user = result;
	      $scope.user.Password = maskedPassword;
	      $scope.user.ConfirmPassword = maskedPassword;
	      $scope.initialized = true;
	    })
	    .error(function (data, status){
	      console.log(data);
	    });
	};

	$scope.save = function(){
		var passwordChanged = false;
		var pictureChanged = false;
		if($scope.user.Password != maskedPassword){
	        passwordChanged = true;
	    }
	    var fd = new FormData();

		if($scope.picChanged){
			var blob = dataURItoBlob($scope.user.ProfilePicture);
	    	fd.append("file", blob);
	        var pictureChanged = true;
	    }
	    
        fd.append("FirstName", $scope.user.FirstName);
        fd.append("LastName", $scope.user.LastName);
        fd.append("Email", $scope.user.Email);
        fd.append("PasswordChanged", passwordChanged);
        fd.append("Password", $scope.user.Password);
        fd.append("PictureChanged", pictureChanged);
        
        $http.post('/api/editAccount/', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
        })
        .success(function (result){
          $window.location.href = '/users/home/'
        })
        .error(function (data, status){
          console.log(data);
        });
        
	};

	function dataURItoBlob(dataURI) {
	    // convert base64/URLEncoded data component to raw binary data held in a string
	    var byteString;
	    if (dataURI.split(',')[0].indexOf('base64') >= 0)
	        byteString = atob(dataURI.split(',')[1]);
	    else
	        byteString = unescape(dataURI.split(',')[1]);

	    // separate out the mime component
	    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    // write the bytes of the string to a typed array
	    var ia = new Uint8Array(byteString.length);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([ia], {type:mimeString});
	}

        // Add pin from Device modal
  $scope.cropPicture = function (files) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/cropPicture',
      controller: function ($scope, $uibModalInstance, $timeout, $http) {   

	    $scope.thumbnail = [];

	    // Read the image using the file reader 
	    $scope.fileReaderSupported = window.FileReader != null;

        $scope.loading = true;
        $scope.thumbnail.dataUrl = '';
        if (files != null) {
          var file = files[0];
          $scope.myFile = file;
           if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
              var fileReader = new FileReader();
              fileReader.readAsDataURL(file); // convert the image to data url. 
              fileReader.onload = function(e) {
                $timeout(function() {
                  $scope.thumbnail.dataUrl = e.target.result; // Retrieve the image. 
                  $scope.loading = false;
                });
              }
            });
          }
        }

          $scope.saveImage = function(){
            $uibModalInstance.close($scope.croppedDataUrl);  
          };
  
      },
      size: 'md',
      resolve: {

      }

    });
    // This gets called after modal closes
    modalInstance.result.then(function (croppedImage) {
      $scope.user.ProfilePicture = croppedImage;
      $scope.picChanged = true;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

}]); 
