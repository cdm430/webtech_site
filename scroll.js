"use strict";

if (addEventListener) addEventListener("click", start);
else attachEvent("onload", start);



function start() {
    console.log("Hello Worldssss!");
//    var x = 2;
//    var y = 5;
//    var p = x + y;
//    console.log(p);
    var main = document.querySelector(".main-text");
    main.addEventListener("click", makeGreen.bind(main));
}

function makeGreen(event) {
    style.color = "green";
}
