
angular.module('myApp').controller('ctrlHome', ['$scope', '$uibModal', '$log', '$http', '$window', function($scope, $uibModal, $log, $http, $window){
   $http.get('/api/boards')
    .success(function (result){
      $scope.boards = result;
    })
    .error(function (data, status){
      console.log(data);
    });


    $http.get('/api/userPins')
    .success(function (result){
      $scope.pins = result;
    })
    .error(function (data, status){
      console.log(data);
    });

  // Open a modal window to update/create/delete a board
  $scope.openBoardFormModal = function (size, selectedItem, index) {
    $scope.index = index;
    var modalInstance = $uibModal.open({
      templateUrl: '/forms/board',
      controller: function ($scope, $uibModalInstance, board) {
          $http.get('/api/categories')
          .success(function (result){
            $scope.categories = result;
          })
          .error(function (data, status){
            console.log(data);
          });

          $scope.board = board;
          $scope.index = index;
          $scope.editableBoard = angular.copy($scope.board);
          if(index == -1){  // if creating new
            $scope.editableBoard.Private = 0;
          }          

          // Save & Close Button on Modal Form
          $scope.save = function () {
              var method = 'create';
              // if editing board update view right away
              if($scope.editableBoard.BoardKey !== 0){
                $scope.board.Name = $scope.editableBoard.Name;
                $scope.board.Description = $scope.editableBoard.Description;
                $scope.board.Category = $scope.editableBoard.Category;
                $scope.board.Private = $scope.editableBoard.Private;
                method = 'update';
              }
              $scope.editableBoard.method = method;
              $uibModalInstance.close($scope.editableBoard);  
          };

          $scope.cancel = function () {
            $scope.board = angular.copy($scope.editableBoard);
            $uibModalInstance.dismiss('cancel');
          };

          $scope.delete = function(board){
            $uibModalInstance.close({BoardKey: board.BoardKey, method: 'delete'});
          };          
      },
      size: size,
      resolve: {
        board: function () {
          return selectedItem;
        }
      }

    });
    // This gets called after modal closes
    modalInstance.result.then(function (boardForm) {
      if(boardForm.method == 'create'){
         $scope.boards.push(boardForm); // this is used to update view right away without waiting for db query to complete
         $http.post('/api/boards', boardForm)
          .success(function (result){
            $scope.boards = result;
          })
          .error(function (data, status){
            console.log(data);
          });
      }else if(boardForm.method == 'delete'){
        $scope.boards.splice($scope.index,1); // this is used to updat view right away
        $http.post('/api/boards/delete/', {BoardKey:boardForm.BoardKey})
          .success(function (result){
            $scope.boards = result;
          })
          .error(function (data, status){
            console.log(data);
          });
      }else{ // update existing record
        $http.put('/api/boards', boardForm)
          .success(function (result){
            $scope.boards = result;
          })
          .error(function (data, status){
            console.log(data);
          });
      }
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
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
      // code to select image
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


}]); 