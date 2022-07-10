import * as THREE from "three";
import oc from "three-orbit-controls";
import * as dat from "dat.gui";
import gsap from "gsap";
import * as Maker from "./shapeMaker";
import { DNA } from "./dna";

const OrbitControls = oc(THREE);
const canvas = document.querySelector("#synthesizer");
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas,
});
const fov = 25;
const near = 0.1;
const far = 10000;
const canvasContainer = document.getElementById("canvas-container");
let canvasContainerWidth = canvasContainer.offsetWidth;
let canvasContainerHeight = canvasContainer.offsetHeight;
const camera = new THREE.PerspectiveCamera(
  fov, 
  canvasContainerWidth / canvasContainerHeight, 
  near, 
  far
);
const controls = new OrbitControls(camera, renderer.domElement);
let sequence;
controls.enableDamping = true;
const gui = new dat.GUI({
  autoPlace: false,
});

camera.position.z = 240;
const scene = new THREE.Scene();

let shapeName = document.querySelector("#generator_shape").value;
shapeName = shapeName.slice(0, shapeName.indexOf(" (")).toLowerCase();
let chosenShape;
let mesh, lines;
let meshData;
let isGUISet = false;
let guiElements = [];
let dna = new DNA(7249);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4);
camera.add(directionalLight);
scene.add(camera);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);
[mesh, lines] = Maker.makePolyhedron(shapeName);

if (mesh != undefined) {
  scene.add(mesh);
  scene.add(lines);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

function clearGUIElemens() {
  for (let i = 0; i < guiElements.length; i++) {
    gui.remove(guiElements[i]);
  }
  guiElements = [];
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render(time) {

  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  const speed = 0.2;
  const rot = time * speed;

  mesh.rotation.y = rot;
  lines.rotation.y = rot;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}



document.querySelector("#sequenceUpload").onchange = function () {
  let file = this.files[0];
  let reader = new FileReader();
  reader.onload = function (progressEvent) {
    sequence = dna.generateFromFile(this.result);
  };
  reader.readAsText(file);
};

document.querySelector(".synthesizer-btn").onclick = () => {
  let dnaSequence;
  if (document.querySelector("#sequence_checkbox").checked) {
    dnaSequence = dna.generateRandom();
  } else {
    dnaSequence = sequence;
  }
  let dnaPositions = dna.parsePositions();
  let jsonObj = {
    sequence: dnaSequence,
  };
  document.querySelector(".json-input").value = JSON.stringify(jsonObj);
};


document.querySelector("#generator_shape").onclick = () => {
    shapeName = document.querySelector("#generator_shape").value;
    shapeName = shapeName.slice(0, shapeName.indexOf(" (")).toLowerCase();
    scene.remove(mesh, lines);
    [mesh, lines] = Maker.makePolyhedron(shapeName);
    scene.add(mesh);
    scene.add(lines);
}
