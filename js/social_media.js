 "use strict";

 if(addEventListener) {
     addEventListener("load", start);
 }
 else { attachEvent("onload", start); }

 function start() {
    var twitter = document.querySelector("#twitter");
    twitter.addEventListener("click", start_twitter);
 }

 function start_twitter(){
   var $twitter_logo = $('#twitter-logo');
   !function(d,s,id){
     var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location)?'http':'https';
     if(!d.getElementById(id)){
       js = d.createElement(s);
       js.id = id;js.src = p + "://platform.twitter.com/widgets.js";
       fjs.parentNode.insertBefore(js,fjs);
     }
   }
   (document,"script","twitter-wjs");
   $twitter_logo.on('mouseover', function() {
     console.log("Hover");
     $twitter_logo.animate({
       opacity: 1
     }, 1500, 'linear');
   });
 }
