
import * as THREE from '../node_modules/three/build/three.module.js';

import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { ConvexBufferGeometry } from '../node_modules/three/examples/jsm/geometries/ConvexGeometry.js';
let group, camera, scene, renderer, data;

init();
animate();

function createNew_3DObject(data = null){
  group.clear();
  //const vertices = new THREE.DodecahedronGeometry( 10 ).vertices;
  let vertices = [];
  if(data !== null){
    for(let i = 0; i < data.length; i++){
      vertices[i] = ( new THREE.Vector3(data[i].x,data[i].y,data[i].z));
    }
  }

  const loader = new THREE.TextureLoader();
  const texture = loader.load( './textures/sprites/disc.png' );
  const pointsMaterial = new THREE.PointsMaterial( {

    color: 0x0080ff,
    map: texture,
    size: 1,
    alphaTest: 0.5

  } );

  const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

  const points = new THREE.Points( pointsGeometry, pointsMaterial );
  group.add( points );

  // convex hull

  const meshMaterial = new THREE.MeshLambertMaterial( {
    color: 0xffffff,
    opacity: 0.5,
    transparent: true
  } );

  const meshGeometry = new ConvexBufferGeometry( vertices );
  let json = meshGeometry.toJSON();

  const mesh1 = new THREE.Mesh( meshGeometry, meshMaterial );
  mesh1.material.side = THREE.BackSide; // back faces
  mesh1.renderOrder = 0;
  group.add( mesh1 );

  const mesh2 = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
  mesh2.material.side = THREE.FrontSide; // front faces
  mesh2.renderOrder = 1;
  group.add( mesh2 );

  window.addEventListener( 'resize', onWindowResize, false );
  render();
  saveData(json);
}

document.getElementById("file").addEventListener("change", function() {
  let fileInput = document.getElementById("file").files[0];
  let fileRead = new FileReader();
  fileRead.onload = function(e) {
    let content = e.target.result;
    data = JSON.parse(content);
    console.log(data);
    createNew_3DObject(data);
    animate();
  };
  fileRead.readAsText(fileInput);
});

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // camera

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 15, 20, 30 );
  scene.add( camera );

  // controls
  const controls = new OrbitControls( camera, renderer.domElement );
  // ambient light

  scene.add( new THREE.AmbientLight( 0x222222 ) );

  // point light

  const light = new THREE.PointLight( 0xffffff, 1 );
  camera.add( light );

  // helper

  scene.add( new THREE.AxesHelper( 20 ) );

  // textures

  group = new THREE.Group();
  scene.add( group );
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

function saveData(data)
{
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  let fileName = new  Date();
  let url = window.URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}