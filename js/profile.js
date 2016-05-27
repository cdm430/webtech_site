"use script";

$(document).ready(start);
var fname, lname, uname, email, gender;


function getUserInfo() {
    var url = "get-user-info";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200) {
            var responseString = xmlhttp.responseText;
            if(responseString === "nf") {
                console.log("Something went wrong. Couldn't retrieve user info");
            }
            else {
                var responseObject = JSON.parse(responseString);
                console.log("response object in getUserInfo " + responseObject);
                fname = responseObject.fname;
                lname = responseObject.lname;
                uname = responseObject.username;
                email = responseObject.email;
                gender = responseObject.gender;
                setUserInfo();
            }
        }
    }
    xmlhttp.send();
}


function setUserInfo() {
    var nameHTML = fname + " " + lname;
    var unameHTML = username;
    var emailHTML = email;
    var genderHTML = gender;

    $('#name').text(nameHTML);
    $('#uname').text(unameHTML);
    $('#email').text(emailHTML);
    $('#gender').text(genderHTML);
}


function clearUserInfo() {
    $('#name').text("");
    $('#uname').text("");
    $('#email').text("");
    $('#gender').text("");
}