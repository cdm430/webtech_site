"use strict";

$(document).on("ready", start);

function start() {
    $(".text-side").niceScroll({cursorcolor:"white", railalign:"left",
        cursoropacitymin:"0.2"});
    $(window).on("resize", setup);
    $('.text-side').on("scroll", fadePrompt);
}


function changeButton() {
    var $activateButton = $('#activate-button');
    if($activateButton.text() === 'Animate') {
        $activateButton.text("Stop");
    }
    else {
        $activateButton.text("Animate");
    }
}


function fadePrompt() {
    var $textSide = $('.text-side');
    var $scrollPosition = $textSide.scrollTop();
    var $paragraphPosition = $('p:first').offset().top;
    var $topToPar = $paragraphPosition - $scrollPosition;

    var $prompt = $('#scroll-prompt');
    if ($scrollPosition < $paragraphPosition) {
        var ratio = $topToPar / $paragraphPosition;
        $prompt.css({
            opacity: ratio
        });
    }
}
