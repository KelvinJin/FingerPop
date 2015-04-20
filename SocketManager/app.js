var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

//unix socket
var SERVER_DEFAULT_ADDR = '/tmp/server';
var net = require('net');
var client = net.connect({path: SERVER_DEFAULT_ADDR},
  function(){
    console.log('connected to server!');
    //client.write('hello world!');
  });
client.setEncoding('utf8');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

io.on('connection', function(socket){
  var ipInfo = socket.request.connection._peername;
  var sStartCommand = sessionStartCommand(ipInfo.address + ":" + ipInfo.port);

  socket.on('letterInserting', function (msg) {
    client.write(msg);
  });

  client.on('data',function(msg){
      var message = JSON.parse(msg);

      console.log(message);

      if (message["@player_name"] != null) {
        socket.emit('startSession', msg);
      }
      else
        socket.emit('letterInserted', msg);
  });

  client.write(sStartCommand);
});

function sessionStartCommand(ipAddress)
{
    return '{"Type":0,"Content":{"@ip_addr":"' + ipAddress  +'"}}';
}



/******************** OTHER STUFF I DON'T CARE **************************/

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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;