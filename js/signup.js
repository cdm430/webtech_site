"use strict";

$(document).ready( function() {
    $(".info").on('submit', submitSignUp);
});


function submitSignUp(e) {
    if(checkInputs() === true) {
        e.preventDefault();
        //var fName = $('#fname').val(), lName = $('#lname').val(), uName = $('#uname').val(),
        //    email = $('#email').val(), pass = $('#pass1').val(), gender = $('#gender').val();
        var details = $('.info').serialize();
        var url = "signup.html" + details;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log("Completed");
            }
        }
        xmlhttp.send();
        console.log("SUCCESS");
    }
    else {
        console.log("FAIL");
        return;
    }
}


function checkInputs() {
    var passed = true;
    var inputs = $('.box').not(':input[type=submit]');
    $(inputs).each(function() {
        console.log("value: " + $(this).val());
        if($(this).val() === "") {
            passed = false;
            return;
        }
    });
    if(!($('#pass1').val() === $('#pass2').val())) {console.log("flag2"); passed = false; };
    return passed;
}