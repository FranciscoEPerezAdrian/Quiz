var models = require('../models/models.js');

exports.show = function(req, res) {
	var stats = {  //se crea un objeto para almacenar estadisticas
		nquizes: 0,
		ncomments: 0,
		nquizeswithcomments: 0
	};

	//se extraen de la BDD todas las preguntas con sus comentarios asociados
	models.Quiz.findAll({ include: [{ model: models.Comment}] }).then(function(quizes){
		stats.nquizes = quizes.length;  //se almacena el nº de elementos del array de preguntas
		for(i in quizes){  //se recorre el array de preguntas
			if(quizes[i].Comments.length != 0){
				stats.nquizeswithcomments++;  //si la pregunta tiene comentarios incrementa el nº de preg. con comentarios
				stats.ncomments += quizes[i].Comments.length;  //summa los comentarios de la pregunta al total de comentarios
			}
		}
	}).then(function(){  //si todo va bien, carga la página de estadisticas pasandole los datos obtenidos
		res.render('quizes/stats', {stats: stats, errors: []})
		});
};