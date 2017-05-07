angular.module('myApp').controller('ctrlFollowing', ['$scope', '$uibModal', '$log', '$http', function($scope, $uibModal, $log, $http){

	$scope.init = function(boardKey) {

	    $http.get('/api/userInfo')
	    .success(function (result){
	      $scope.user = result;
	    })
	    .error(function (data, status){
	      console.log(data);
	    });

      $http.get('/api/getFollowings')
      .success(function (result){
        $scope.followings = result;
      })
      .error(function (data, status){
        console.log(data);
      });

	};



	$scope.test = function(pin){

		console.log(pin);
	};

	$scope.unfollow = function(userKey, index){
		
		$scope.followings.splice(index,1);

        $http.post('/api/unfollow', {UserKey:userKey})
          .success(function (result){

          })
          .error(function (data, status){
            console.log(data);
          });

	};


}]); 