// Definicion del modelo de Quiz con validación

module.exports = function(sequielice, DataTypes){
	return sequielice.define(
		'Quiz',
		{ 
		   tema: {
		   	type: DataTypes.STRING,
		   	validate: { notEmpty: {msg: "-> Falta Tema"}}
		   },
		   pregunta: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta Pregunta"}}
		   },  
		   respuesta: {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Respuesta"}}
			} 
		}
	);
}