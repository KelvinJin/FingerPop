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
var wordMap = {};
var wordInterval = 1500;
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
var letterWheel = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var maxLetters = 30;

var currentLevel = minWordLength;

var colorWheel = ["red", "green", "brown", "yellow", "orange", "cyan",
  "blue", "indigo", "purple", "violet"];

var letterMap = {};
var letterAvailable = {};

//socket.listener------------

var keyboard_enabled = false;
var my_session_id = null;
var my_player_id = null;
var my_name = null;
var player_score_list = {};
var request_list = new Queue();
var signature = null;

var PLAYER_NAME_KEY = 'name';
var PLAYER_SCORE_KEY = 'score';

function openSocket(playerName) {

  // We initialize a socket.io instance. The javascript code is in html already.
  var socket = io();

  socket.on('connect', function () {
    socket.emit('playerName', playerName);

    // Let's disable the current key press event.
    $(document).keypress(function (event) {
      // insertLetter(currentCharacter, event.charCode);
      var keyPressed = String.fromCharCode(event.charCode).toLowerCase();

      //sendKeyPress(keyPressed);
      onKeyPress(keyPressed);
    });

  });

  return socket
}

function onKeyPress(pressedKey) {
  if (! keyboard_enabled) {
    return;
  }
  var key = pressedKey.toUpperCase();
  if (key > 'Z' || key < 'A') {
    return;
  }
  var key_available = letterAvailable[key];
  signature = Date.now().toString();

  var request = "{\"Key\":\"" + key + "\",\"Status\":" + key_available + ",\"Signature\":\"" + signature + "\"}";
  request_list.enqueue(request);
}

function listenOnSocket(socket) {
  // Get the start session response from server.
// This message should be received first before anything else.
// Message protocol:
// keys: @session_id, @player_id, @player_name, @new_unsorted_word
  socket.on('startSession', function (msg) {
    // Get the json object from msg
    var jsonObj = JSON.parse(msg);
    printMessage("Game Start!!!" + msg);

    var peerIds = jsonObj['@player_list'];

    if (myPeerId in peerIds) {
      my_session_id = jsonObj['@session_id'];
    } else {
      return
    }

    // When I get the peer ids from server
    var previousId = 0;
    var nextId = 0;

    for (var i = 0; i < peerIds.length; i++) {
      addPlayer(peerIds[i], 'Player' + i);

      if (peerIds[i] == myPeerId) {
        previousId = i == 0 ? peerIds[peerIds.length - 1] : peerIds[i - 1];
        nextId = i == peerIds.length - 1 ? peerIds[0] : peerIds[i + 1];
      }
    }

    refreshPlayerScoreList();

    word = jsonObj['@new_unsorted_word'];

    if (word != null) {
      setWord(word);
    }

    connectToPeers(peerIds, previousId, nextId, letterInsertedMessageProcessor, tokenReceivedMessageProcessor);
  });
}

function tokenReceivedMessageProcessor(processCallback) {

  while (!request_list.isEmpty()) {

    var request = request_list.dequeue();
    var requestObj = JSON.parse(request);

    if (keyboard_enabled == true) {
      requestObj = JSON.parse(request);
      var key = requestObj['Key'];
      var status = requestObj['Status'];
      if (status == true) {
        var slot_ids = [];
        var score_dif = 0;
        var complete = false;
        var new_unsorted_word = null;
        if (wordMap[key] != null) {
          slot_ids = wordMap[key];
          score_dif = 15;
          if (Object.keys(wordMap).length == 1) {
            complete = true;
            keyboard_enabled = false;
            new_unsorted_word = wordList[wordListIndex ++];
          }
        }
        if (slot_ids.length == 0)
          score_dif = - 5;

        var letterInsertedMessage = {
          "@session_id": my_session_id,
          "@player_id": my_player_id,
          "@slot_ids": slot_ids,
          "@score_dif": score_dif,
          "@letter": key,
          "@complete": complete,
          "@new_unsorted_word": new_unsorted_word
        };

        var letterInsertingMessageWrapper = "{\"Type\":3,\"Content\":{\"@session_id\":" + my_session_id +
          ",\"@player_id\":\"" + my_player_id +
          "\",\"@message\":" + JSON.stringify(letterInsertedMessage) + "}}";


        peerConnections.forEach(function(element, index) {
          element.send(letterInsertingMessageWrapper);
        });
      }
    }
  }

  processCallback();
}


function letterInsertedMessageProcessor(msg) {
  printMessage("Get new letter insertion" + "   " + msg);

  var jsonObj = (JSON.parse(msg)['@message']);

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

  if (slot_ids.length > 0) {
    // Update the letter slot

    insertLetter(slot_ids, inserted_letter);
    delete wordMap[inserted_letter];

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
}

function highlightSlots() {
  $('.slotElement').each(function (index, element) {
    element.style.backgroundColor = "#2ecc71";
  })
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
  letterAvailable[key] = false;
}

function insertLetter(slot_ids, letter) {
  var key = letter.toUpperCase();
  letterAvailable[key] = false;
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

      $('<div>' + key + '</div>').data('letter', key).attr('id', newId).addClass("pileElement").appendTo('#cardPile').draggable({
        containment: '#content',
        stack: '#cardPile div',
        cursor: 'move',
        revert: true
      });
      $("#" + newId).position({of: $("#slot" + slot_ids[i]), my: 'center', at: 'center'}).addClass('slotElement');
    }

    letterMap[key][0] = '-1';
  }

}
//------------socket.listener


function getLetters(word) {
  return word.slice();
}

function placeChoices(letters) {

  for (var i = 0; i < Math.min(letterWheel.length, maxLetters); i ++) {
    var letter = letterWheel[i].toUpperCase();
    $('<div>' + letter + '</div>').data('letter', letterWheel[i]).attr('id', 'card' + i).addClass("pileElement").appendTo('#cardPile');

    $('#card' + i)[0].onclick = function () {
      onKeyPress($(this).data('letter'));
    };

    letterMap[letter] = ['#card' + i];
    letterAvailable[letter] = true;

  }
}

function setWord(rawWord) {
  word = rawWord.split("");
  letters = getLetters(word);

  for (var i = 0; i < letters.length; i ++) {
    if (wordMap[letters[i].toUpperCase()] == null) {
      wordMap[letters[i].toUpperCase()] = [];
    }
    wordMap[letters[i].toUpperCase()].push(i);
  }


  colorWheel = shuffleArray(colorWheel);
  letterMap = {};

  $('#cardPile').html('');
  $('#cardSlots').html('');

  placeWordHint(word);

  placeChoices(letters);

  keyboard_enabled = true;
}
function init() {

  currentLevel = minWordLength;

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

function placeWordHint(word) {
  for (var i = 0; i < Math.min(word.length, maxWordLength); i ++) {
    var letter = word[i].toUpperCase();
    var hint = debugMode ? letter : "";
    $('<div>' + hint + '</div>').data('letter', word[i]).data('id', i).addClass("slotElement").attr('id', 'slot' + i).appendTo('#cardSlots');
  }
}

function dismissPlayerNameDialog() {
  $('#globalOverlay').fadeOut(100);

  $('#playerNameDialog').fadeOut(100);
}

function printMessage(message) {
  var txt = $("textarea#console");
  txt.val(message + txt.val());
}


window.onload = function () {
  init();
};