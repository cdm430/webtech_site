"use strict";

var numTickets1, numTickets2, numTickets3;


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }


function start(){

    $(window).scrollTop(0);


    $('.sign-in').on('click', logoChange);

    checkLoggedIn();

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


function changePackages() {
    var $buttons = $('.buttons');
    $buttons.each(function() {
        $(this).find('p, .sign-in').remove();
    });


    $('.purchase').off().on('click', function() {
        $(this).text("Purchase Another");
        var ticketId = $(this).attr('id');
        purchaseTicket(ticketId);

    });

    getTicketInfo();

    $('.purchase, .terms, .purchase-frosted, .terms-frosted, .procured').animate({
        top: '6em'
    }, 200, 'linear');
}


function purchaseTicket(ticketId) {
    var url = "purchaseticket?" + ticketId;
    console.log("url going in is " + url);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
          var responseString = xmlhttp.responseText;
          if(responseString === "nf") {
              console.log("not logged in, do nothing");
              return;
          }
          else if(responseString === "writtenticket") {
              console.log("written ticket to database");
              getTicketInfo();
          }
      }
    }
    xmlhttp.send();

}

function getTicketInfo() {
    var url = "gettickets";

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
              var numTickets = JSON.parse(responseString);
              numTickets1 = numTickets.numTickets1;
              numTickets2 = numTickets.numTickets2;
              numTickets3 = numTickets.numTickets3;
              fillTicketInfo();
          }
      }
    }
    xmlhttp.send();
}

function fillTicketInfo() {
    if(numTickets1 > 0) {
        $('#ewok-text').text("Tickets Purchased: " + numTickets1);
        $('#ewok-text').parent().animate({
            opacity: 1
        }, 1000, 'linear');
    }
    if(numTickets2 > 0) {
        $('#rebel-text').text("Tickets Purchased: " + numTickets2);
        $('#rebel-text').parent().animate({
            opacity: 1
        }, 1000, 'linear');
    }
    if(numTickets3 > 0) {
        $('#jedi-text').text("Tickets Purchased: " + numTickets3);
        $('#jedi-text').parent().animate({
            opacity: 1
        }, 1000, 'linear');
    }
}
