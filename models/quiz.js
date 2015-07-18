// Definicion del modelo de Quiz con validación

module.exports = function(sequielice, DataTypes){
	return sequielice.define(
		'Quiz',
		{ pregunta: {
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