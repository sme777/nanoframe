import * as THREE from "three";
import oc from "three-orbit-controls";
import * as dat from "dat.gui";
import gsap from "gsap";
import * as Maker from "./shapeMaker";
import { DNA } from "./dna";
import * as Data from "./shapeData";

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

const shape = document.getElementById("generator_shape_id");
let chosenShape;
let mesh;
let meshData;
let isGUISet = false;
let guiElements = [];
let dna = new DNA(7249);
// const geometry = new THREE.BufferGeometry().setFromPoints(dna.positions);
// const material = new THREE.LineBasicMaterial({
//   color: 0xff0000,
// });
// const curveObject = new THREE.Line(geometry, material);
// const axesHelper = new THREE.AxesHelper(15);
// scene.add(axesHelper);


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);

mesh = Maker.makeCube();


if (mesh != undefined) {
  scene.add(mesh);
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
  if (document.querySelector("#sequenceCheckbox").checked) {
    dnaSequence = dna.generateRandom();
  } else {
    dnaSequence = sequence;
  }
  let dnaPositions = dna.parsePositions();
  let jsonObj = {
    sequence: dnaSequence,
  };
  //console.log(jsonObj)
  document.querySelector(".json-input").value = JSON.stringify(jsonObj);
};
