// ==UserScript==
// @name         Where's Waldo?
// @namespace    MythosStudios
// @version      0.6
// @description  hide waldo on websites
// @match        *://*/*
// @grant        none
// @licsense     MITs
// ==/UserScript==

(function() {

if (window.top != window.self) return;
if (document.getElementById("waldo")) return;


var waldoPic = "https://therealmythdeveloper.github.io/Where-sWaldo-/240-2404326_waldo-wheres-wally-1546634879-removebg-preview.png";
var lastSpot = null;
var foundMsg = null;
var currentWaldo = null;
var currentHidingThing = null;


// dont put him in scripts and stuff, that would be bad.
function skipThisElement(el) {

if (!el || !el.tagName) return true;

var tag = el.tagName;

if (tag == "SCRIPT" || tag == "STYLE" || tag == "NOSCRIPT" ||
tag == "IFRAME" || tag == "SVG" || tag == "HEAD") return true;

if (el.closest && el.closest("#waldo")) return true;

return false;
}


// images are good hiding places
function findImageSpots(allThings, hidingSpots) {

for (var i = 0; i < allThings.length; i++) {

var pic = allThings[i];
if (skipThisElement(pic)) continue;
if (
    pic.tagName != "IMG") continue;
if (pic == lastSpot) continue;
if (pic.width < 35 || pic.height < 35) continue;

// dont mess with clickable images, I dont want to break links
if (pic.closest && pic.closest("a,button")) continue;

hidingSpots.push({
type: "image",
thing: pic
});

}

}


// find words to hide him in
function findWordSpots(allThings, hidingSpots) {

for (var i = 0; i < allThings.length; i++) {

var el = allThings[i];

if (skipThisElement(el)) continue;

if (el.tagName == "INPUT" || el.tagName == "TEXTAREA" ||
el.tagName == "BUTTON" || el.tagName == "SELECT") continue;
if (el.closest && el.closest("a,button")) continue;
if (el == lastSpot) continue;

var children = el.childNodes;

for (var j = 0; j < children.length; j++) {var textNode = children[j];

if (textNode.nodeType != 3) continue;
if (!textNode.textContent.trim()) continue;

var textBits = textNode.textContent.split(/(\s+)/);
var wordSlots = getWordIndexes(textBits);

if (wordSlots.length == 0) continue;

hidingSpots.push({type: "word",
thing: textNode,
parent: el,
bits: textBits,
words: wordSlots
});

}

}

}


// woords
function getWordIndexes(textBits) {

var wordSlots = [];

for (var i = 0; i < textBits.length; i++) {

if (/^[a-zA-Z]{3,}$/.test(textBits[i])) {
wordSlots.push(i);
}

}

return wordSlots;

}


// just pick somewhere random
function pickRandom(list) {
if (!list || list.length == 0) return null;
return list[Math.floor(Math.random() * list.length)];
}


// dont pick the exact same place over and over
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


// red word, waldo image or a peekaboo
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


// suspiciously red word
function makeRedWord(disguise, spot) {
disguise.textContent = spot.bits[spot.word];
disguise.style.color = "rgb(" +(160 + Math.random() * 95) + "," +(30 + Math.random() * 110) + "," +(30 + Math.random() * 110) + ")";

disguise.style.opacity = 0.5 + Math.random() * 0.5;

}


// tiny little waldo
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


// barely showing him
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


// swap the word out for Waldo
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

spot.thing.parentNode.replaceChild(newText, spot.thing);
return disguise;
}


// muehehehe
function turnImageIntoWaldo(pic) {
var oldFilter = pic.style.filter;
var oldCursor = pic.style.cursor;
var oldId = pic.id;

pic.id = "waldo";
pic.style.cursor = "pointer";

pic.style.filter = "sepia(" + (0.2 + Math.random() * 0.5) +
") saturate(" + (1.5 + Math.random() * 3) +
") hue-rotate(" + (300 + Math.random() * 40) + "deg)";

return {thing: pic,filter: oldFilter,cursor: oldCursor,id: oldId
};
}

// you found him!!
function makeFoundMessage() {
var msg = document.createElement("div");
msg.textContent = "YOU FOUND WALDO!";
msg.style.position = "fixed";msg.style.top = "20px";
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
// rmove stale notification
function removeFoundMessage() {

if (foundMsg) {
foundMsg.remove();
foundMsg = null;
}
}


// fix pages
function restoreText(spot, waldo) {
if (!spot || !spot.thing || !waldo) return;
if (waldo.parentNode && spot.thing.parentNode) {
waldo.parentNode.replaceChild(spot.thing, waldo);
}
}


// put the image back the way it was
function restoreImage(savedImage) {
if (!savedImage || !savedImage.thing) return;
var pic = savedImage.thing;
pic.id = savedImage.id;
pic.style.filter = savedImage.filter;
pic.style.cursor = savedImage.cursor;
pic.onclick = null;
}


// clicking him
function waldoClicked(e) {

if (e) {
e.preventDefault();
e.stopPropagation();
}

var waldo = currentWaldo;
var hidingThing = currentHidingThing;
if (!waldo || !hidingThing) return;
waldo.style.opacity = "1";
waldo.style.color = "red";
waldo.style.filter = "none";
waldo.style.cursor = "default";
waldo.onclick = null;

foundMsg = makeFoundMessage();
document.body.appendChild(foundMsg);

setTimeout(function() {
removeFoundMessage();
// fix hiding
if (hidingThing.type == "word") {
restoreText(hidingThing, waldo);
}
else {
restoreImage(hidingThing.saved);
}

currentWaldo = null;
currentHidingThing = null;
hideWaldo();

}, 1300);

}


// waldo can be touched
function giveWaldoClick(waldo) {
waldo.onclick = waldoClicked;

}


// main hiding 
function hideWaldo() {
var allThings = document.getElementsByTagName("*");
var hidingSpots = [];

findImageSpots(allThings, hidingSpots);
findWordSpots(allThings, hidingSpots);

if (hidingSpots.length == 0) return;
var hidingThing = getAnotherSpot(hidingSpots);
if (!hidingThing) return;

lastSpot = hidingThing.type == "image" ?
hidingThing.thing : hidingThing.parent;


// if he's going in a word, we need to remember the original text
if (hidingThing.type == "word") {

var word = pickRandom(hidingThing.words);
hidingThing.word = word;
currentWaldo = putWaldoInText(hidingThing);
currentHidingThing = hidingThing;

}else {
var savedImage = turnImageIntoWaldo(hidingThing.thing);

hidingThing.saved = savedvedImage;

currentWaldo = hidingThing.thing;
currentHidingThing = hidingThing;
}

giveWaldoClick(currentWaldo);
}


// he hides
hideWaldo();
})();