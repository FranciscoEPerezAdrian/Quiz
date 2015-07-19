var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).
	then(
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
	//objetoBusqueda es el objeto que le pasamos a .findAll para la busqueda y ordenación
	var objetoBusqueda = {order: "tema ASC, pregunta ASC"};
	objetoBusqueda.where = {};
	
	//si existe criterio de busqueda se sustituyen los espacios por % y se busca por el criterio
	if(req.query.search){
		objetoBusqueda.where.pregunta = {$like: "%"+req.query.search.trim().replace(/\s+/g,"%")+"%",};
	}
	//si se indica en la búsqueda algún tema distinto de "TODOS", se incluye en la búsqueda
	if(req.query.temasearch && req.query.temasearch !== "todos"){
		objetoBusqueda.where.tema = req.query.temasearch;
	}
	//pasamos a .findAll e objeto objetoBusqueda resultante
	models.Quiz.findAll(objetoBusqueda).then(
		function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}
	).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(  // crea objeto quiz
		{tema: "otro", pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz  // save: guarda en DB campos y pregunta y respuesta de quiz
				.save({fields: ["tema", "pregunta", "respuesta"]})
				.then( function(){ res.redirect('/quizes')})
			}		// res.redirect: Redirección HTTP a lista de preguntas
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz //autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.tema 	   = req.body.quiz.tema;
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else{
				req.quiz 	//save: guarda campos pregunta y respuesta en DB
				.save( {fields: ["tema", "pregunta", "respuesta"]})
				.then( function(){res.redirect('/quizes');});
			}	// Redirección HTTP a lista de preguntas (URL relativo)
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};