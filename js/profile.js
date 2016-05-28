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
    $('.button-outfit').off().on('click', logoChange);
}


/*
 * Sends the server request that retrieves the user's information from the
 * database. This information is then used to fill in the fields on the
 * profile page
 */
function getUserInfo() {
    var url = "get-user-info";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200) {
            var responseString = xmlhttp.responseText;
            if(responseString === "nf") {
                console.log("Couldn't retrieve user info");
            }
            else {
                var responseObject = JSON.parse(responseString);
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


/*
 * Uses the information obtained from the database for a particular user to
 * fill in the various sections on the profile page.
 */
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
    $('.button-outfit').off().on('click', seeCostumeInfo);
}


/*
 * Fills out the user's costume information, based on their genderHTML
 */
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


/*
 * Creates a drop down menu displayiong the user's costume information
 */
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
