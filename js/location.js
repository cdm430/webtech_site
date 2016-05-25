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
    var myLatlng = {lat: 41.2146192, lng: -124.0084718};
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatlng,
      zoom: 8
    });

    var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Click to zoom'
    });

    map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
        window.setTimeout(function() {
            map.panTo(marker.getPosition());
        }, 3000);
    });

    marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });


    console.log("hello");
    console.log(map);
    console.log($('#map').css('visibility'));
}

function start(){
    // initMap();
}
