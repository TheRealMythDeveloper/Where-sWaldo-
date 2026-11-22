
 // ==UserScript==
 // @name         Where's Waldo?
 // @namespace    MythosStudios
 // @version      0.21
 // @description  hide waldo on websites
 // @match        *://*/*
 // @grant        none
 // @licsense     MIT
 // ==/UserScript==

 (function() {

 if (window.top != window.self) return;
 if (document.getElementById("waldo")) return;

 var things = document.getElementsByTagName("*");
 var hiding = [];

 for (var i = 0; i < things.length; i++) {
 var el = things[i];

 if (el.tagName == "SCRIPT" || el.tagName == "STYLE" || el.tagName == "NOSCRIPT") continue;
 if (el.tagName == "IFRAME") continue;
 if (el.closest && el.closest("#waldo-found")) continue; 

 // images can be waldo too 
 if (el.tagName == "IMG" && el.width > 35 && el.height > 35) {
 hiding.push({type:"image", thing:el});
 }

 // looking for text to hide in
 for (var j = 0; j < el.childNodes.length; j++) {
 var node = el.childNodes[j];

 if (node.nodeType != 3) continue;
 if (!node.textContent.trim()) continue;

 var parts = node.textContent.split(/(\s+)/);
 var count = 0;

 for (var k = 0; k < parts.length; k++) {
 if (/^[a-zA-Z]{3,}$/.test(parts[k])) count++;
 }

 if (count > 0) {
 hiding.push({type:"word", thing:node, parts:parts});
 }
 }
 }

 if (hiding.length == 0) return;

 var pick = hiding[Math.floor(Math.random() * hiding.length)];

 if (pick.type == "word") {

 var bits = pick.parts;
 var word = Math.floor(Math.random() * bits.length);

 while (!/^[a-zA-Z]{3,}$/.test(bits[word])) {
 word = Math.floor(Math.random() * bits.length);
 }

 var span = document.createElement("span");
 span.id = "waldo";
 span.style.color = "red";
 span.style.cursor = "pointer";

 for (var k = 0; k < bits.length; k++) {
 if (k == word) {
 span.textContent = bits[k];
 pick.thing.parentNode.insertBefore(span, pick.thing);
 } else {
 span.parentNode && span.appendChild(document.createTextNode(bits[k]));
 }
 }

 // rebuild the word around the disguise
 var before = document.createDocumentFragment();

 for (var k = 0; k < bits.length; k++) {
 if (k == word) {
 before.appendChild(span);
 } else {
 before.appendChild(document.createTextNode(bits[k]));
 }
 }

 pick.thing.parentNode.replaceChild(before, pick.thing);

 } else {

 var img = pick.thing;
 img.id = "waldo";
 img.style.filter = "sepia(1) saturate(8) hue-rotate(-35deg)";
 img.style.cursor = "pointer";

 }

 var waldo = document.getElementById("waldo");

 waldo.onclick = function(e) {
 e.preventDefault();
 e.stopPropagation();

 if (pick.type == "image") {
 waldo.style.filter = "none";
 waldo.style.outline = "3px solid red";
 }

 waldo.style.color = "red";
 waldo.style.cursor = "default";
 waldo.onclick = null;

 var found = document.createElement("div");
 found.textContent = "YOU FOUND WALDO!";

 found.style.position = "fixed";
 found.style.top = "20px";
 found.style.left = "50%";
 found.style.transform = "translateX(-50%)";
 found.style.background = "#d71920";
 found.style.color = "white";
 found.style.padding = "12px 20px";
 found.style.font = "bold 16px Arial";
 found.style.zIndex = "999999";
 found.style.borderRadius = "8px";
 found.style.pointerEvents = "none";

 document.body.appendChild(found);
 };

 })();
