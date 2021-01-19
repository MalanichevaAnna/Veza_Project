import * as THREE from '../lib/three/build/three.module.js';
import { OrbitControls } from '../lib/three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from '../lib/three/examples/jsm/exporters/STLExporter.js';

let group, camera, scene, renderer,texture;

init();
animate();
function createNew_3DObject(data, fileInput){
  group.clear();

  const pointsMaterial = new THREE.PointsMaterial({

    color: 0x0080ff,
    map: texture,
    size: 1,
    alphaTest: 0.5

  });

  const meshMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true
  });

  const meshGeometry = new THREE.Geometry();
  meshGeometry.vertices = data.vertices;
  meshGeometry.faces = data.faces;
  meshGeometry.computeFaceNormals();
  const material = new THREE.MeshPhongMaterial( { color: 0xff5533 } );
  const mesh = new THREE.Mesh( meshGeometry , meshMaterial );
  group.add(mesh);

    let exporter = new STLExporter();
    let formData = new FormData();
    formData.append("stl", new Blob([exporter.parse(mesh)], { type:'text/stl' }));
    $.ajax({
        url: "/Home/ConverFile/",
        type: "POST",
        dataType: "json",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {

        },
        error: function (data) {

        }
    })
  return exporter.parse(mesh);
}

document.getElementById("file").addEventListener("change", function() {
    let fileInput = document.getElementById("file").files[0];
    let reader = new FileReader();

  reader.onload = function () {
    console.log(reader.result);
    let geometryData = JSON.parse(reader.result);

    let vertices = geometryData.vertices;
    let faces = geometryData.faces.map(face => new THREE.Face3(face.a, face.b, face.c));

      var stl = createNew_3DObject({ vertices, faces }, fileInput);

      //downloadTextFile(stl, "object.stl");
     
     
    };
    
  reader.readAsText(fileInput);
});

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(100, 150, 200);
  camera.up = new THREE.Vector3( 0, 0, 1 );
  scene.add(camera);

  // controls

  const controls = new OrbitControls(camera, renderer.domElement);

  // ambient light

  scene.add(new THREE.AmbientLight(0x222222));

  // point light

  const light = new THREE.PointLight(0xffffff, 1);
  camera.add(light);

  // helper

  scene.add(new THREE.AxesHelper(20));

  group = new THREE.Group();
  scene.add(group);

  let tmp = new THREE.DodecahedronGeometry(10);
  let vertices = new THREE.DodecahedronGeometry(10).vertices;

  window.addEventListener('resize', onWindowResize, false);

  const loader = new THREE.TextureLoader();
  texture = loader.load('../lib/textures/sprites/disc.png');

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {

  renderer.render( scene, camera );

}

function downloadTextFile(text, name) {
  const a = document.createElement('a');
  const type = name.split(".").pop();
  a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
  a.download = name;
  a.click();
}