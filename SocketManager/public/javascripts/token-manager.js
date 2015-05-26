/**
 * Created by Jin Wang on 27/05/15.
 */

var peerjsHost = location.hostname;
var peerjsPort = 4444;
var peerjsPath = '/api';

// Initialize the client peer object, get the peer id from the server
var peer = new Peer({host: peerjsHost, port: peerjsPort, path: peerjsPath});
var myPeerId = null;

var TOKEN_RELEASE_MESSAGE = 100;
var LETTER_INSERT_MESSAGE = 3;

peer.on('open', function (id) {
  console.log("my peer id is: " + id);
  myPeerId = id;
});


var previousPeerConnection = null;
var nextPeerConnection = null;

peer.on('connection', function(previousConnection) {
  previousPeerConnection = previousConnection;

  // For previous peer, we need to listen on the token release message.
  // Let's assume we'll process all the letters in the queue.
  previousPeerConnection.on('data', function (msg) {
    var message = JSON.parse(msg);

    if (message['Type'] == TOKEN_RELEASE_MESSAGE) {
      tokenReceivedMessageProcessor(function () {
        sendTokenToNextPeer();
      });
    } else if (message['Type'] == LETTER_INSERT_MESSAGE) {
      letterInsertedMessageProcessor(msg);
    }
  });
});

//
var connectToNextPeer = function(nextPeerId) {
  // Connect to next remote peer.
  nextPeerConnection = peer.connect(nextPeerId);

  // If we receive a token from the peer.
  // The format should be {Type: 99, Content: {@session_id: 111, @player_id: '1111', @signature: '2222', @timestamp: 21324}}
  nextPeerConnection.on('data', function (msg) {

    var message = JSON.parse(msg);

    if (message['Type'] == LETTER_INSERT_MESSAGE) {
      letterInsertedMessageProcessor(msg);
    }

  });
};

var sendTokenToNextPeer = function () {
  var tokenReleaseMessage ="{\"Type\":100,\"Content\":{\"@session_id\":"+my_session_id+
    ",\"@player_id\":\""+my_player_id+"\"}}";

  // For the next peer, we need to give it our token once we've done with it.
  nextPeerConnection.send(tokenReleaseMessage);
};