"use strict";


/*
 * This script deals with the client side of the tickets page. This includes
 * the act of sending purchase requests, and obtaining information about how
 * many tickets of each type a user has
 */

// Global variables for the different ticket types
var numTickets1, numTickets2, numTickets3;


$(document).ready(start);


function start(){

    // Set the screen to the top of the page in case refresh halfway down
    $(window).scrollTop(0);


    $('.sign-in').on('click', logoChange);

    checkLoggedIn();

    // Listends for scroll events to animate the package headers appearing
    // and the arrow disappearing
    $(window).on('scroll', function() {
        var $windowHeight = $(window.top).height();
        var $windowPosition = $(window).scrollTop();
        var $windowBottom = $(window).scrollTop() + $windowHeight;
        var $arrow = $('#arrow');
        var $firstHeaderPosition = $('h2:first').offset().top;
        var $bottomToHeader = $firstHeaderPosition - $windowHeight;


        // Fade in package header and underline when reached
        $('.packageHeading').each(function() {
            var $packagePosition = $(this).offset().top;
            if($(this).css("opacity") == 1) return;
            if($windowPosition + (0.8 * $windowHeight) > $packagePosition) {
                $.proxy(ticketTypeEntrance, this)();
            }
        })

        // Fade out arrow when scrolling past
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


/*
 * This function changes the package information (the buttons) to how they
 * should look if a user is already signed in e.g no login button
 */
function changePackages() {
    var $buttons = $('.buttons');
    $buttons.each(function() {
        $(this).find('p, .sign-in').remove();
    });

    getTicketInfo();

    // Change text of purchase button on click
    $('.purchase').off().on('click', function() {
        $(this).text("Purchase Another");
        var ticketId = $(this).attr('id');
        purchaseTicket(ticketId);

    });


    // Shift the buttons down if logged in, else they appear too high
    $('.purchase, .terms, .purchase-frosted, .terms-frosted, .procured').animate({
        top: '6em'
    }, 200, 'linear');
}


/*
 * This function is responsible for actually sending the necessary request
 * for a ticket purchase to be written to the database on the server side
 */
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
              getTicketInfo();
          }
      }
    }
    xmlhttp.send();

}


/*
 * Gets the ticket information (how many of each ticket the user has) and
 * changes the display under the buttons accordingly.
 */
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


/*
 * If they have any tickets of that type, a green tick is displayed with the
 * number, else nothing is changed.
 */
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


/*
 * Fades ticket type heading in and animates a line underneath the heading
 */
function ticketTypeEntrance() {
    $(this).fadeTo(2000, 1);
    $(this).children('.underline').delay(400).animate({
        width: '50%',
        opacity: 1
    }, 1500, 'linear');
}