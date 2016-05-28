"use strict";

/*
 * This script deals solely with the google maps api to display the location
 * on the event page. The code was all found from the google API site
 */

function initMap() {
    // Sets the location and places a marker at Redwood Forect, CA
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

    // Pans back to the loction if moved away from it for 3 seconds
    map.addListener('center_changed', function() {
        window.setTimeout(function() {
            map.panTo(marker.getPosition());
        }, 3000);
    });

    // Zooms in on location when the marker is clicked
    marker.addListener('click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });
}
