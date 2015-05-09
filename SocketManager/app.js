/***************************** Global Constants ***************************/

// The default unix socket address used to communicate with the Server
//var SERVER_DEFAULT_ADDR = '/tmp/server';
var SERVER_DEFAULT_ADDR = '10.9.168.246:9999';
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
var net = require('net');

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

/***************************** Server Side Communicator ***************************/

// The default unix socket used to communicate with the Server
var unix_socket = net.connect('9999','10.9.168.246', function () {
  console.log('Connected to server!');
});

// We need to set the encoding since ruby and nodejs have different default encoding methods.
unix_socket.setEncoding('utf8');

/***************************** When we get a connection from Client ***************************/

// Once we get a connection from Client.
listener.on('connection', function (socket) {

  // We need to record the ip address of the Client immediately and compose the start command message to send
  // to the Server.
  var ipInfo = socket.request.connection._peername;
  var sStartCommand = sessionStartCommand(ipInfo.address + ":" + ipInfo.port);

  // For individual Client, we listen on certain event.
  socket.on('letterInserting', function (msg) {
    unix_socket.write(msg);
  });

  // Meanwhile, we'd like to subscribe this client to the message from Server.
  // This is a broadcast way to return every message from server to client.
  unix_socket.on('data', function (msg) {
    var message = JSON.parse(msg);

    // However, we don't want one Client to get the start session message of other Clients.
    // Because before the Client receives the start session message, it won't know whether a particular
    // message should be processed or not. Only after start session message which contains the unique player id,
    // can the individual Client know if a message is sent to itself.
    if (message["@player_name"] != null) {
      socket.emit('startSession', msg);
    }
    else {
      socket.emit('letterInserted', msg);
    }
  });

  // We must put this code here after we've listened on the socket.
  unix_socket.write(sStartCommand);

});

function sessionStartCommand(ipAddress) {
  return '{"Type":0,"Content":{"@ip_addr":"' + ipAddress + '"}}';
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