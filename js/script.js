"use strict";


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }


var username;

function start(){
    console.log("Started");
    var $heading = $('.heading');

    $('#trooperbox').hide();
    $heading.hide();
    headingEntrance();

    checkLoggedIn();


    $('.slider').on('mouseenter', function() {
        console.log("hovered on slider");
        $heading.stop().fadeTo(400, 0);
    })

    $('#login').on('submit', function(e) {
        e.preventDefault();
        var details = $('#login').serialize();
        var url = "login?" + details;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function(){
          if (xmlhttp.readyState==4 && xmlhttp.status==200){
              var responseString = xmlhttp.responseText;
              if(responseString === "nf") {
                  console.log("user not found!!!!!");
                  return;
              }
              else {
                  console.log("username " + username);
                  username = responseString;
                  checkLoggedIn();
              }
          }
        }
        xmlhttp.send();
    });


    $('.slider').on('mouseleave', function(){
        lineHide();
        $heading.stop().fadeTo(400, 1);
        lineAnimate();
    });




    $('#logo').on('click', logoChange);


    $('.slider').on('mouseover', function() {
        $('#trooperbox').fadeOut(500);
        $('#trooper').attr("src", "images/trooper.svg");
    });





    // login.addEventListener("blur", showHint, true);
    // // Captures not bubbles so set to true
    // login.addEventListener("focus", clearHint, true);


}

function logoChange() {
    console.log("clicked on logo");
    var $trooper = $('#trooper');
    var $box = $('#trooperbox');
    if(($box.css("opacity")) <= "0.5") {
        $box.fadeTo(200, 1);
        $trooper.attr("src", "images/rebel.svg");
    }
    else {
        $box.fadeTo(200, 0);
        $trooper.attr("src", "images/trooper.svg");
    }

}

function checkLoggedIn() {
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
            console.log("logged in and must change html for log in box");
            console.log("response object username : " + responseString);
            username = responseString;
            console.log("username set to " + username);
            changeLoginBox();
            console.log("url is " + window.location.href);
            if(window.location.href === "https://localhost:8443/tickets.html") {
                changePackages();
            }
            else if(window.location.href === "https://localhost:8443/profile.html") {
                getUserInfo();
                addCostumeListener();
            }
          }
      }
    }
    xmlhttp.send();
}

function changeLoginBox() {
    var newContent = "<div id='login'> <span id='username-word'>Hi,    " +
        username + "</span><a href='profile.html' class='button' id='profilebutton'>Profile" +
        "</a><button class='button' id='logoutbutton'>Log Out</button>"
         + "</div>";

    $('#trooperbox').html(newContent);

    $('#logoutbutton').on('click', logOut);
}

function logOut() {
    var url = "logout";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
          console.log("got into log out");
          var responseString = xmlhttp.responseText;
          if(responseString === "loggedout") {
            console.log("logged out and must revert html for log in box");
            clearUserInfo();
            window.location="https://localhost:8443/";
          }
      }
    }
    xmlhttp.send();
    console.log("end of func");
}

function headingEntrance() {
    $('.heading').fadeIn(2000);
    $('#underline').delay(400).animate({
        width: '100%',
        opacity: 1
    }, 1500, 'linear');
}

function ticketTypeEntrance() {
    $(this).fadeTo(2000, 1);
    $(this).children('.underline').delay(400).animate({
        width: '50%',
        opacity: 1
    }, 1500, 'linear');
}

function lineHide() {
    $('#underline').css({'width':'0%', 'opacity':'0'});
}

function lineAnimate(){
    $('#underline').delay(200).animate({
        width: '100%',
        opacity: 1
    }, 400, 'linear');
}

function lineRedraw() {
    lineHide();
}


function showHint(e) {
    var target = e.target;
    var entered = target.value;
    var length = entered.length;
    var msg = " too short";
    var hint = target;
    //This will eventually use Jquery to get next div element (some browsers use
    //any white space as a text node, some don't)
    while(hint.nodeName != "div") {
        console.log(hint.nodeName);
        hint = hint.nextSibling;
    }
    // Hypothetical for now, no point saying 'too short' when nothing is entered
    // as that is obvious
    if(length > 0 && length < 6) {
        var attrName = target.getAttribute("name");
        hint.textContent = attrName + msg;
    }
    else {hint.textContent = "";}
}

// Gets rid of any hints from that input field (e.g not long enough)
function clearHint(e) {
    var target = e.target;

    var hint = target;
    while(hint.nodeName != "div") {
        console.log(hint.nodeName);
        hint = hint.nextSibling;
    }
    hint.textContent = "";

}
