
angular.module('myApp').controller('ctrlBoards', ['$scope', '$uibModal', '$log', '$http', function($scope, $uibModal, $log, $http){
   $http.get('/api/boards')
    .success(function (result){
      $scope.boards = result;
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

}]); 