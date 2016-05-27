"use strict";

var numTickets1, numTickets2, numTickets3;


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }


function start(){

    if($(window).scrollTop() >= $('#ewokpackage').offset().top) {
        $('#arrow').css('opacity', '0');
    }

    $('.sign-in').on('click', logoChange);

    checkLoggedInTickets();

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

function checkLoggedInTickets() {
    var url = "loggedin";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
          var responseString = xmlhttp.responseText;
          if(responseString === "nf") {
              console.log("not logged in, do nothing");
              return;
          }
          else {
            console.log("logged in and must change html tickets");
            console.log("response object username : " + responseString);
            username = responseString;
            console.log("username set to " + username);
            changePackages();

          }
      }
    }
    xmlhttp.send();
}

function changePackages() {
    var $buttons = $('.buttons');
    $buttons.each(function() {
        $(this).find('p, .sign-in').remove();
    });

    $('.purchase').on('click', function() {
        $(this).text("Purchase Another")
    })
}
