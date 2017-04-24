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

	};

}]); 
