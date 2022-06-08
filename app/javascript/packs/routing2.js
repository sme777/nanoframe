import * as THREE from "three";
import oc from "three-orbit-controls";
import DragControls from "three-dragcontrols";
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";


/**
 * Setup DOM elements
 */
const canvas = document.getElementById("router-webgl");
const canvasContainer = document.querySelector(".router-container");
const canvasContainerWidth = canvasContainer.offsetWidth;
const canvasContainerHeight = canvasContainer.offsetHeight;
let insetWidth = canvasContainerWidth / 4;
let insetHeight = canvasContainerHeight / 4;
let currentOffsetGroup;

let t = "";
for (var i = 0; i < staples.data.length; i++) {
  var tr = "<tr>";
  tr += "<td>" + (i + 1) + "</td>";
  tr += "<td>" + staples.data[i].name + "</td>";
  tr += "<td>" + staples.data[i].sequence + "</td>";
  tr += "<td>" + staples.data[i].sequence.length + "</td>";
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
  1000
);

camera.position.set(-40, 60, 90);

camera2.position.copy(camera.position);
camera2.layers.enable( 1 );
camera2.layers.set( 1 );

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
 controls.enableRotate = false;
/**
 * Setup 3D routing object
 */
const linearGroup = new THREE.Group();
const linearRoutingGeometry = new LineGeometry();
linearRoutingGeometry.setPositions(scaffoldPositions.flat());
linearRoutingGeometry.setColors(scaffoldColors.flat());
const linearLine = new Line2(linearRoutingGeometry, matLine);
linearLine.layers.set(1);

linearGroup.add(linearLine);
generateStapleGroup(staples, linearGroup)
new THREE.Box3()
.setFromObject(linearGroup)
.getCenter(linearGroup.position)
.multiplyScalar(-1);
linearGroup.layers.enable(1);

currentOffsetGroup = linearGroup;

scene.add(currentOffsetGroup);

/**
 * Setup plane for highlight
 */
let sidePlanes = [];
for (let i = 0; i < 6; i++) {
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x8190ed, side: THREE.DoubleSide, opacity: 0, transparent: true} );
    const plane2D = new THREE.Mesh(planeGeometry, planeMaterial);
    plane2D.layers.set(1);
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
 * Setup 2D plane grids
 */

Object.assign(THREE.PlaneBufferGeometry.prototype, {
  toGrid: function() {
    let segmentsX = this.parameters.widthSegments || 1;
    let segmentsY = this.parameters.heightSegments || 1;
    let indices = [];
    for (let i = 0; i < segmentsY + 1; i++) {
      let index11 = 0;
      let index12 = 0;
      for (let j = 0; j < segmentsX; j++) {
        index11 = (segmentsX + 1) * i + j;
        index12 = index11 + 1;
        let index21 = index11;
        let index22 = index11 + (segmentsX + 1);
        indices.push(index11, index12);
        if (index22 < ((segmentsX + 1) * (segmentsY + 1) - 1)) {
          indices.push(index21, index22);
        }
      }
      if ((index12 + segmentsX + 1) <= ((segmentsX + 1) * (segmentsY + 1) - 1)) {
        indices.push(index12, index12 + segmentsX + 1);
      }
    }
    this.setIndex(indices);
    return this;
  }
});

let planeGrids = [];
let currentGrid;

const planeGeom = new THREE.PlaneBufferGeometry(dimensions[0], dimensions[1], 50, 50).toGrid();
const gridPlane = new THREE.LineSegments(planeGeom, new THREE.LineBasicMaterial({color: 0x696969}));
gridPlane.quaternion.copy(camera.quaternion);
const maxDistance = Math.max(dimensions[0], dimensions[1]);
camera.fov =  2 * Math.atan( maxDistance / ( 2 * camera.position.distanceTo(gridPlane.position) ) ) * ( 180 / Math.PI );
scene.add(gridPlane)

/**
 * Setup event listeners
 */
window.addEventListener("resize", onWindowResize);
onWindowResize();
 

requestAnimationFrame(render);

// function filterScaffoldPositions(side, type) {

  


//   if (side === "S1") {
//     if (type == "linear") {
//       let vertexArray = [];
//       for (let i = 0; i < linearPoints.length / 3; i += 3) {
//         vertexArray.push([linearPoints[i], linearPoints[i+1], linearPoints[i+2]]);
//       }
//       console.log(vertexArray)
//       console.log(vertexArray.filter(vertex => {
//         console.log(vertex[2] === 0)
//         vertex[2] === 0
//       }))

//     }
//   }
// }

// const planeCross = filterScaffoldPositions("S1", "linear");
// console.log(planeCross);

function generateStapleGroup(staples, group) {
  for (let i = 0; i < staples.data.length; i++) {
    let staplePositions = staples.data[i].positions;
    let stapleColors = [].concat(...Array(staplePositions.length).fill(staples.data[i].color));
    let geometry = new LineGeometry();
    geometry.setPositions(staplePositions.flat());
    geometry.setColors(stapleColors.flat());

    let stapleLine = new Line2(geometry, matLine);

    camera.lookAt(stapleLine.position);

    let stapleGeo = new THREE.BufferGeometry();
    stapleGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(staplePositions, 3)
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
      if (camera2.position.distanceTo(sidePlanes[i].position) < minDist) {
        minDist = camera2.position.distanceTo(sidePlanes[i].position);
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
    // camera2.position.copy(camera.position);
		camera2.quaternion.copy( camera.quaternion );
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