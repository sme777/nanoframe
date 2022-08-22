import * as THREE from "three";
import oc from "three-orbit-controls";
import {
  MeshLine,
  MeshLineMaterial
} from 'three.meshline';
import {
  Line2
} from "./threejs/Line2";
import {
  LineMaterial
} from "./threejs/LineMaterial";
import {
  LineGeometry
} from "./threejs/LineGeometry";
import GLTFExporter from 'three-gltf-exporter';


let size = 1;
let visualize = true;
if (generatorSize != null) {
  size = parseInt(generatorSize.value);
  visualize = false;
}
let insetWidth, insetHeight, camera2;
let firstStartPoint, firstEndPoint, lastStartPoint, lastEndPoint;
let id
let canvas, zoomUpdate;
let line0, line1, line4, line5, line6, line7;
let canvasContainer, canvasContainerWidth, canvasContainerHeight;
let routingColors;
let isSplit;
let xGroup1Count, yGroup1Count, zGroup1Count;
let xGroup2Count, yGroup2Count, zGroup2Count;


let linearGroup = new THREE.Group();
linearGroup.name = "Linear";

let splitLinearGroup = new THREE.Group();
splitLinearGroup.name = "Linear Open";


let currentGroup;

let sphereInter;
let matLine = new LineMaterial({
  color: 0xffffff,
  linewidth: 5,
  vertexColors: true,
  dashed: false,
  alphaToCoverage: true,
});

let matLineBasic = new THREE.LineBasicMaterial({
  vertexColors: true,
});
const clock = new THREE.Clock();
const OrbitControls = oc(THREE);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function adjustSplitPosition(points, group) {
  let delta = 15;
  if (group === "group1") {
    for (let i = 0; i < points.length; i += 3) {
      if (xGroup1Count > xGroup2Count) {
        points[i] -= delta;
      } else {
        points[i] += delta;
      }

      if (zGroup1Count > zGroup2Count) {
        points[i + 2] -= delta;
      } else {
        points[i + 2] += delta;
      }
    }
  } else {
    for (let i = 0; i < points.length; i += 3) {
      if (xGroup1Count > xGroup2Count) {
        points[i] += delta;
      } else {
        points[i] -= delta;
      }

      if (zGroup1Count > zGroup2Count) {
        points[i + 2] += delta;
      } else {
        points[i + 2] -= delta;
      }
    }
  }

  return points;
}

function generateDisplay(
  positions,
  colors = colors,
  split = false,
  fullDisplay = true
) {
  if (!fullDisplay) {
    positions = positions.concat(positions).slice(start, end);
    if (!residualEdges) {
      firstStartPoint = positions.slice(0, 3);
      firstEndPoint = positions.slice(-3);
    } else {
      lastStartPoint = positions.slice(0, 3);
      lastEndPoint = positions.slice(-3);
    }
  }

  if (fullDisplay) {
    routingColors = colors;
  } else {
    colors = findColorSequnece(start, positions.length, divisions);
  }

  const geometry = new LineGeometry();
  geometry.setPositions(positions);
  geometry.setColors(colors);

  line0 = new Line2(geometry, matLine);
  if (fullDisplay) {
    let _ = split ? splitLinearGroup.add(line0) : linearGroup.add(line0);
  }
}

function updateDisplay(scene) {
  scene.remove(currentGroup);
  currentGroup = isSplit ? splitLinearGroup : linearGroup;
  scene.add(currentGroup);
}

/**
 *
 * @param {*} start
 * @param {*} length
 * @returns
 */
function findColorSequnece(start, length) {
  let count = 0;
  let modIndex;
  let subarray = [];
  let adjStart = start * 12 * 3;
  for (let i = adjStart; count < length; i++, count++) {
    modIndex = i % routingColors.length;
    subarray.push(routingColors[modIndex]);
  }
  return subarray;
}


function findBorderPointCount(positions) {
  let xCountFront = 0;
  let yCountFront = 0;
  let zCountFront = 0;
  let xCountBack = 0;
  let yCountBack = 0;
  let zCountBack = 0;

  for (let i = 0; i < positions.length; i++) {
    if (positions[i][0] == 0) {
      xCountFront += 1;
    } else if (positions[i][0] == 50) {
      xCountBack += 1;
    } else if (positions[i][1] == 0) {
      yCountBack += 1;
    } else if (positions[i][1] == 50) {
      yCountFront += 1;
    } else if (positions[i][2] == 0) {
      zCountBack += 1;
    } else if (positions[i][2] == -50) {
      zCountFront += 1;
    }
  }
  return [xCountFront - xCountBack, yCountFront - yCountBack, zCountFront - zCountBack];
}


