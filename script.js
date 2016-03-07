"use strict";

addEventListener("load", start);
// else { attachEvent("onload", start); }

function start(){

    var logo = document.querySelector("#trooper");
    logo.addEventListener("click", logoChange);

    var text = document.querySelector(".main-text");
    text.addEventListener("click", logoChange);
}

function logoChange(){
    console.log("Clicked");
    var src = this.getAttribute("data");

    if(src === "images/trooper.svg"){
        this.setAttribute("data", "images/rebel.svg");
    } else {
        this.setAttribute("data", "images/trooper.svg");
    }
}
