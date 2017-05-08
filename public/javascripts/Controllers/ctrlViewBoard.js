angular.module('myApp').controller('ctrlViewBoard', ['$scope', '$uibModal', '$log', '$http', '$window', function($scope, $uibModal, $log, $http, $window){

	$scope.init = function(boardKey) {

	    $http.post('/api/boardPins', {BoardKey:boardKey})
	    .success(function (result){
	      $scope.pins = result;
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

      // $scope.editable = false;

      // var promises = [new Promise(function(resolve, reject){
      //     $http.post('/api/boardPins', {BoardKey:boardKey})
      //     .success(function (result){
      //       $scope.pins = result;
      //       resolve(result);
      //     })
      //     .error(function (data, status){
      //       console.log(data);
      //       reject(data);
      //     });
      // })
      // ,new Promise(function(resolve, reject){

      //     $http.get('/api/userInfo')
      //     .success(function (result){
      //       $scope.user = result;
      //       resolve(result);
      //     })
      //     .error(function (data, status){
      //       console.log(data);
      //       reject(data);
      //     });
      // })
      // ];

      // Promise.all(promises).then(function(results){
      //    if($scope.pins.length > 0){
      //       if($scope.pins[0].UserKey == $scope.user.UserKey){
      //         $scope.editable = true;
      //       }
      //    }
      // });

	};



	$scope.test = function(pin){

		console.log(pin);
	};


  // Add new pin modal
  $scope.addPin = function (size) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/addPin',
      controller: function ($scope, $uibModalInstance) {     
          $scope.addMethod = '';

          $scope.addFromWeb = function () {
            $scope.addMethod = 'fromWeb';
            $uibModalInstance.close($scope.addMethod);  
          };

          $scope.addFromDevice = function () {
            $scope.addMethod = 'fromDevice';
            $uibModalInstance.close($scope.addMethod);  
          };    
      },
      size: size,
      resolve: {

      }

    });
    // This gets called after modal closes
    modalInstance.result.then(function (addMethod) {
      if(addMethod == 'fromWeb'){

      }else if(addMethod == 'fromDevice'){
        addFromDevice('md');
      }else{ 

      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

    // Add pin from Device modal
  var addFromDevice = function (size) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/addFromDevice',
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
          $scope.photoChosen = function(files){
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
          };

          $scope.savePin = function(board){
            var fd = new FormData();
            fd.append("file", $scope.myFile);
            fd.append("boardKey", board.BoardKey);
            fd.append("tags", $scope.tags);
            
            $http.post('/api/uploadPin/', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined},
            })
            .success(function (result){
              $window.location.reload();
            })
            .error(function (data, status){
              console.log(data);
            });

            $uibModalInstance.close();  
          };
  
      },
      size: size,
      resolve: {

      }

    });
    // This gets called after modal closes
    modalInstance.result.then(function () {
      
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

    // Add pin from Web
  var addFromWeb = function (size) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/addFromWeb',
      controller: function ($scope, $uibModalInstance) {     

          $scope.chooseImage = function () {
            $uibModalInstance.close();  
          };
  
      },
      size: size,
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



    // Open modal to view pin
  $scope.viewPin = function (pin) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/viewPin',
      controller: function ($scope, $uibModalInstance) { 
          $scope.pinURL = pin.URL;


          $scope.close = function () {
            $uibModalInstance.close('close');  
          };

          $scope.edit = function(){
            $uibModalInstance.close(pin);
          };
      },
      size: 'md',
      resolve: {

      }

    });
    // This gets called after modal closes
    modalInstance.result.then(function (item) {
      if(item != 'close'){
        editPin(item);
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

    // Edit pin 
  var editPin = function (pin) {
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/editPin',
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
          $scope.deletable = true;

          // Read the image using the file reader 
          $scope.fileReaderSupported = window.FileReader != null;

          $scope.pin = pin;

          $scope.savePin = function(board){
            if(pin.BoardKey == board.BoardKey){

            }else{
              $http.post('/api/addExistingPin', {BoardKey: board.BoardKey, PinKey: pin.PinKey, tags: $scope.tags})
                .success(function (result){
                  $scope.boards = result;
                })
                .error(function (data, status){
                  console.log(data);
                });
            }


              $uibModalInstance.close();  
          };

          $scope.delete = function(){

              $http.post('/api/deleteBoardPin', {BoardPinKey: $scope.pin.BoardPinKey})
                .success(function (result){
                  $scope.pins = result;
                })
                .error(function (data, status){
                  console.log(data);
                });
     


              $uibModalInstance.close();  
          };
          $scope.saveEdit = function(){

             
              $http.post('/api/updateBoardPin', {BoardPinKey: $scope.pin.BoardPinKey, Tags: $scope.pin.Tags})
                .success(function (result){
                  $scope.pins = result;
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