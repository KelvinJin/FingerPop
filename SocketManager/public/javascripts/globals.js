/* Finger Pop Game - Global.JS
 * Author:  Arun Hariharan Sivasubramaniyan
 * Subject: Distributed Algorithms, Project 1 
 * Revision: 1
 * Date revised: 12.4.2015
 */


var debugMode = false;				// Enable this to see the letters in boxes
var hardMode = false;				//Enable this to have the full array of letters displayed without any clue. 

var maxNameLength = 8;

// Word to guess
var word;
var wordInterval = 1500;
var maxWordLength = 10;
var keyboard_enabled = false;
var minWordLength = 3;
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
var maxLetters = 30;

var letterMap = {};

//socket.listener------------

var my_session_id = null;
var my_player_id = null;
var my_name = null;
var player_score_list = {};

var PLAYER_NAME_KEY = 'name';
var PLAYER_SCORE_KEY = 'score';

function openSocket(playerName) {

  // We initialize a socket.io instance. The javascript code is in html already.
  var socket = io();

  socket.on('connect', function () {
    socket.emit('playerName', playerName);
  });

  return socket
}

function keyPressToSocket(socket) {
  // Let's disable the current key press event.
  $(document).keypress(function (event) {
    // insertLetter(currentCharacter, event.charCode);
    var keyPressed = String.fromCharCode(event.charCode).toLowerCase();

    sendKeyPress(keyPressed);
  });

  currentSocket = socket;
}

var currentSocket = null;

function sendKeyPress(key) {

  if (!keyboard_enabled || key.toUpperCase() < 'A' || key.toUpperCase() > 'Z') { return; }

  if (currentSocket != null) {
    var msg = "{\"Type\":3,\"Content\":{\"@session_id\":" + my_session_id +
      ",\"@player_id\":\"" + my_player_id + "\",\"@card_letter\":\"" + key +
      "\"}}";

    currentSocket.emit('letterInserting', msg);
  }
}

function listenOnSocket(socket) {
  // Get the start session response from server.
// This message should be received first before anything else.
// Message protocol:
// keys: @session_id, @player_id, @player_name, @new_unsorted_word
  socket.on('startSession', function (msg) {
    // Get the json object from msg
    jsonObj = JSON.parse(msg);
    printMessage("Game Start!!!" + msg);
    var players = jsonObj['@player_list'];

    if (my_player_id in players) {
      my_session_id = jsonObj['@session_id'];
    } else {
      return
    }

    for (var player_id in players) {
      if (player_id == my_player_id)
        my_name = players[player_id];
      addPlayer(player_id, players[player_id]);
    }
    refreshPlayerScoreList();

    word = jsonObj['@new_unsorted_word'];

    if (word != null) {
      setWord(word);
    }
  });

  socket.on('setPlayerId', function (msg) {
    printMessage("Set Player Id " + " " + msg + "\n");
    my_player_id = msg;
  });

// Get the letter insert command result from server.
// Message protocol:
// keys: @session_id, @player_id, @score_dif, @slot_id, @letter, @complete, @new_unsorted_word
  socket.on('letterInserted', function (msg) {
    printMessage("Get new letter insertion" + "   " + msg);

    var jsonObj = JSON.parse(msg);

    // First check the session id
    var session_id = jsonObj['@session_id'];
    var player_id = jsonObj['@player_id'];

    if (session_id != my_session_id) return;

    // Then check the score change
    var score_dif = jsonObj['@score_dif'];

    if (score_dif != null) {
      player_score_list[player_id][PLAYER_SCORE_KEY] += score_dif
    }


    // Second check if the the letter is null
    var slot_ids = jsonObj['@slot_ids'];

    var inserted_letter = jsonObj['@letter'];

    if (inserted_letter.toUpperCase() < 'A' || inserted_letter.toUpperCase() > 'Z') { return; }

    if (slot_ids.length > 0) {
      // Update the letter slot

      insertLetter(slot_ids, inserted_letter);


      // Then check if this is the last move
      var is_complete = jsonObj['@complete'];

      if (is_complete != null && is_complete) {

        // Highlight the letters.
        highlightSlots();

        keyboard_enabled = false;

        toastr.options = {
          "closeButton": false,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-top-right",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "100",
          "hideDuration": "100",
          "timeOut": wordInterval,
          "extendedTimeOut": "0",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        };

        toastr.success('Awesome! Be ready for the next!');

        // We freeze for a while to let people know the word.
        setTimeout(function () {
          // Then we check the new word
          var new_word = jsonObj['@new_unsorted_word'];

          printMessage(new_word);

          if (new_word != null) {
            printMessage("Get new word");
            setWord(new_word);

          }
        }, wordInterval);
      }
    }
    else {
      removeCard(inserted_letter);
    }
    refreshPlayerScoreList();
  });
}

