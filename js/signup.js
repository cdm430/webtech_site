"use strict"

$(document).on("ready", start);

function start() {
    $("#submit").on("click", submitSignUp);
}


function submitSignUp() {
    if(checkInputs) {
        //var fName = $('#fname').val(), lName = $('#lname').val(), uName = $('#uname').val(),
        //    email = $('#email').val(), pass = $('#pass1').val(), gender = $('#gender').val();
        var details = $('.info').serialize();
        var url = "signup?" + details;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                console.log("Completed");
            }
    }
    else {
        console.log("FAIL");
        return;
    }
}


function checkInputs() {
    $(':input').each(function() {
        if($(this).val === "") return false;
    });
    if($('#pass1') !== $('#pass2')) return false;
    return true;
}