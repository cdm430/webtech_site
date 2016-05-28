"use strict";

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
        window.setTimeout(function() {
            map.panTo(marker.getPosition());
        }, 3000);
    });

    marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });
}
