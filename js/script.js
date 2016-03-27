"use strict";
//NOTE: Haven't got this working yet.
addEventListener("load", start);
// else { attachEvent("onload", start); }

function start(){
    var logo = document.querySelector(".trooper");
    logo.addEventListener("click", logoChange);
}

function logoChange(){
    console.log("Clicked");
    var src = this.getAttribute("src");

    if(src === "images/trooper.svg"){
        this.setAttribute("src", "images/rebel.svg");
    } else {
        this.setAttribute("src", "images/trooper.svg");
    }
}
