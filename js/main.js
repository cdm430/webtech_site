"use strict";

$(document).on("ready", start);

/*
 * Initialised the necessary event listneers and sets up the scrollbar described in
 * jquery.nicescroll.js. Also sets up the planet (in globe.js).
 */
function start() {
    $(".text-side").niceScroll({cursorcolor:"white", railalign:"left",
        cursoropacitymin:"0.2"});
    $(window).on("resize", setup);
    $('.text-side').on("scroll", fadePrompt);
}


/*
 * Changes the animate button on click.
 */
function changeButton() {
    var $activateButton = $('#activate-button');
    if($activateButton.text() === 'Animate') {
        $activateButton.text("Stop");
    }
    else {
        $activateButton.text("Animate");
    }
}


/*
 * Fades out the scroll prompt on the title screen as the user scrolls down
 */
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
