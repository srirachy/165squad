angular.module('myApp').controller('ctrlEditAccount', ['$scope', '$uibModal', '$log', '$http', function($scope, $uibModal, $log, $http){

	var maskedPassword = '*****';
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

	};

	$scope.changePicture = function(){
		console.log('change picture');
	};


}]); 