function addPlayer(player_id, player_name) {
  player_score_list[player_id] = {};
  player_score_list[player_id][PLAYER_NAME_KEY] = player_name;
  player_score_list[player_id][PLAYER_SCORE_KEY] = 0;
}

function refreshPlayerScoreList() {

  var teamScoreList = $("#teamPoints");

  clearTeamPoints();

  for (var player_id in player_score_list) {
    if (player_score_list.hasOwnProperty(player_id)) {
      player_name = player_score_list[player_id][PLAYER_NAME_KEY];
      player_score = player_score_list[player_id][PLAYER_SCORE_KEY];

      var styledList = my_player_id == player_id ? '<td class=\"leftAlignedTable\" style="color: deepskyblue;">' : '<td class=\"leftAlignedTable\">'

      teamScoreList.append("<tr>" + styledList + player_name +
        "</td><td class=\"rightAlignedTable\">" + player_score + "</td></tr>");
    }
  }
}

function clearTeamPoints() {
  var teamScoreList = $("#teamPoints");

  teamScoreList.html('');
  teamScoreList.append('<tr><td class="leftAlignedTable">PLAYER</td><td class="rightAlignedTable">POINTS</td></tr>');
}
function removeCard(letter) {
  var key = letter.toUpperCase();
  var cardId = letterMap[key][0];
  $(cardId).css("opacity", "0.3");
  letterMap[key][0] = - 1;
}
function insertLetter(slot_ids, letter) {
  var key = letter.toUpperCase();
  var initialId = letterMap[key][0].replace("#", "");
  for (var i = 0; i < slot_ids.length; i ++) {
    var cardId = letterMap[key][0];

    // var positionSlot = $("#slot" + slot_ids[i]).offset();
    // var positionCard = $(cardId).offset();

    $(cardId).position({of: $("#slot" + slot_ids[i]), my: 'center', at: 'center'}).addClass('slotElement');

    //dx = positionSlot.left - positionCard.left;
    //dy = positionSlot.top - positionCard.top;

    //$(cardId).simulate("drag-n-drop", {dx: dx, dy: dy});

    if (cardId == '-1') {
      var newId = initialId + "_" + i;

      $('<div>' + key + '</div>').data('letter', key).attr('id', newId).addClass("pileElement").appendTo('#cardPile');
      $("#" + newId).position({of: $("#slot" + slot_ids[i]), my: 'center', at: 'center'}).addClass('slotElement');
    }

    letterMap[key][0] = '-1';
  }

}
//------------socket.listener


function placeChoices() {
  var letterWheel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (var i = 0; i < Math.min(letterWheel.length, maxLetters); i ++) {
    var letter = letterWheel[i].toUpperCase();
    $('<div>' + letter + '</div>').data('letter', letterWheel[i]).attr('id', 'card' + i).addClass("pileElement").appendTo('#cardPile');

    $('#card' + i)[0].onclick = function () {
      sendKeyPress($(this).data('letter'));
    };

    letterMap[letter] = ['#card' + i];

  }
}

function placeWordHint(word) {
  for (var i = 0; i < Math.min(word.length, maxWordLength); i ++) {
    var letter = word[i].toUpperCase();
    var hint = debugMode ? letter : "";
    $('<div>' + hint + '</div>').data('letter', word[i]).data('id', i).addClass("slotElement").attr('id', 'slot' + i).appendTo('#cardSlots');
  }
}


function setWord(rawWord) {
  word = rawWord.split("");
  letterMap = {};

  $('#cardPile').html('');
  $('#cardSlots').html('');

  placeChoices();
  placeWordHint(word);

  keyboard_enabled = true;
}
function init() {


  $('#console').val('');
  printMessage("Welcome to the game, " + name + "!\n");


  document.getElementById('playerNameSubmit').onclick = function () {
    // Dismiss the modal overlay
    dismissPlayerNameDialog();

    // Get the entered player name by the user
    var inputPlayerName = $('#playerNameTextField').val();

    inputPlayerName = inputPlayerName.length <= maxNameLength ? inputPlayerName : inputPlayerName.substr(0, maxNameLength);

    // Open the socket
    var socket = openSocket(inputPlayerName);

    // Start the socket
    listenOnSocket(socket);

    keyPressToSocket(socket);
  };
}

function highlightSlots() {
  $('.slotElement').each(function (index, element) {
    element.style.backgroundColor = "#2ecc71";
  })
}

function dismissPlayerNameDialog() {
  $('.overlay').each(function (index, element) {
    element.style.display = 'none';
  });

  $('.modal').each(function (index, element) {
    element.style.display = 'none';
  });
}

function printMessage(message) {
  var txt = $("textarea#console");
  txt.val(message + txt.val());
}


window.onload = function () {
  init();
};