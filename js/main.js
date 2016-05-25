"use strict";

if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }

function start() {
    $(".main-text").niceScroll({cursorcolor:"white", railalign:"left",
        cursoropacitymin:"0.2"});
    $(window).on("resize", setup);
}


function changeButton() {
    var $activateButton = $('#activate-button');
    if($activateButton.text() === 'Animate') {
        $activateButton.html("Stop");
        console.log("FLAG");
    }
    else {
        $activateButton.html("Animate");
    }
}
