"use strict";

if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }

function start() {
    $(".main-text").niceScroll({cursorcolor:"white", railalign:"left", cursoropacitymin:"0.2"});
}
