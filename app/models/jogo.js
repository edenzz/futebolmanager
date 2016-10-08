var mongoose = require('mongoose');

module.exports = 
	
	mongoose.model(
		'Jogo', 
		{
			nome : String,
			local : String,
			data: String
		}, 
		"Jogos");
