/* Finger Pop Game - Global.JS
 * Author:  Arun Hariharan Sivasubramaniyan
 * Subject: Distributed Algorithms, Project 1 
 * Revision: 1
 * Date revised: 12.4.2015
 */


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

var startTime = 100;
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
