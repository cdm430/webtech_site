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
        $activateButton.html("Stop");
        console.log("FLAG");
    }
    else {
        $activateButton.html("Animate");
    }
}


function fadePrompt() {
    var $textSide = $('.text-side');
    var $scrollPosition = $textSide.scrollTop();
    var $paragraphPosition = $('p:first').offset();
    var $topToParagraph = $paragraphPosition - $scrollPosition;
    var $prompt = $('.scroll-prompt');

    if($scrollPosition < $paragraphPosition) {
        console.log("p: " + $paragraphPosition);
        var difference = $paragraphPosition - $scrollPosition;
        var ratio = difference / $topToParagraph;
        $prompt.css({
            opacity: ratio
        });
    }
    console.log($scrollPosition);



    //
    //var x = 1;
    //var ratio = x / $scrollPosition;
    //var console.log("offset: " + $prompt.offset().top);
    //if($prompt.offset() < $scrollPosition){
    //    console.log("flag");
    //}
    //$prompt.css({
    //    opacity: ratio
    //});
}
