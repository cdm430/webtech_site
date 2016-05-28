"use strict";

$(document).ready(start);

function start() {
    $("#sign-up-form").on("submit", submitSignUp);
}


/*
 * Sumbits the request with all of the user input from the sign up form
 */
function submitSignUp(e) {
    e.preventDefault();
    if(checkInputs() === true) {
        var details = $('#sign-up-form').serialize();
        var url = "create-account?" + details;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var responseString = xmlhttp.responseText;
                if(responseString === "taken") {
                    $('input[name="username"]').val("");
                    $('input[name="username"]').attr('placeholder', 'Username already taken');

                }
            }
        }
        xmlhttp.send();
        window.location="https://localhost:8443/";
    }
    else {
        return;
    }
}


/*
 * Client side validation of the inputs. Checks if any fields are empty, if the
 * passwords match, if a gender has been selected and if the email contains an
 * '@' or a '.' symbol. If any of these fail, then a request is not sent
 * and an error message is displayed in appropriate input box
 */
function checkInputs() {
    var passed = true;
    var inputs = $('.value').not(':input[type=submit]');
    $(inputs).each(function() {
        if($(this).val() === "") {
            passed = false;
            return;
        }
    });
    if(!$("input[name='gender']:checked").val()) passed = false;
    if(!($('#pass1').val() === $('#pass2').val())) {
        $('#pass1, #pass2').val("");
        $('#pass1, #pass2').attr('placeholder', 'Passwords do not match');
        passed = false;
    }
    var email = $('input[name="email"]').val();
    if(email.indexOf('@') == -1 || email.indexOf('.') == -1) {
        $('input[name="email"]').val("");
        $('input[name="email"]').attr('placeholder', 'Invalid email (hello@example.com)');
        passed = false;
    }
    return passed;
}
