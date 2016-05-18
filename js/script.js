"use strict";


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }



// !function(d,s,id){
//   var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location)?'http':'https';
//   if(!d.getElementById(id)){
//     js = d.createElement(s);
//     js.id = id;js.src = p + "://platform.twitter.com/widgets.js";
//     fjs.parentNode.insertBefore(js,fjs);
//   }
// }
// (document,"script","twitter-wjs");


function start(){
    console.log("Started");
    var $heading = $('.heading');

    $('#login').hide();
    $heading.hide();
    headingEntrance();


    $('.slider').on('mouseenter', function() {
        console.log("hovered on slider");
        $heading.stop().fadeTo(400, 0);
    })



    $('.slider').on('mouseleave', function(){
        lineHide();
        $heading.stop().fadeTo(400, 1);
        lineAnimate();
    });



    $('#logo').on('click', function() {
        logoChange();
        var $login = $('#login');
        if($login.is(':hidden')) {
            $login.fadeIn(500);
        }
        else {
            $login.fadeOut(500);
        }
    });

    $('.slider').on('mouseover', function() {
        $('#login').fadeOut(500);
        $('#trooper').attr("src", "images/trooper.svg");
    });

    $(window).on('scroll', function() {
        var position = $('#ewok');
        console.log("scroll top is " + $(window).scrollTop());
    });



    // $('#sign-up').on('mouseenter', function() {
    //     // var $button = $('.button');
    //     console.log("flag");
    //     $('#sign-up').delay(400).animate({
    //         width: "50%",
    //         backgroundColor: "white"
    //     }, 1500, 'linear');
    // });
    //
    //
    // $('.button').on('mouseleave', function() {
    //         // $('.button').animate({
    //         //     background-color: 'transparent',
    //         //     color: '#ffffff'
    //         // }, 200, 'linear');
    // });


    var username = document.querySelector('[name="username"]');
    var login = document.querySelector('#login');
    login.addEventListener("blur", showHint, true);
    // Captures not bubbles so set to true
    login.addEventListener("focus", clearHint, true);


}

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

function lineRedraw() {
    lineHide();
}

function logoChange() {
    var $trooper = $('#trooper');
    var src = $trooper.attr("src");
    // showForm();

    if(src === "images/trooper.svg"){
        $trooper.attr("src", "images/rebel.svg");
    } else {
        $trooper.attr("src", "images/trooper.svg");
    }

}

// function showForm() {
//
//     if(login.style.visibility == 'visible')  {
//         login.style.visibility = 'hidden';
//     }
//     else {
//         login.style.visibility = 'visible';
//     }
//     console.log("hovered");
// }

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
