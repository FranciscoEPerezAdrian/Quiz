// Definicion del modelo de Quiz

module.exports = function(sequielice, DataTypes){
	return sequielice.define('Quiz',
				{pregunta:  DataTypes.STRING,
				 respuesta: DataTypes.STRING,
				});
}