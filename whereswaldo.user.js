
 // ==UserScript==
 // @name         Where's Waldo?
 // @namespace    MythosStudios
 // @version      0.4
 // @description  hide waldo on websites
 // @match        *://*/*
 // @grant         none
 // ==/UserScript==

 (function() {

 if (window.top != window.self) return;
 if (document.getElementById("waldo")) return;

 var last = null;
 var waldo = null;
 var message = null;
 var old = null;
 var source = "https://therealmythdeveloper.github.io/Where-sWaldo-/240-2404326_waldo-wheres-wally-1546634879-removebg-preview.png";

 function hide() {

 var stuff = document.getElementsByTagName("*");
 var places = [];

 for (var i = 0; i < stuff.length; i++) {
 var el = stuff[i];

 if (el.tagName == "SCRIPT" || el.tagName == "STYLE" || el.tagName == "NOSCRIPT" || el.tagName == "IFRAME") continue;
 if (el.closest && el.closest("#waldo")) continue;

 if (el.tagName == "IMG" && el.width > 35 && el.height > 35 && el != last) {
 places.push({type:"image", thing:el});
 }

 for (var j = 0; j < el.childNodes.length; j++) {
 var node = el.childNodes[j];

 if (node.nodeType != 3) continue;
 if (!node.textContent.trim()) continue;
 if (el == last) continue;

 var bits = node.textContent.split(/(\s+)/);
 var count = 0;

 for (var k = 0; k < bits.length; k++) {
 if (/^[a-zA-Z]{3,}$/.test(bits[k])) count++;
 }

 if (count > 0) places.push({type:"word", thing:node, parent:el, bits:bits});
 }
 }

 if (places.length == 0) return;

 var choices = [];

 for (var i = 0; i < places.length; i++) {
 if (places[i].thing != last && places[i].parent != last)
 choices.push(places[i]);
 }

 if (choices.length > 0) places = choices;

 var pick = places[Math.floor(Math.random() * places.length)];
 last = pick.thing;

 if (pick.type == "word") {

 var bits = pick.bits;
 var word = Math.floor(Math.random() * bits.length);

 while (!/^[a-zA-Z]{3,}$/.test(bits[word])) {
 word = Math.floor(Math.random() * bits.length);
 }

 var wrap = document.createElement("span");
 wrap.id = "waldo";

 // sometimes he is a red word, sometimes his tiny self
 if (Math.random() < 0.5) {

 wrap.textContent = bits[word];
 wrap.style.color = "rgb(" + (150 + Math.random() * 105) + ", " + (40 + Math.random() * 100) + ", " + (40 + Math.random() * 100) + ")";
 wrap.style.opacity = 0.5 + Math.random() * 0.5;

 } else {

 var tiny = document.createElement("img");
 tiny.src = source;
 tiny.style.width = (8 + Math.random() * 10) + "px";
 tiny.style.height = "auto";
 tiny.style.verticalAlign = "middle";
 tiny.style.cursor = "pointer";
 tiny.style.opacity = 0.7 + Math.random() * 0.3;
 wrap.appendChild(tiny);
 }

 wrap.style.cursor = "pointer";

 var before = document.createDocumentFragment();

 for (var k = 0; k < bits.length; k++) {
 if (k == word) before.appendChild(wrap);
 else before.appendChild(document.createTextNode(bits[k]));
 }

 pick.thing.parentNode.replaceChild(before, pick.thing);
 old = pick.thing;

 } else {

 waldo = pick.thing;
 old = waldo.style.filter;
 waldo.id = "waldo";
 waldo.style.filter = "sepia(" + (0.2 + Math.random() * 0.5) + ") saturate(" + (1.2 + Math.random() * 3) + ") hue-rotate(" + (300 + Math.random() * 40) + "deg)";
 waldo.style.cursor = "pointer";

 }

 waldo = document.getElementById("waldo");

 waldo.onclick = function(e) {

 e.preventDefault();
 e.stopPropagation();

 waldo.style.opacity = "1";
 waldo.style.color = "red";
 waldo.style.filter = "none";
 waldo.style.cursor = "default";
 waldo.onclick = null;

 message = document.createElement("div");
 message.textContent = "YOU FOUND WALDO!";
 message.style.position = "fixed";
 message.style.top = "20px";
 message.style.left = "50%";
 message.style.transform = "translateX(-50%)";
 message.style.background = "#d71920";
 message.style.color = "white";
 message.style.padding = "12px 20px";
 message.style.font = "bold 16px Arial";
 message.style.borderRadius = "8px";
 message.style.zIndex = "999999";
 message.style.pointerEvents = "none";

 document.body.appendChild(message);

 setTimeout(function() {

 if (message) {
 message.remove();
 message = null;
 }
 if (pick.type == "word") {
 var back = document.getElementById("waldo");
 if (back) back.parentNode.replaceChild(old, back);
 } else {
 waldo.id = "";
 waldo.style.filter = old;
 waldo.style.cursor = "";
 } 

 hide(); 

 }, 1300);
 
 };

 }
  
 hide();

 })();
