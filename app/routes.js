//var Todo = require('./models/todo');
var Jogo = require('./models/jogo');

var mongoose = require('mongoose');

module.exports = function(app) {

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

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};