var Jogo = require('./models/jogo');
var mongoose = require('mongoose');
const util = require('util')
var fs = require('fs');
var busboy = require('connect-busboy');

module.exports = function(app) {

	function guid() {
	  function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}

	// api ---------------------------------------------------------------------
	
	// get all jogos
	app.get('/api/jogos', function(req, res) {
	
		// use mongoose to get all jogos in the database
		Jogo.find(function(err, jogos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
			{
				console.log("erro: " + err);
				res.send(err)
			}
				

			res.json(jogos); // return all jogos in JSON format
		});
	});

	// create jogo and send back all jogos after creation
	app.post('/api/jogos', function(req, res) {

		// create a jogo, information comes from AJAX request from Angular
		Jogo.create({
			nome : req.body.nome,
			local : req.body.local,
			data: req.body.data,
			done : false
		}, function(err, jogo) {
			if (err)
				res.send(err);

			// get and return all the jogos after you create another
			Jogo.find(function(err, jogos) {
				if (err)
					res.send(err)
				res.json(jogos);
			});
		});

	});

	// delete a jogo
	app.delete('/api/jogos/:jogo_id', function(req, res) {
		Jogo.remove({
			_id : req.params.jogo_id
		}, function(err, jogo) {
			if (err)
				res.send(err);

			// get and return all the jogos after you create another
			Jogo.find(function(err, jogos) {
				if (err)
					res.send(err)
				res.json(jogos);
			});
		});
	});
	
	
	// get a specific game
	app.get('/api/jogos/detalhesJogo', function(req, res) {
		
		var idJogo = req.param('id');;
	
		// use mongoose to get all jogos in the database
		Jogo.findOne({'_id' : idJogo }, function(err, jogo) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
			{
				console.log("erro: " + err);
				res.send(err)
			}

			res.json(jogo); // return all jogos in JSON format
		});
		
	});
	
	
	
	// get a specific game
	app.post('/api/jogos/detalhesJogo/upload', function(req, res) {
		
		var base64data = [];
		var nomeImagem;
		var gameId;
		
		var fstream;
		req.pipe(req.busboy);
		
		// get image in base64
		req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		  console.log('File: ' + filename + ', mimetype: ' + mimetype);
		  nomeImagem = filename;
		  
		  var buffer = '';
		  file.setEncoding('base64');
		  file.on('data', function(data) {
			// `data` is now a base64-encoded chunk of file data
			buffer += data;
		  }).on('end', function() {
			base64data.push(buffer);
		  });
		}).on('finish', function(){
		  //console.log('Data2: ' + base64data);
		});
		
		req.busboy.on('field', function (fieldname, val, valTruncated, keyTruncated) {
			console.log(fieldname);
			console.log(val);
			
			switch(fieldname)
			{
				case 'id':
					gameId = val;
					break;
					
				default:
					break;
				
			}
		});
		
		req.busboy.on('finish',function(){
			console.log('finished');

			var query = {'_id' : gameId };
			
			// use mongoose to get all jogos in the database
			Jogo.findOne(query, function(err, jogo) 
			{
				if (err)
				{
					console.log("erro: " + err);
					res.send(err)
				}
				
				var numImagem = guid();
				
				var imagem = 
				{
					"imagens": [
						{
							'nomeImagem': nomeImagem,
							'imagem': base64data,
							'numeroImagem': numImagem,
						},
					],
				};
				
				Jogo.update(query, { $pushAll : imagem }, function(err, numberAffected, rawResponse) 
				{
					if(err){
						console.log(err);
					}else{
						//handle it
						console.log("game updated");
					}
				});
			});
		});
	});
	
	
	
	// delete image from a game
	app.post('/api/jogos/detalhesJogo/apagarImagem', function(req, res) {

		var idJogo = req.body.id;
		var numeroImagem = req.body.numeroImagem;
		
		console.log("idJogo = " + idJogo);
		console.log("numeroImagem = " + numeroImagem);
	
		var query = {'_id' : idJogo };
	
		Jogo.update( query, 
					{ $pull: { 'imagens': { 'numeroImagem': numeroImagem } } },
					{ safe: true }, 
					function removeConnectionsCB(err, obj) {
						
						if(err){
							console.log(err);
						}else{
							//handle it
							console.log("game updated");
							res.json(obj);
						}
					});
	});
	

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};