// ==UserScript==
// @name         Where's Waldo?
// @namespace    MythosStudios
// @version      0.7
// @description  hide waldo on websites
// @match        *://*/*
// @grant         none
// @license      MIT
// ==/UserScript==

(function() {

if (window.top != window.self) return;
if (document.getElementById("waldo")) return;


var waldoPic = "https://therealmythdeveloper.github.io/Where-sWaldo-/240-2404326_waldo-wheres-wally-1546634879-removebg-preview.png";

var lastSpot = null;
var foundMsg = null;
var currentWaldo = null;
var currentHidingThing = null;
var waldoFound = false;


// dont stick him in something that could break the page
function skipThisElement(el) { 

if (!el || !el.tagName) return true;

var tag = el.tagName;

if (tag == "SCRIPT" || tag == "STYLE" || tag == "NOSCRIPT" ||
tag == "IFRAME" || tag == "SVG" || tag == "HEAD") return true;

if (el.closest && el.closest("#waldo")) return true;

return false;
}


// find pictures he can hide in
function findImageSpots(allThings, hidingSpots) {

for (var i = 0; i < allThings.length; i++) {

var pic = allThings[i];

if (skipThisElement(pic)) continue;
if (pic.tagName != "IMG") continue;
if (pic == lastSpot) continue;
if (pic.width < 35 || pic.height < 35) continue;

// leave links and buttons alone
if (pic.closest && pic.closest("a,button")) continue;

hidingSpots.push({
type: "image",
thing: pic
});

}

}


// find text he can replace
function findWordSpots(allThings, hidingSpots) {

for (var i = 0; i < allThings.length; i++) {

var el = allThings[i];

if (skipThisElement(el)) continue;

if (el.tagName == "INPUT" || el.tagName == "TEXTAREA" ||
el.tagName == "BUTTON" || el.tagName == "SELECT") continue;

if (el.closest && el.closest("a,button")) continue;
if (el == lastSpot) continue;

var children = el.childNodes;

for (var j = 0; j < children.length; j++) {

var textNode = children[j];

if (textNode.nodeType != 3) continue;
if (!textNode.textContent.trim()) continue;

var textBits = textNode.textContent.split(/(\s+)/);
var wordSlots = getWordIndexes(textBits);

if (wordSlots.length == 0) continue;

hidingSpots.push({
type: "word",
thing: textNode,
parent: el,
bits: textBits,
words: wordSlots
});

}

}

}


// words that are long enough to hide him
function getWordIndexes(textBits) {

var wordSlots = [];

for (var i = 0; i < textBits.length; i++) {
if (/^[a-zA-Z]{3,}$/.test(textBits[i])) {
wordSlots.push(i);
}
}

return wordSlots;

}


// pick random stuff
function pickRandom(list) {

if (!list || list.length == 0) return null;

return list[Math.floor(Math.random() * list.length)];

}


// try not to pick the same place again
function getAnotherSpot(hidingSpots) {

var otherSpots = [];

for (var i = 0; i < hidingSpots.length; i++) {

var spot = hidingSpots[i];

if (spot.thing != lastSpot && spot.parent != lastSpot) {
otherSpots.push(spot);
}

}

if (otherSpots.length > 0) return pickRandom(otherSpots);
return pickRandom(hidingSpots);

}


// make the word disguise
function makeWordDisguise(spot) {

var disguise = document.createElement("span");
disguise.id = "waldo";
disguise.style.cursor = "pointer";

var trick = Math.floor(Math.random() * 3);

if (trick == 0) {
makeRedWord(disguise, spot);
}
else if (trick == 1) {
makeTinyWaldo(disguise);
}
else {
makePeekaboo(disguise);
}

return disguise;

}


// a red word that might not actually be red enough.. um
function makeRedWord(disguise, spot) {

disguise.textContent = spot.bits[spot.word];

disguise.style.setProperty("color", "rgb(" + (160 + Math.random() * 95) + "," + (30 + Math.random() * 110) + "," + (30 + Math.random() * 110) + ")", "important");
disguise.style.setProperty("opacity", 0.35 + Math.random() * 0.65, "important");
disguise.style.setProperty("cursor", "pointer", "important");
disguise.style.setProperty("display", "inline", "important");

}


// tiny waldo
function makeTinyWaldo(disguise) {

var littleWaldo = document.createElement("img");

littleWaldo.src = waldoPic;
littleWaldo.style.width = (8 + Math.random() * 9) + "px";
littleWaldo.style.height = "auto";
littleWaldo.style.verticalAlign = "middle";
littleWaldo.style.cursor = "pointer";
littleWaldo.style.opacity = 0.7 + Math.random() * 0.3;

disguise.appendChild(littleWaldo);

}


// the peekaboo one
function makePeekaboo(disguise) {

var peekHole = document.createElement("span");
var peekGuy = document.createElement("img");
var peekSize = 5 + Math.random() * 15;

peekHole.style.display = "inline-block";
peekHole.style.width = peekSize + "px";
peekHole.style.height = "20px";
peekHole.style.overflow = "hidden";
peekHole.style.position = "relative";
peekHole.style.verticalAlign = "middle";

peekGuy.src = waldoPic;
peekGuy.style.position = "absolute";
peekGuy.style.width = "32px";
peekGuy.style.maxWidth = "none";
peekGuy.style.height = "auto";
peekGuy.style.top = "-2px";

// DO A FLIP
if (Math.random() > 0.5) {
peekGuy.style.left = "0px";
}
else {
peekGuy.style.left = -(32 - peekSize) + "px";
}

peekHole.appendChild(peekGuy);
disguise.appendChild(peekHole);

}


// replace the original word with Waldo
function putWaldoInText(spot) {

var disguise = makeWordDisguise(spot);
var newText = document.createDocumentFragment();

for (var i = 0; i < spot.bits.length; i++) {

if (i == spot.word) {
newText.appendChild(disguise);
}
else {
newText.appendChild(document.createTextNode(spot.bits[i]));
}

}

if (!spot.thing.parentNode) return null;

spot.thing.parentNode.replaceChild(newText, spot.thing);
return disguise;

}


// image disguise
function turnImageIntoWaldo(pic) {

var oldFilter = pic.style.filter;
var oldCursor = pic.style.cursor;
var oldId = pic.id;
var oldOpacity = pic.style.opacity;
var oldClick = pic.onclick;

pic.id = "waldo";
pic.style.cursor = "pointer";

pic.style.filter = "sepia(" + (0.2 + Math.random() * 0.5) +
") saturate(" + (1.5 + Math.random() * 3) +
") hue-rotate(" + (300 + Math.random() * 40) + "deg)";

return {
thing: pic,
filter: oldFilter,
cursor: oldCursor,
id: oldId,
opacity: oldOpacity,
click: oldClick
};

}


// found him
function makeFoundMessage() {

var msg = document.createElement("div");
msg.textContent = "YOU FOUND WALDO!";

msg.style.position = "fixed";
msg.style.top = "20px";
msg.style.left = "50%";
msg.style.transform = "translateX(-50%)";
msg.style.background = "#d71920";
msg.style.color = "white";
msg.style.padding = "12px 20px";
msg.style.font = "bold 16px Arial";
msg.style.borderRadius = "8px";
msg.style.zIndex = "999999";
msg.style.pointerEvents = "none";

return msg;

}


// remove the notification
function removeFoundMessage() {

if (foundMsg) {
foundMsg.remove();
foundMsg = null;
}

}


// cleanup Waldo and restore his hiding spot
function cleanUpWaldo() {

if (!currentWaldo || !currentHidingThing) return;

var hidingThing = currentHidingThing;
var waldo = currentWaldo;

// word cleanup. replace ONLY his wrapper with the original word
if (hidingThing.type == "word") {

if (waldo.parentNode) {
waldo.parentNode.replaceChild(
document.createTextNode(hidingThing.bits[hidingThing.word]),
waldo
);
}

}

// image cleanup
else {

var savedImage = hidingThing.saved;

if (savedImage && savedImage.thing) {

var pic = savedImage.thing;

pic.id = savedImage.id;
pic.style.filter = savedImage.filter;
pic.style.cursor = savedImage.cursor;
pic.style.opacity = savedImage.opacity;
pic.onclick = savedImage.click;

}

}

currentWaldo = null;
currentHidingThing = null;

}


// clicking him
function waldoClicked(e) {

if (waldoFound) return;
waldoFound = true;

if (e) {
e.preventDefault();
e.stopPropagation();
}

var waldo = currentWaldo;

if (!waldo) return;

waldo.style.opacity = "1";
waldo.style.color = "red";
waldo.style.filter = "none";
waldo.style.cursor = "default";
waldo.onclick = null;

foundMsg = makeFoundMessage();

if (document.body) {
document.body.appendChild(foundMsg);
}

setTimeout(function() {

removeFoundMessage();

// put the page back before finding a new spot
cleanUpWaldo();

waldoFound = false;
hideWaldo();

}, 1300);

}


// give him a click event
function giveWaldoClick(waldo) {

if (!waldo) return;
waldo.onclick = waldoClicked;

}


// main hiding function
function hideWaldo() {

if (document.getElementById("waldo")) return;

var allThings = document.getElementsByTagName("*");
var hidingSpots = [];

findImageSpots(allThings, hidingSpots);
findWordSpots(allThings, hidingSpots);

if (hidingSpots.length == 0) return;

var hidingThing = getAnotherSpot(hidingSpots);
if (!hidingThing) return;

lastSpot = hidingThing.type == "image" ?
hidingThing.thing : hidingThing.parent;


// hide him in a word
if (hidingThing.type == "word") {

var word = pickRandom(hidingThing.words);
hidingThing.word = word;

currentWaldo = putWaldoInText(hidingThing);

if (!currentWaldo) return;

currentHidingThing = hidingThing;

}

// hide him in an image
else {

var savedImage = turnImageIntoWaldo(hidingThing.thing);
hidingThing.saved = savedImage;

currentWaldo = hidingThing.thing;
currentHidingThing = hidingThing;

}

giveWaldoClick(currentWaldo);

}


// he hides
hideWaldo();

})();