(function() {

if (window.top != window.self) return;
if (document.getElementById("waldo")) return;

var img = document.createElement("img");
img.id = "waldo";
img.src = "240-2404326_waldo-wheres-wally-1546634879-removebg-preview.png";
img.alt = "Waldo";

var size = Math.random() * 37 + 28;
var x = Math.random() * (window.innerWidth - size);
var y = Math.random() * (window.innerHeight - size);
var z = Math.random() * 100;

img.style.position = "fixed";
img.style.left = x + "px";
img.style.top = y + "px";
img.style.width = size + "px";
img.style.height = "auto";
img.style.zIndex = z;
img.style.cursor = "pointer";
img.style.userSelect = "none";
img.style.display = "block";

img.draggable = false;

img.onclick = function(e) {

    e.stopPropagation();

    img.style.zIndex = 999999;
    img.style.width = "90px";
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

function start() {
    if (!document.body) {
        setTimeout(start, 100);
        return;
    }

    document.body.appendChild(img);
}

start();

})();