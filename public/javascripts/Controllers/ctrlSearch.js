angular.module('myApp').controller('ctrlSearch', ['$scope', '$uibModal', '$log', '$http', '$window', function($scope, $uibModal, $log, $http, $window){

	$scope.init = function() {

    $scope.searchValue = '';


	};


	$scope.search = function(){

    $window.location.href = '/users/search/' + $scope.searchValue;

	};



}]); 
