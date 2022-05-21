import * as THREE from "three";
import oc from "three-orbit-controls";
import DragControls from "three-dragcontrols";
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

/**
 * Setup variables from the backend
 */
const linearPoints = graphJSON["linear_points"];
const interpolatedPoints = graphJSON["interpolated_points"];
const scaffoldPallete = graphJSON["colors"];
const staplesColors = graphJSON["staple_colors"];


/**
 * Setup DOM elements
 */
const canvas = document.getElementById("router-webgl");
const canvasContainer = document.querySelector(".router-container");
const canvasContainerWidth = canvasContainer.offsetWidth;
const canvasContainerHeight = canvasContainer.offsetHeight;
let insetWidth = canvasContainerWidth / 4;
let insetHeight = canvasContainerHeight / 4;

let t = "";
for (var i = 0; i < staples.names.length; i++) {
  var tr = "<tr>";
  tr += "<td>" + (i + 1) + "</td>";
  tr += "<td>" + staples.names[i] + "</td>";
  tr += "<td>" + staples.sequences[i] + "</td>";
  tr += "<td>" + staples.sequences[i].length + "</td>";
  tr += "</tr>";
  t += tr;
}

document.getElementById("staples_table").innerHTML += t;

/**
 * Setup THREE materials
 */
const matLineBasic = new THREE.LineBasicMaterial({
    vertexColors: true,
});

const matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 5,
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true
});

/**
 * Setup THREE variables
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    70, 
    canvasContainerWidth / canvasContainerHeight,
    0.01,
    8000
);

const camera2 = new THREE.PerspectiveCamera(
    40, 
    1, 
    1,
    2000
);
camera.position.set(-40, 60, 90);
camera2.position.set(
    camera.position.x,
    camera.position.y + 200,
    camera.position.z
)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);

scene.add(camera);

/**
 * Setup THREE controls
 */

 const OrbitControls = oc(THREE);
 const controls = new OrbitControls(camera, renderer.domElement);
 controls.minDistance = 10;
 controls.maxDistance = 5000;

/**
 * Setup 3D routing object
 */
const linearGroup = new THREE.Group();
const linearRoutingGeometry = new LineGeometry();
linearRoutingGeometry.setPositions(linearPoints);
linearRoutingGeometry.setColors(scaffoldPallete);
const linearLine = new Line2(linearRoutingGeometry, matLine);
linearGroup.add(linearLine);
generateStapleGroup(staples.linear, linearGroup)
new THREE.Box3()
.setFromObject(linearGroup)
.getCenter(linearGroup.position)
.multiplyScalar(-1);


const interpolatedGroup = new THREE.Group();
const interpolatedRoutingGeometry = new LineGeometry();
interpolatedRoutingGeometry.setPositions(interpolatedPoints);
interpolatedRoutingGeometry.setColors(scaffoldPallete);
const interpolatedLine = new Line2(interpolatedRoutingGeometry, matLine);
interpolatedGroup.add(interpolatedLine);
generateStapleGroup(staples.interpolated, interpolatedGroup)
new THREE.Box3()
.setFromObject(interpolatedGroup)
.getCenter(interpolatedGroup.position)
.multiplyScalar(-1);

scene.add(linearGroup);

/**
 * Setup plane for highlight
 */
let sidePlanes = [];
for (let i = 0; i < 6; i++) {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x8190ed, side: THREE.DoubleSide, opacity: 0, transparent: true} );
    const plane2D = new THREE.Mesh(planeGeometry, planeMaterial);
    if (i - 3 > 0) {
        planeGeometry.rotateY(Math.PI / 2);
        if (i % 2 == 0) {
        plane2D.position.x += 25;
        plane2D.name = "S5";
        } else {
        plane2D.position.x -= 25;
        plane2D.name = "S6";
        }
        
    } else if (i - 1 > 0) {
        planeGeometry.rotateX(Math.PI / 2);
        if (i % 2 == 0) {
        plane2D.position.y += 25;
        plane2D.name = "S3";
        } else {
        plane2D.position.y -= 25;
        plane2D.name = "S4";
        }
    } else {
        if (i % 2 == 0) {
        plane2D.position.z += 25;
        plane2D.name = "S1";
        } else {
        plane2D.position.z -= 25;
        plane2D.name = "S2";
        }
}
sidePlanes.push(plane2D);
scene.add(plane2D);
}




/**
 * Setup event listeners
 */
window.addEventListener("resize", onWindowResize);
onWindowResize();
 

requestAnimationFrame(render);

function generateStapleGroup(staples, group) {
    let pointer = 0
    for (let i = 0; i < staples.length; i++) {
      if (pointer > staplesColors.length) continue; // TODO fix for interpolated
      let staplePoints = staples[i];
      let stapleColors = staplesColors.slice(pointer, pointer + staples[i].length); //Array(staples[i].length).fill(0);
      
      pointer += staples[i].length;
      let geometry = new LineGeometry();
      geometry.setPositions(staplePoints);
      geometry.setColors(stapleColors);

      let stapleLine = new Line2(geometry, matLine);

      camera.lookAt(stapleLine.position);

      let stapleGeo = new THREE.BufferGeometry();
      stapleGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(staplePoints, 3)
      );
      stapleGeo.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(stapleColors, 3)
      );
      group.add(stapleLine);
    }
  }


function render() {
    renderer.setClearColor(0x000000, 0);
    renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);

    matLine.resolution.set(canvasContainerWidth, canvasContainerHeight);
    
    let minDist = Infinity;
    let minDistPlane = null;
    for (let i = 0; i < sidePlanes.length; i++) {
      sidePlanes[i].material.opacity = 0;
      if (camera.position.distanceTo(sidePlanes[i].position) < minDist) {
        minDist = camera.position.distanceTo(sidePlanes[i].position);
        minDistPlane = sidePlanes[i];
      }
    }

    minDistPlane.material.opacity = 0.5;
    
    renderer.render(scene, camera);


    /**
     * Render the Inset Viewport
     */
    renderer.setClearColor(0xf5f5f5, 1);
    renderer.clearDepth();
    renderer.setScissorTest(true);
    renderer.setScissor(20, 20, insetWidth, insetHeight);
    renderer.setViewport(20, 20, insetWidth, insetHeight);
    renderer.render(scene, camera2);
    renderer.setScissorTest(false);

    requestAnimationFrame(render);
}

function onWindowResize() {
    camera.aspect = canvasContainerWidth / canvasContainerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainerWidth, canvasContainerHeight);
    insetWidth = canvasContainerHeight / 4;
    insetHeight = canvasContainerHeight / 4;
    camera2.aspect = insetWidth / insetHeight;
    camera2.updateProjectionMatrix(linearGroup);
}