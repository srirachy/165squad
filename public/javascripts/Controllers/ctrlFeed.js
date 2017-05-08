angular.module('myApp').controller('ctrlFeed', ['$scope', '$uibModal', '$log', '$http', '$window', function($scope, $uibModal, $log, $http, $window){

	$scope.init = function(value) {
	   $http.get('/api/feed')
	    .success(function (result){
	      $scope.pins = result;
	      $scope.initialized = true;
	    })
	    .error(function (data, status){
	      console.log(data);
	    });


	    $http.get('/api/userInfo')
	    .success(function (result){
	      $scope.user = result;
	    })
	    .error(function (data, status){
	      console.log(data);
	    });

	};


	$scope.follow = function(userKey, index){

		console.log(userKey);
		console.log(index);

        $http.post('/api/follow', {UserKey:userKey})
          .success(function (result){
            $scope.pins[index].Following = 'Y';
			for(var i = 0; i < $scope.pins.length; i++){
				if($scope.pins[i].UserKey == userKey){
					$scope.pins[i].Following = 'Y';	
				}
			}
          })
          .error(function (data, status){
            console.log(data);
          });

	};


	$scope.unfollow = function(userKey, index){

        $http.post('/api/unfollow', {UserKey:userKey})
          .success(function (result){
            $scope.pins[index].Following = 'N';
			for(var i = 0; i < $scope.pins.length; i++){
				if($scope.pins[i].UserKey == userKey){
					$scope.pins[i].Following = 'N';	
				}
			}
          })
          .error(function (data, status){
            console.log(data);
          });

	};

	$scope.test = function(pin){

		console.log(pin);
	};

  $scope.redirect = function(url){
    $window.location.href = url;
  };


    // Add pin from Device modal
  $scope.pinIt = function (pin) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/addPinFromExisting',
      controller: function ($scope, $uibModalInstance, $timeout, $http) {   
          $http.get('/api/boards')
          .success(function (result){
            $scope.boards = result;
          })
          .error(function (data, status){
            console.log(data);
          });

          $scope.thumbnail = [];
          $scope.tags = '';

          // Read the image using the file reader 
          $scope.fileReaderSupported = window.FileReader != null;

          $scope.pin = pin;

          $scope.savePin = function(board){
	            
	        $http.post('/api/addExistingPin', {BoardKey: board.BoardKey, PinKey: pin.PinKey, tags: $scope.tags})
	          .success(function (result){
	            $scope.boards = result;
	          })
	          .error(function (data, status){
	            console.log(data);
	          });

            $uibModalInstance.close();  
          };
  
      },
      size: 'md',
      resolve: {

      }

    });
    // This gets called after modal closes
    modalInstance.result.then(function () {
      // code to select image
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


}]); 
