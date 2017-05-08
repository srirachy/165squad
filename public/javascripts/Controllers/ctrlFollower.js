angular.module('myApp').controller('ctrlFollower', ['$scope', '$uibModal', '$log', '$http', function($scope, $uibModal, $log, $http){

	$scope.init = function(userKey) {

	    // $http.get('/api/userInfo')
	    // .success(function (result){
	    //   $scope.user = result;
	    // })
	    // .error(function (data, status){
	    //   console.log(data);
	    // });

      $http.get('/api/getFollowers/' + userKey)
      .success(function (result){
        $scope.followers = result;
      })
      .error(function (data, status){
        console.log(data);
      });

	};



	$scope.test = function(pin){

		console.log(pin);
	};


}]); 