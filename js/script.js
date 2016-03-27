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
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  var ambLight = new THREE.AmbientLight(0x333333);
  var direcLight = new THREE.DirectionalLight(0xffffff, 0.75);

  direcLight.position.set( 3, 5, 3 );
  camera.position.z = 1.5;

  var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
  renderer.setSize(width/2, height/2);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.SphereGeometry(0.75, 32, 32);
  var material = new THREE.MeshPhongMaterial({
    map:          THREE.ImageUtils.loadTexture('../colour_surface.jpg'),
    bumpMap:      THREE.ImageUtils.loadTexture('../height_map.png'),
    bumpScale:    0.5,
  });
  var sphere = new THREE.Mesh(geometry, material);

  var cloudSphere = new THREE.SphereGeometry(0.753, 32, 32);
  var cloudMaterial = new THREE.MeshPhongMaterial({
    map:          THREE.ImageUtils.loadTexture('../clouds.png'),
    transparent:  true
  });
  var clouds = new THREE.Mesh(cloudSphere, cloudMaterial);


  scene.add(ambLight);
  scene.add(direcLight);
  scene.add(sphere);
  scene.add(clouds);

  var render = function(){
    requestAnimationFrame(render);

    sphere.rotation.y += 0.0005;
    clouds.rotation.y -= 0.0003;
    clouds.rotation.x += 0.0003;

    renderer.render(scene, camera);
  };

  render();
}
