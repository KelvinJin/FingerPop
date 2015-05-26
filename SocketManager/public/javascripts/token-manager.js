/**
 * Created by Jin Wang on 27/05/15.
 */

var peerjsHost = 'finger.uthoft.com';
var peerjsPort = 3333;
var peerjsPath = '/api';

// Initialize the client peer object, get the peer id from the server
var peer = new Peer({host: peerjsHost, port: peerjsPort, path: peerjsPath});

// Now

peer.on('open', function (id) {
  console.log("my peer id is: " + id);
});