"use strict";

$(document).ready(start);

var username;

/*
 * Calls all of the initial functions and sets up the necessary listeners
 */
function start(){
    $('#trooperbox').hide();
    $('.heading').hide();
    headingEntrance();
    checkLoggedIn();
    addLogInListener();

    $('.slider').on('mouseenter', removeHeading);
    $('.slider').on('mouseleave', slide);
    $('#logo').on('click', logoChange);
    $('.slider').on('mouseover', refreshLogo);
}


/*
 * Changes the login logo when clicked and opens the log in box
 */
function logoChange() {
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


/*
 * Checks if the user is logged in by sending a server request that can then check the
 * session id against the map containing sessionid:userid. If the user is logged in,
 * then depending on the current page, the page is changed. The log in box is also
 * changed to display the log out button and the user's username.
 */
function checkLoggedIn() {
    var url = "loggedin";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);

    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
          var responseString = xmlhttp.responseText;
          if(responseString === "nf") {
              console.log("No user logged in");
              return;
          }
          else {
            username = responseString;
            changeLoginBox();
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


/*
 * Change the log in box on log in to display the username, the "view profile" button
 * and the "log out" button
 */
function changeLoginBox() {
    var newContent = "<div id='login'> <span id='username-word'>Hi,    " +
        username + "</span><a href='profile.html' class='button' " +
        "id='profilebutton'>Profile" +
        "</a><button class='button' id='logoutbutton'>Log Out</button>"
         + "</div>";

    $('#trooperbox').html(newContent);

    $('#logoutbutton').on('click', logOut);
}


/*
 * If the username/password combination are incorrect, then a prompt is displayed to
 * the user
 */
function showWrongLoginHint() {
    $('#username, #password').val("");
    $('#username').attr('placeholder', 'Invalid username or password');
    $('#username').addClass('invalid');

    $('#username, #password').on("click", function() {
        $('#username').removeClass('invalid');
        $('#username').attr('placeholder', 'Username');
    });
}


/*
 * Adds a log in listener to the "submit" button in the log in box. This sends a request
 * to the server to determine if the user is able to log in
 */
function addLogInListener() {
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
                    console.log(responseString);
                    showWrongLoginHint();
                    return;
                }
                else {
                    username = responseString;
                    checkLoggedIn();
                }
            }
        }
        xmlhttp.send();
    });
}


/*
 * Sends a request to the server to delete the user's sessionid;
 */
function logOut() {
    var url = "logout";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);

    xmlhttp.onreadystatechange = function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
          var responseString = xmlhttp.responseText;
          if(responseString === "loggedout") {
            window.location="https://localhost:8443/";
          }
      }
    }
    xmlhttp.send();
}


/*
 * Fades the header in and animates a line under the header.
 */
function headingEntrance() {
    $('.heading').fadeIn(2000);
    $('#underline').delay(400).animate({
        width: '100%',
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


function removeHeading() {
    $('.heading').stop().fadeTo(400, 0);
}


/*
 * Slides out the menu bar and hides the heading.
 */
function slide() {
    lineHide();
    $('.heading').stop().fadeTo(400, 1);
    lineAnimate();
}


/*
 * Hides the log in box and returns the logo to the original image when the menu is
 * hovered over
 */
function refreshLogo() {
    $('#trooperbox').fadeOut(500);
    $('#trooper').attr("src", "images/trooper.svg");
}