"use strict";

var canvas, canvasWidth, canvasHeight, rad, seg, scene, camera, ambLight,
    direcLight, renderer, geometry, material, sphere, cloudSphere, cloudMaterial,
    clouds, rendering, spinning = false;

/*
 * Sets up the canvas with the planet on page load. This is concealed by an
 * image of the planet, which is removed once the user clicks "animate"
 */
$(document).ready(function (){
  setup();
  $('.activate').on("click", function() {
     if (spinning === false) {
       spin();
       changeButton();
     }
     else {
       stop();
     }
   });
});


/*
 * Sets up all of the fields of the globe, including the sphere proportions and
 * the various textures that are wrapped around it. The various lighting also
 * generated here
 */
function setup() {
  canvas = document.getElementById('endor-canvas');
  canvasWidth = window.innerWidth / 2;
  canvasHeight = window.innerHeight / 2;
  rad = window.innerWidth / 2550;
  seg = 32;
  scene =         new THREE.Scene();
  camera =        new THREE.PerspectiveCamera(65, canvasWidth/canvasHeight, 0.01, 1000);
  ambLight =      new THREE.AmbientLight(0x333333);

  direcLight =    new THREE.DirectionalLight(0xffffff, 0.75);
  direcLight.position.set( 3, 5, 3 );
  camera.position.z = 1.5;

  renderer =      new THREE.WebGLRenderer({canvas: canvas, alpha: true});
  renderer.setSize(canvasWidth, canvasHeight);

  document.body.appendChild(renderer.domElement);
  geometry =      new THREE.SphereGeometry(rad, seg, seg);
  material =      new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('../images/colour_surface.jpg'),
  bumpMap: THREE.ImageUtils.loadTexture('../images/height_map.png'),
  bumpScale:0.5,
  });

  sphere =        new THREE.Mesh(geometry, material);
  cloudSphere =   new THREE.SphereGeometry(rad + 0.01, seg, seg);
  cloudMaterial = new THREE.MeshPhongMaterial({
  map:          THREE.ImageUtils.loadTexture('../images/clouds.png'),
  transparent:  true
  });

  clouds =        new THREE.Mesh(cloudSphere, cloudMaterial);
  scene.add(ambLight);
  scene.add(direcLight);


  scene.add(sphere);
  scene.add(clouds);
}


/*
 * This function animates the globe and renders it to the screen. It also
 * removes the image of the planet that would be obstructing it
 */
function spin() {
  spinning = true;
  var render = function(){
    rendering = requestAnimationFrame(render);
    sphere.rotation.y += 0.0005;

   clouds.rotation.y -= 0.0003;
   clouds.rotation.x += 0.0003;
   renderer.render(scene, camera);

 };
 render();

 $('#static-endor').remove();
}


/*
 * Allows the user to pause the animation
 */
function stop() {
  spinning = false;
  cancelAnimationFrame(rendering);
  changeButton();
}
