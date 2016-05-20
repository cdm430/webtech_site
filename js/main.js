"use strict";

if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }

function start() {
    $(".main-text").niceScroll({cursorcolor:"white", railalign:"left", cursoropacitymin:"0.2"});
    $("html").niceScroll({cursorcolor:"white", zindex:99999, cursoropacitymin:"0.2", touchbehavior:true, railoffset:true});
}
