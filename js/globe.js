"use strict";

addEventListener("load", spin);

function spin() {
  var canvas = document.getElementById('endor-canvas');
  var canvasWidth = window.innerWidth / 2;
  var canvasHeight = window.innerHeight / 2;
  var rad = window.innerWidth / 2560;
  var seg = 32;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(65, canvasWidth / canvasHeight, 0.01, 1000);
  var ambLight = new THREE.AmbientLight(0x333333);
  var direcLight = new THREE.DirectionalLight(0xffffff, 0.75);

  direcLight.position.set( 3, 5, 3 );
  camera.position.z = 1.5;

  var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
  renderer.setSize(canvasWidth, canvasHeight);
  document.body.appendChild(renderer.domElement);

  var geometry = new THREE.SphereGeometry(rad, seg, seg);
  var material = new THREE.MeshPhongMaterial({
    map:          THREE.ImageUtils.loadTexture('../images/colour_surface.jpg'),
    bumpMap:      THREE.ImageUtils.loadTexture('../images/height_map.png'),
    bumpScale:    0.5,
  });
  var sphere = new THREE.Mesh(geometry, material);

  var cloudSphere = new THREE.SphereGeometry(rad + 0.01, seg, seg);
  var cloudMaterial = new THREE.MeshPhongMaterial({
    map:          THREE.ImageUtils.loadTexture('../images/clouds.png'),
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
