var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error) { next(error);});
};

// GET /quizes?search=
exports.index = function(req, res) {
	//objetobusqueda es el objeto que le pasamos a .findAll para la busqueda y ordenación
	var objetobusqueda = {order: "pregunta ASC"};
	if(req.query.search){
		//si existe criterio de busqueda se sustituyen los espacios por % y se busca por el criterio
		objetobusqueda = {where: ["upper(pregunta) like ?", 
						 "%"+req.query.search.toUpperCase().trim().replace(/\s+/g,"%")+"%"], 
						  order: "pregunta ASC"};
	}
	//pasamos a .findAll e objeto objetobusqueda resultante
	models.Quiz.findAll(objetobusqueda).then(
		function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(  // crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	// guarda en DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	})	// Redirección HTTP (URL relativo) lista de preguntas
};