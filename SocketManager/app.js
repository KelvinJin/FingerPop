var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var globals = require('./globals.js');
var tools = require('./tools.js');
var app = express();
var server = app.listen(3000);
//var http = require('http');
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



io.on('connection', function(socket){
  var ipInfo = socket.request.connection._peername;
  var sessionStartCommand = sessionStartCommand(ipInfo.address+":"+ipinfo.port);
  client.write(sessionStartCommand);
  client.on('data',function(msg){
      //TODO
      socket.emit('reply',msg);
  });
  socket.on('message', function(msg){
    console.log(msg);


    if(msg == 'getWord')
    {
      //var word = 'CAO';
      var word =getRandomItemFromList(defaultWords[currentLevel]);

      io.emit('word',word);


      console.log('returning word : '+word);

    }
    else if(msg=='queryName')
    {
      //console.log('queryName');
    }
    else if(msg=='displayTeam')
    {
      team = getRandomItemFromList(defaultTeams);
      io.emit('team',team);
      console.log('returning team name '+team);
    }
    else if(msg=='displayTeamMembers')
    {
      io.emit('teamMembers',defaultTeamMembers);
      console.log('returning team members ');
    }
    else
    {}

  });
});

function sessionStartCommand(ipAddress)
{
    return '{"Type":0,"Content":{"@ip_addr":' +ipAddress  +'}}';
}
//TOOLS-----------
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function getRandomItemFromList(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getUrlParameter(sParam) {
  var sURLVariables = window.location.search.substring(1).split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

function reduceString(string, maxLength) {
  return string.length > maxLength ? name.slice(0, maxLength - 1) + "~" : string;
}

//-----------TOOLS

//GLOBALS----------
var debugMode = false;				// Enable this to see the letters in boxes
var hardMode = false;				//Enable this to have the full array of letters displayed without any clue.

var name = "Nameless";
var maxNameLength = 8;
// var entity = "player"; // player / keyboard

// Word to guess
var word;
var maxWordLength = 10;
var minWordLength = 3;
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
var maxLetters = 30;

var startTime = 15;
var addTime = 5;
var dangerTime = 5;
var tid;

var currentCharacter = 0;
var currentLevel = minWordLength;
var timeBonus = false;
var choiceLetters = {};

var defaultWords = {
  3: ["boy", "the", "say", "use"],
  4: ["tank", "fart", "list"],
  5: ["bitch", "losses", "total", "level"],
  6: ["artist", "potter", "pizzas"],
  7: ["fastest", "current"],
  8: ["gangster"],
  9: ["ABODEMENT", "ABRAIDING"],
  10: ["ABDOMINOUS", "LUMBERJACK"]};

var colorWheel = ["red", "green", "brown", "yellow", "orange", "cyan",
  "blue", "indigo", "purple", "violet"];

var letterMap = {};

var defaultTeams = ["Gangsters", "Yellowbellies", "Burpers"];
var team = "";
var defaultTeamMembers = ["Johny", "Max", "Bubby", "Vincent", "Tux"];

//----------GLOBALS

