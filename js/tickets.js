"use strict";


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }


function start(){

    if($(window).scrollTop() >= $('#ewokpackage').offset().top) {
        $('#arrow').css('opacity', '0');
    }


    $(window).on('scroll', function() {
        var $windowHeight = $(window.top).height();
        var $windowPosition = $(window).scrollTop();
        var $windowBottom = $(window).scrollTop() + $windowHeight;
        var $arrow = $('#arrow');
        var $firstHeaderPosition = $('h2:first').offset().top;
        var $bottomToHeader = $firstHeaderPosition - $windowHeight;

        $('.packageHeading').each(function() {
            var $ewokPosition = $(this).offset().top;
            if($(this).css("opacity") == 1) return;
            if($windowPosition + (0.8 * $windowHeight) > $ewokPosition) {
                $.proxy(ticketTypeEntrance, this)();
            }
        })

        if($windowPosition < $firstHeaderPosition) {
        console.log("flag");
            var difference = $firstHeaderPosition - $windowBottom;
            var ratio = (difference / $bottomToHeader);
            $arrow.css({
                opacity: ratio
            });
        }
    });


}
