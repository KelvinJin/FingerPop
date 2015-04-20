/* Finger Pop Game - Server Input/Output.JS
 * Author:  Arun Hariharan Sivasubramaniyan
 * Subject: Distributed Algorithms, Project 1
 * Revision: 1
 * Date revised: 12.4.2015
 */

//TODO: from server: serverlistener

function getWord(socket) {
  // TODO: Add server query here?
  socket.emit('message','getWord');


  return getRandomItemFromList(defaultWords[currentLevel]);
}

function displayTeam(socket) {
  //TODO: server communication
  socket.emit('message','displayTeam');
  //team = getRandomItemFromList(defaultTeams);
  //$("#yourTeam").html(team);
}


function displayTeamMembers(socket) {
  //TODO: server communication
  socket.emit('message','displayTeamMembers');
  //$("#teamMembers").html('');
  // .forEach(function(member) {
  //  $("#teamMembers").append('<li>' + reduceString(member, maxNameLength) + '<li>');
  //});
  //$("#teamMembers").append('<li>' + reduceString(name, maxNameLength) + '<li>');
}

function queryName(socket) {
  //TODO: server communication?
  socket.emit('message','queryName');
  var gName = getUrlParameter("name");
  if (typeof gName == 'string') {
    name = gName;
  }
}

function checkMove(slotId, cardLetter, slotLetter,socket) {
  //TODO: server communication
  return (slotLetter == cardLetter);
}
