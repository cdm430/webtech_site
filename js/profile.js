"use script";

$(document).ready(start);
var fname, lname, uname, email, gender;
var costume = [
    {"head" : "Helmet: brown",
    "torso" : "Tee-shirt: white + coat: camo",
    "legs" : "Trousers: camo",
    "feet" : "Boots: black"},
    {"head" : "Helmet: green",
    "torso" : "Poncho: camo",
    "legs" : "trousers: white",
    "feet" : "Boots: black"}
];

function start() {
    previewFile();
}


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

function addCostumeListener() {
    $('.button-outfit').on('click', seeCostumeInfo);
}

function addCostumeInfo() {
    var index;
    if(gender === "Male") index = 0;
    else index = 1;

    var head = costume[index].head;
    var torso = costume[index].torso;
    var legs = costume[index].legs;
    var feet = costume[index].feet;

    $('#head').text(head);
    $('#torso').text(torso);
    $('#legs').text(legs);
    $('#feet').text(feet);
}


function clearUserInfo() {
    $('.box').each(function() {
        $(this).text("")
    });
    $('.costume-box').each(function() {
        $(this).text("");
    });
    fname = null;
    lname = null;
    uname = null;
    email = null;
    gender = null;
}


function previewFile(){
    var preview = document.querySelector('#new-pic'); //selects the query named img
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}


function seeCostumeInfo() {
    var $costumeInfo = $('.costume-container');
    var newOpacity;
    var newHeight;
    if($costumeInfo.css('opacity') == 0) {
        newOpacity = 1;
        newHeight = '15em';
        $('#costume-arrow').addClass('rotation');
        addCostumeInfo();
    }
    else {
        newOpacity = 0;
        newHeight = '0em';
        $('#costume-arrow').removeClass('rotation');
    }
    $costumeInfo.animate({
        height: newHeight,
        opacity: newOpacity
    }, 500, 'linear');
}
