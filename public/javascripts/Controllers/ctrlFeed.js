angular.module('myApp').controller('ctrlFeed', ['$scope', '$uibModal', '$log', '$http', function($scope, $uibModal, $log, $http){

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

}]); 