function connectEnds(start, end, elevation) {
  let middle = (new THREE.Vector3()).addVectors(start, end).divideScalar(2);
  let firstControlPoint = (new THREE.Vector3()).addVectors(start, middle).divideScalar(2).add(new THREE.Vector3(0, elevation, 0));
  let secondControlPoint = (new THREE.Vector3()).addVectors(middle, end).divideScalar(2).add(new THREE.Vector3(0, elevation, 0));
  const curve = new THREE.CubicBezierCurve3(
    start,
    firstControlPoint,
    secondControlPoint,
    end
  );
  const line = new MeshLine();
  const material = new MeshLineMaterial({
    color: new THREE.Color(0xFFC54D),
    resolution: new THREE.Vector2(canvasContainerWidth, canvasContainerHeight)
  });
  line.setPoints(curve.getPoints(49), p => 0.8);
  return new THREE.Mesh(line, material);
}

for (let i = 0; i < size; i++) {
  if (!visualize) {
    id = document.getElementById("index-" + i.toString()).value;
    canvas = document.getElementById("webgl-public-" + id);
  } else {
    canvas = document.getElementById("visualize-webgl");
  }
}


canvasContainer = document.querySelector(".canvas-container");
canvasContainerWidth = canvasContainer.offsetWidth;
canvasContainerHeight = canvasContainer.offsetHeight;

let renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  40,
  canvasContainerWidth / canvasContainerHeight,
  1,
  1000
);
camera.position.set(-40, 60, 90);
if (visualize) {
  camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000);
  camera2.position.copy(camera.position);
}

let doublePoints = scaffoldPositions.concat(scaffoldPositions);
let doubleColors = scaffoldColors.concat(scaffoldColors);
generateDisplay(scaffoldPositions.flat(), scaffoldColors.flat());

let group1LinearPoints = doublePoints.slice(start, end);
let group2LinearPoints = doublePoints.slice(end, scaffoldPositions.length + start);
[xGroup1Count, yGroup1Count, zGroup1Count] = findBorderPointCount(group1LinearPoints);
[xGroup2Count, yGroup2Count, zGroup2Count] = findBorderPointCount(group2LinearPoints);
group1LinearPoints = adjustSplitPosition(group1LinearPoints.flat(), "group1");
group2LinearPoints = adjustSplitPosition(group2LinearPoints.flat(), "group2");
generateDisplay(group1LinearPoints, doubleColors.slice(start, end).flat(), "group1");
generateDisplay(group2LinearPoints, doubleColors.slice(end, scaffoldPositions.length + start).flat(), "group2");

new THREE.Box3()
  .setFromObject(splitLinearGroup)
  .getCenter(splitLinearGroup.position)
  .multiplyScalar(-1);

const startVec1 = new THREE.Vector3(group1LinearPoints[0], group1LinearPoints[1], group1LinearPoints[2]);
const endVec1 = new THREE.Vector3(group2LinearPoints[group2LinearPoints.length - 3], group2LinearPoints[group2LinearPoints.length - 2], group2LinearPoints[group2LinearPoints.length - 1]);
const connectionLine1 = connectEnds(startVec1, endVec1, 10);

const startVec2 = new THREE.Vector3(group1LinearPoints[group1LinearPoints.length - 3], group1LinearPoints[group1LinearPoints.length - 2], group1LinearPoints[group1LinearPoints.length - 1]);
const endVec2 = new THREE.Vector3(group2LinearPoints[0], group2LinearPoints[1], group2LinearPoints[2]);
const connectionLine2 = connectEnds(startVec2, endVec2, 10);

splitLinearGroup.add(connectionLine1);
splitLinearGroup.add(connectionLine2);



let stapleLinearGroup = new THREE.Group();
stapleLinearGroup.visible = false;

generateStapleGroup(staples, stapleLinearGroup);

linearGroup.add(stapleLinearGroup);
new THREE.Box3()
  .setFromObject(linearGroup)
  .getCenter(linearGroup.position)
  .multiplyScalar(-1);
currentGroup = linearGroup;
scene.add(currentGroup);

// const cubeMat = new THREE.MeshLambertMaterial( {color: 0xC0C0C0} )

// const cubeGeo = new THREE.BoxGeometry(45, 45, 45)
// const meshCube = new THREE.Mesh(cubeGeo, cubeMat)
// scene.add(meshCube)
// const cubeLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(cubeLight);
// cubeLight.target = meshCube;
// cubeLight.position.set(1, 2, 4)

let controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 5000;
controls.enableZoom = false;

window.addEventListener("resize", onWindowResize);
canvas.addEventListener("wheel", onZoom);
document.addEventListener("pointermove", onPointerMove);
onWindowResize();

const sphereGeometry = new THREE.SphereGeometry(
  controls.target.distanceTo(controls.object.position) * 0.005
);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000
});

sphereInter = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereInter.visible = false;
scene.add(sphereInter);
let sidePlanes = [];

/**
 * Setup plane for highlight
 */
