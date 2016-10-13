futebolManager.controller('gameDetailsController', ['$scope', '$location', '$routeParams', '$http', '$log', 'uiUploader', '$timeout', gameDetailsController]);

function gameDetailsController($scope, $location, $routeParams, $http, $log, uiUploader, $timeout) 
{
	$scope.obterJogo = function() {
		$http.get('/api/jogos/detalhesJogo?id=' + $scope.gameDetailsId)
			.success(function(data) {
				$scope.jogo = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
		});
	};
	
	
	$scope.gameDetailsId = $routeParams.id;
	
	// when landing on the page, get all jogos and show them
	$scope.obterJogo();
	
	
   
	$scope.btn_remove = function(file) {
		$log.info('deleting=' + file);
		uiUploader.removeFile(file);
	};
	
	$scope.btn_clean = function() {
		uiUploader.removeAll();
	};
	$scope.btn_upload = function() {
		$log.info('uploading...');
		uiUploader.startUpload({
			url: '/api/jogos/detalhesJogo/upload',
			data: {
				'id': $scope.gameDetailsId
			},
			concurrency: 2,
			onProgress: function(file) {
				$log.info(file.name + '=' + file.humanSize);
				$scope.$apply();
			},
			onError: function(error) {
				$log.info("error uploading " + error);
			},
			onCompleted: function(file, response) {
				$log.info(file + 'response' + response);
			},
			onCompletedAll: function(files) {
				$log.info('completed all');
				
				// obter o jogo
				$timeout($scope.obterJogo, 1000);
			}
			
			
			
		});
	};
	
	$scope.files = [];
	
	angular.element(document).ready(function () 
	{
        var element = document.getElementById('file1');
		element.addEventListener('change', function(e) {
			var files = e.target.files;
			uiUploader.addFiles(files);
			$scope.files = uiUploader.getFiles();
			$scope.$apply();
		});
    });
	
	
	
};