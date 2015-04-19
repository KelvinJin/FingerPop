/* Finger Pop Game - Tools.JS
 * Author:  Arun Hariharan Sivasubramaniyan
 * Subject: Distributed Algorithms, Project 1 
 * Revision: 1
 * Date revised: 12.4.2015
 */
 
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
