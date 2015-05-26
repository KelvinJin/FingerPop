/***************************** Global Constants ***************************/

// The default unix socket address used to communicate with the Server
var SERVER_DEFAULT_ADDR = '/tmp/server';
//var SERVER_DEFAULT_ADDR = '10.9.170.25:9999';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = app.listen(3333);
var net = require('net');
var json_separator = '*';
var PeerServer = require('peer').PeerServer;
var pServer = PeerServer({port: 4444, path: '/api', allow_discovery:true});

/***************************** General Setups ***************************/

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/***************************** Client Side Listener ***************************/

// The socket listener used to communicate with the Client.
var listener = require('socket.io').listen(server);
var player_list=[];
var player_names=[];
var players_per_session = 3;

listener.on('connection', function (socket) {
  console.log("connected");
  if(player_list.length >= players_per_session){
    var startSessionMessage = {"@player_list":player_list,
      "@session_id":generateUUID(),
      "@new_unsorted_word":"HELLO"};
    listener.sockets.emit('startSession',JSON.stringify(startSessionMessage));
    player_list=[];
    player_names=[];
  }
});

pServer.on('connection',function(id){
  console.log(id);
  player_list.push(id);
});

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

/******************** OTHER STUFF I DON'T CARE **************************/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;