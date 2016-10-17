futebolManager.controller('gameDetailsController', 
						  ['$scope', '$location', '$routeParams', '$http', '$log', 'uiUploader', '$timeout', 'chatSocket', 'messageFormatter', 'nickName',
						  gameDetailsController]);

function gameDetailsController($scope, $location, $routeParams, $http, $log, uiUploader, $timeout, chatSocket, messageFormatter, nickName) 
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
	
	// -------------------------------------------------
	// UPLOAD 
   
	$scope.btn_remove = function(file) {
		$log.info('deleting=' + file);
		uiUploader.removeFile(file);
	};
	
	$scope.btn_clean = function() 
	{
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
				//$timeout($scope.obterJogo, 1000);
				$scope.obterJogo();
			}
			
			
			
		});
	};
	
	// -------------------------------------------------
	
	$scope.deleteImage = function(imageId) {
		$log.info('deleting image...');
		
		var data = 
		{
			'id' : $scope.gameDetailsId,
			'numeroImagem': imageId,
		};
		

		$http.post('/api/jogos/detalhesJogo/apagarImagem', data).success(function(data) {
			$scope.obterJogo();		
		})
		.error(function(data) {
			console.log('Error: ' + data);
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
	
	
	
	// -------------------------------------------------
	// CHAT
	
	$scope.nickName = nickName;
	$scope.messageLog = 'Ready to chat!';
	$scope.sendMessage = function() {
		var match = $scope.message.match('^\/nick (.*)');

		if (angular.isDefined(match) && angular.isArray(match) && match.length === 2) {
		  var oldNick = nickName;
		  nickName = match[1];
		  $scope.message = '';
		  $scope.messageLog = messageFormatter(new Date(), 
						  nickName, 'nickname changed - from ' + 
							oldNick + ' to ' + nickName + '!') + $scope.messageLog;
		  $scope.nickName = nickName;
		}

		$log.debug('sending message', $scope.message);
		chatSocket.emit('message', nickName, $scope.message);
		$scope.message = '';
	};

	$scope.$on('socket:broadcast', function(event, data) {
		$log.debug('got a message', event.name);
		if (!data.payload) {
		  $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
		  return;
		} 
		$scope.$apply(function() {
		  $scope.messageLog = $scope.messageLog + messageFormatter(new Date(), data.source, data.payload);
		});
	});
	
	// -------------------------------------------------
	
	
};