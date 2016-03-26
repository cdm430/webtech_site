"use strict";
//NOTE: Haven't got this working yet.
addEventListener("load", start);
// else { attachEvent("onload", start); }

function start(){
    spin();
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

function spin() {
  var canvas = document.getElementById('endor-canvas');
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth/3, window.innerWidth/3);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.BoxGeometry(3, 3, 3);
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00});
  var cube = new THREE.Mesh(geometry, material);

  camera.position.z = 5;
  scene.add(cube);

  var render = function(){
    requestAnimationFrame(render);

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
  };

  render();
}