for (let i = 0; i < 6; i++) {
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x8190ed,
    side: THREE.DoubleSide,
    opacity: 0,
    transparent: true
  });
  const plane2D = new THREE.Mesh(planeGeometry, planeMaterial);
  if (i - 3 > 0) {
    planeGeometry.rotateY(Math.PI / 2);
    if (i % 2 == 0) {
      plane2D.position.x -= 25;
      plane2D.name = "S5";
    } else {
      plane2D.position.x += 25;
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

requestAnimationFrame(render);


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

function onZoom(event) {
  zoomUpdate = true;
}

function onPointerMove(e) {

  const rect = e.target.getBoundingClientRect();
  const x = ((e.clientX) / window.innerWidth) * 2 - 1;
  const y = -((e.clientY) / window.innerHeight) * 2 + 1;
  mouse.x = x
  mouse.y = y
}

function onWindowResize() {
  camera.aspect = canvasContainerWidth / canvasContainerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasContainerWidth, canvasContainerHeight);

  if (visualize) {
    insetWidth = canvasContainerHeight / 4;
    insetHeight = canvasContainerHeight / 4;
    camera2.aspect = insetWidth / insetHeight;
    camera2.updateProjectionMatrix(line1);
  }
}

function findIndex(pos) {
  let min = Infinity;
  let idx = null;
  for (let i = 0; i < scaffoldPositions.length; i += 1) {
    let temp =
      Math.abs(pos.x - scaffoldPositions[i][0]) +
      Math.abs(pos.y - scaffoldPositions[i][1]) +
      Math.abs(pos.z - scaffoldPositions[i][2]);
    if (temp < min) {
      min = temp;
      idx = Math.floor(i);
    }
  }
  return idx;
}

function render() {
  renderer.setClearColor(0x000000, 0);
  renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);
  matLine.resolution.set(canvasContainerWidth, canvasContainerHeight);
  let minDist = Infinity;
  let minDistPlane = null;
  for (let i = 0; i < sidePlanes.length; i++) {
    if (camera.position.distanceTo(sidePlanes[i].position) < minDist) {
      minDist = camera.position.distanceTo(sidePlanes[i].position);
      minDistPlane = sidePlanes[i].name;
    }
  }

  document.querySelector("#shape_side_info").value = minDistPlane;

  renderer.render(scene, camera);

  if (visualize) {
    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObject(currentGroup, true);

    if (intersections.length > 0) {
      if (zoomUpdate) {
        sphereInter.geometry.dispose()
        sphereInter.geometry = new THREE.SphereGeometry(
          controls.target.distanceTo(controls.object.position) * 0.005
        );
        zoomUpdate = false;
      }
      sphereInter.visible = true;
      sphereInter.position.copy(intersections[0].point);
      const line = intersections[0].object;
      const idx = findIndex(intersections[0].point);
      if (idx != null) {
        document.querySelector("#sequence_base_info").value = scaffold[idx];
        document.querySelector("#sequence_id_info").value = idx;
      }
    } else {
      sphereInter.visible = false;
    }

    renderer.setClearColor(0xf5f5f5, 1);
    renderer.clearDepth();
    renderer.setScissorTest(true);
    renderer.setScissor(20, 20, insetWidth, insetHeight);
    renderer.setViewport(20, 20, insetWidth, insetHeight);
    camera2.position.copy(camera.position);
    camera2.quaternion.copy(camera.quaternion);
    matLine.resolution.set(insetWidth, insetHeight);
    renderer.render(scene, camera2);
    renderer.setScissorTest(false);
  }

  requestAnimationFrame(render);
}
if (visualize) {
  const box = document.getElementById("box-state");
  const stapleToggler = document.getElementById("box-state-staples");

  box.addEventListener("click", (e) => {
    if (box.innerHTML === "Open Form") {
      box.innerHTML = "Closed Form";
      scene.remove(currentGroup);
      isSplit = true;
      currentGroup = splitLinearGroup;
      scene.add(currentGroup)

    } else {
      box.innerHTML = "Open Form";
      isSplit = false;
      scene.remove(currentGroup);
      currentGroup = linearGroup;
      scene.add(currentGroup);
    }
  });

  stapleToggler.addEventListener("click", () => {
    if (box.innerHTML === "Show Staples") {
      stapleToggler.innerHTML = "Hide Staples";
    } else {
      stapleToggler.innerHTML = "Show Staples";
    }
    stapleLinearGroup.visible = !stapleLinearGroup.visible;
  });

}


document.querySelector("#gltf_export").addEventListener("click", () => {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    function (result) {

      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, 'scene.glb');
      } else {
        const output = JSON.stringify(result, null, 2);
        saveString(output, 'scene.gltf');

      }

    },
    function (error) {
      console.log('An error happened during parsing', error);
    },
  );
})


function saveArrayBuffer(text, filename) {
  save(new Blob([buffer], {
    type: 'application/octet-stream'
  }), filename);
}

function saveString(text, filename) {
  save(new Blob([text], {
    type: 'text/plain'
  }), filename);
}

function save(blob, filename) {
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}