"use strict";


if(addEventListener) {
    addEventListener("load", start);
}
else { attachEvent("onload", start); }

// map = new google.maps.Map(document.getElementById('map'), {
//   center: {lat: -34.397, lng: 150.644},
//   zoom: 8
// });

function initMap() {
        var map;
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
        console.log("hello");
        console.log(map);
        console.log($('#map').css('visibility'));
      }

function start(){
    // initMap();
}
