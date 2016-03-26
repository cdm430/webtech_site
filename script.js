"use strict";


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }



function start(){
    console.log("Started");
    trooper.addEventListener("click", logoChange);

    var username = document.querySelector('[name="username"]');
    login.addEventListener("blur", showHint, true);
    // Captures not bubbles so set to true
    login.addEventListener("focus", clearHint, true);

}

function logoChange() {
    console.log("Clicked");
    var src = this.getAttribute("src");
    showForm();

    if(src === "images/trooper.svg"){
        this.setAttribute("src", "images/rebel.svg");
    } else {
        this.setAttribute("src", "images/trooper.svg");
    }

}

function showForm() {

    if(login.style.visibility == 'visible')  {
        login.style.visibility = 'hidden';
    }
    else {
        login.style.visibility = 'visible';
    }
    console.log("hovered");
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
