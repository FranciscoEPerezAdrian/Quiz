// Definicion del modelo de Comment con validacion

module.exports = function(sequielize, DataTypes) {
	return sequielize.define(
		'Comment',
		{ texto: {
			type: DataTypes.STRING,
			validate: { notEmpty: {msg: "-> Falta Comentario"}}
		}
	}
	);
}