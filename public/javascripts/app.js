
var myApp = angular.module('myApp', ['ui.bootstrap', 'ngFileUpload', 'ngImgCrop', 'ngMaterial', 'ngRoute']);

myApp.config(['$interpolateProvider', function($interpolateProvider) {
   $interpolateProvider.startSymbol('<%');
   $interpolateProvider.endSymbol('%>');
}]);

myApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});




