var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Rutas antiguas cuando había una sola pregunta
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

//Rutas para múltiples preguntas
//Definición de rutas de /quizes
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);

/* GET author, no se incluye en controller por no tener lógica asociada */
router.get('/author', function(req, res){
	res.render('author');
});

module.exports = router;
