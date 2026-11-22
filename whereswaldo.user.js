// ==UserScript==
// @name         Where's Waldo?
// @namespace    MythosStudios
// @version      0.2
// @description  hide waldo on websites
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {

if (window.top != window.self) return;
if (document.getElementById("waldo")) return;

var words = document.getElementsByTagName("*");
var places = []; 

for (var i = 0; i < words.length; i++) {
    var thing = words[i];

    if (thing.children.length > 0) continue;
    if (!thing.textContent.trim()) continue;

    var rect = thing.getBoundingClientRect();
    if (rect.width < 40 || rect.height < 10) continue;
    if (rect.width > window.innerWidth) continue;

    places.push(thing);
}

if (places.length == 0) return;

var spot = places[Math.floor(Math.random() * places.length)];

var img = document.createElement("img");
img.id = "waldo";
img.src = "https://therealmythdeveloper.github.io/Where-sWaldo-/240-2404326_waldo-wheres-wally-1546634879-removebg-preview.png";
img.alt = "Waldo";

var size = Math.random() * 25 + 25;
var rect = spot.getBoundingClientRect();

spot.style.position = "relative";

img.style.position = "absolute";
img.style.width = size + "px";
img.style.height = "auto";
img.style.left = Math.random() * Math.max(0, rect.width - size) + "px";
img.style.top = Math.random() * Math.max(0, rect.height - size) + "px";
img.style.zIndex = "1";
img.style.cursor = "pointer";
img.style.userSelect = "none";
img.style.display = "block";

img.draggable = false;

img.onclick = function(e) {

    e.stopPropagation();

    img.style.width = "90px";
    img.style.zIndex = "999999";
    img.style.cursor = "default";

    var text = document.createElement("div");
    text.innerHTML = "YOU FOUND WALDO!";

    text.style.position = "fixed";
    text.style.top = "20px";
    text.style.left = "50%";
    text.style.transform = "translateX(-50%)";
    text.style.background = "#d71920";
    text.style.color = "white";
    text.style.padding = "12px 20px";
    text.style.font = "bold 16px Arial";
    text.style.borderRadius = "8px";
    text.style.zIndex = "999999";
    text.style.pointerEvents = "none";

    document.body.appendChild(text);

    img.onclick = null;
};

spot.appendChild(img);

})();