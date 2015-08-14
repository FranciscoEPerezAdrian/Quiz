var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next){

	// guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)) {
		req.session.redir = req.path;
	}

	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

//Comprueba si el usuario lleva mas de dos minutos sin hacer nada 
//y si es así lo desconecta, si existe usuario almacena el momento de ultima transaccion
app.use(function(req, res, next){
    if(req.session.user){   //si hay un usuario conectado
       //console.log("usuario conectado");  //Flag de depuracion
        if(req.session.lastuse){ //si se ha registrado alguna actividad
            if((req.session.lastuse + 120000) >= (new Date()).getTime()){ //si lleva menos de dos minutos sin actuar
                req.session.lastuse = (new Date()).getTime();
                next();
                //console.log("menos de 2 minutos"); //Flag de depuracion
            } else { //si lleva mas de 2 min inactivo, elimina usuario y registro de actividad
                delete req.session.user;
                delete req.session.lastuse;
                res.redirect('/login');
                //console.log("mas de 2 minutos"); //Flag de depuracion
            }
        } else {  //si no hay registro de actividad (con usuario) lo crea
            req.session.lastuse = (new Date()).getTime();
            next();
            //console.log("sin registro de actividad"); //Flag de depuracion
        }
	} else {
        if(req.session.lastuse){  //si hay registro de actividad sin usuario, lo elimina
            //console.log("con registro de actividad"); //Flag de depuracion
            delete req.session.lastuse;
        }
        next();
        //console.log("sin usuario"); //Flag de depuracion
    }
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
