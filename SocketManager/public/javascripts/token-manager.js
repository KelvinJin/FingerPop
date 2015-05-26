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


var peerConnections = {};

// Connect to other peers in the same game
var connectToPeers = function(peerIds, previousPeerId, nextPeerId, letterInsertedCallback, tokenReceivedCallback) {
  for (var i = 0; i < peerIds.length; i++) {

    // Connect to a remote peer.
    var newConnection = peer.connect(peerIds[i]);

    // If we receive a token from the peer.
    // The format should be {Type: 99, Content: {@session_id: 111, @player_id: '1111', @signature: '2222', @timestamp: 21324}}
    newConnection.on('data', function (msg) {

      var message = JSON.parse(msg);

      if (message['Type'] == LETTER_INSERT_MESSAGE) {
        letterInsertedCallback(message);
      }

    });

    peerConnections[peerIds[i]] = newConnection;
  }

  // For previous peer, we need to listen on the token release message.
  // Let's assume we'll process all the letters in the queue.
  var previousPeerConnection = peerConnections[previousPeerId];

  previousPeerConnection.on('data', function () {
    var message = JSON.parse(msg);

    if (message['Type'] == TOKEN_RELEASE_MESSAGE) {
      tokenReceivedCallback(function () {
        sendTokenToPeer(nextPeerId);
      });
    }
  });
};

var sendTokenToPeer = function (peerId) {
  var nextPeerConnection = peerConnections[peerId];

  var tokenReleaseMessage ="{\"Type\":100,\"Content\":{\"@session_id\":"+my_session_id+
    ",\"@player_id\":\""+my_player_id+"\"}}";

  // For the next peer, we need to give it our token once we've done with it.
  nextPeerConnection.send(tokenReleaseMessage);
};