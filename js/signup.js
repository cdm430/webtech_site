"use strict";

$(document).ready(start);


function start() {
    $("#sign-up-form").on("submit", submitSignUp);
}


function submitSignUp(e) {
    e.preventDefault();
    console.log("FLAG");
    if(checkInputs() === true) {
        //var fName = $('#fname').val(), lName = $('#lname').val(), uName = $('#uname').val(),
        //    email = $('#email').val(), pass = $('#pass1').val(), gender = $('#gender').val();
        var details = $('#sign-up-form').serialize();
        console.log("serialised: " + JSON.stringify(details));
        var url = "create-account?" + details;

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
    console.log("flag2");
    var passed = true;
    var inputs = $('.value').not(':input[type=submit]');
    $(inputs).each(function() {
        console.log("value: " + $(this).val());
        if($(this).val() === "") {
            passed = false;
            return;
        }
    });
    if(!$("input[name='gender']:checked").val()) passed = false;
    if(!($('#pass1').val() === $('#pass2').val())) passed = false;
    return passed;
}
