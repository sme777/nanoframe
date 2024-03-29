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


let insetWidth, insetHeight;
let zoomUpdate;
let isSplit;
let line0, line1;
let xGroup1Count, yGroup1Count, zGroup1Count;
let xGroup2Count, yGroup2Count, zGroup2Count;
let sceneObjects = {};

let currentAddedParticle = "";

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

const canvas = document.getElementById("visualize-webgl");
const canvasContainer = document.querySelector(".canvas-container");
let canvasContainerWidth = canvasContainer.clientWidth;
let canvasContainerHeight = canvasContainer.clientHeight;
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  canvasContainerWidth / canvasContainerHeight,
  0.1,
  10000
);
const OrbitControls = oc(THREE);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);
camera.position.set(-40, 60, 90);
camera.name = "sceneMainCamera";
const camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000);
camera2.position.copy(camera.position);
const camera3 = new THREE.PerspectiveCamera(40, 1, 1, 1000);
camera3.position.z += 30;
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
  split = false
) {
  const geometry = new LineGeometry();
  geometry.setPositions(positions);
  geometry.setColors(colors);

  line0 = new Line2(geometry, matLine);
  split ? splitLinearGroup.add(line0) : linearGroup.add(line0);
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

function onWindowResize() {
  camera.aspect = canvasContainerWidth / canvasContainerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasContainerWidth, canvasContainerHeight);
  insetWidth = canvasContainerHeight / 4;
  insetHeight = canvasContainerHeight / 4;
  camera2.aspect = insetWidth / insetHeight;
  camera2.updateProjectionMatrix(line1);
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

  // Zoomed out of version of wireframe
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

  // Plane specific routing
  renderer.setClearColor(0xf5f5f5, 1);
  renderer.clearDepth();
  renderer.setScissorTest(true);
  renderer.setScissor(20, canvas.clientHeight * 0.7, insetWidth, insetHeight);
  renderer.setViewport(20, canvas.clientHeight * 0.7, insetWidth, insetHeight);
  // camera3.position
  renderer.render(scene, camera3);
  renderer.setScissorTest(false);

  requestAnimationFrame(render);
}

const box = document.getElementById("box-state");
const stapleToggler = document.getElementById("box-state-staples");
const zoomToggler = document.getElementById("box-state-zoom");
const tableToggler = document.getElementById("box-stable-table");
const particleToggler = document.getElementById("box-state-add-particle");
const particleShape = document.getElementById("add-particle-shape");
const addParticleButton = document.getElementById("add-particle-btn")
const closeAddParticleButton = document.getElementById("close-icon-wrapper")

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
  if (stapleToggler.innerHTML === "Show Staples") {
    stapleToggler.innerHTML = "Hide Staples";
  } else {
    stapleToggler.innerHTML = "Show Staples";
  }
  stapleLinearGroup.visible = !stapleLinearGroup.visible;
});

zoomToggler.addEventListener("click", () => {
  if (controls.enableZoom) {
    zoomToggler.innerHTML = "Enable Zoom";
  } else {
    zoomToggler.innerHTML = "Disable Zoom";
  }
  controls.enableZoom = !controls.enableZoom;
});

tableToggler.addEventListener("click", () => {
  if (tableToggler.innerHTML === "View Sequence Table") {
    tableToggler.innerHTML = "Hide Sequence Table"
  } else {
    tableToggler.innerHTML = "View Sequence Table"
  }
});

particleToggler.addEventListener("click", () => {
  console.log(particleToggler.innerHTML)
  if (particleToggler.innerHTML === "Add Particle") {
    document.querySelector(".add-particle-container").style.display = "block";
    document.querySelector('.add-particle-container').setAttribute("style", "display:block");
  } else {
    let [shapeMesh, shapeLight] = sceneObjects[currentAddedParticle];
    scene.remove(scene.getObjectByName(camera.name));
    camera.children = camera.children.filter(obj => obj.name != shapeLight.name);
    scene.add(camera);
    scene.remove(scene.getObjectByName(shapeMesh.name));
    particleToggler.innerHTML = "Add Particle"
  }

});

if (particleShape.value === "cube") {
  document.querySelector(".radius-group").style.display = "none";
  document.querySelector('.radius-group').setAttribute("style", "display:none");

  document.querySelector(".width-group").style.display = "flex";
  document.querySelector('.width-group').setAttribute("style", "display:flex");
  document.querySelector(".height-group").style.display = "flex";
  document.querySelector('.height-group').setAttribute("style", "display:flex");
  document.querySelector(".depth-group").style.display = "flex";
  document.querySelector('.depth-group').setAttribute("style", "display:flex");

} else {
  document.querySelector(".radius-group").style.display = "flex";
  document.querySelector('.radius-group').setAttribute("style", "display:flex");

  document.querySelector(".width-group").style.display = "none";
  document.querySelector('.width-group').setAttribute("style", "display:none");
  document.querySelector(".height-group").style.display = "none";
  document.querySelector('.height-group').setAttribute("style", "display:none");
  document.querySelector(".depth-group").style.display = "none";
  document.querySelector('.depth-group').setAttribute("style", "display:none");

}

particleShape.addEventListener("click", () => {
  if (particleShape.value === "cube") {
    document.querySelector(".radius-group").style.display = "none";
    document.querySelector('.radius-group').setAttribute("style", "display:none");

    document.querySelector(".width-group").style.display = "flex";
    document.querySelector('.width-group').setAttribute("style", "display:flex");
    document.querySelector(".height-group").style.display = "flex";
    document.querySelector('.height-group').setAttribute("style", "display:flex");
    document.querySelector(".depth-group").style.display = "flex";
    document.querySelector('.depth-group').setAttribute("style", "display:flex");

  } else {
    document.querySelector(".radius-group").style.display = "flex";
    document.querySelector('.radius-group').setAttribute("style", "display:flex");

    document.querySelector(".width-group").style.display = "none";
    document.querySelector('.width-group').setAttribute("style", "display:none");
    document.querySelector(".height-group").style.display = "none";
    document.querySelector('.height-group').setAttribute("style", "display:none");
    document.querySelector(".depth-group").style.display = "none";
    document.querySelector('.depth-group').setAttribute("style", "display:none");

  }
});

addParticleButton.addEventListener("click", () => {

  if (particleShape.value === "cube") {
    const widthValue = document.querySelector('.width-field').value;
    const heightValue = document.querySelector('.height-field').value;
    const depthValue = document.querySelector('.depth-field').value;
    const shapeGeometry = new THREE.BoxGeometry(widthValue, heightValue, depthValue);
    const shapeMaterial = new THREE.MeshPhongMaterial({
      color: 0xF57328,
      side: THREE.DoubleSide
    });
    const shapeLight = new THREE.DirectionalLight(0xffffff, 0.8);
    const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shapeMesh.name = "cubeMesh";
    shapeLight.name = "cubeLight"
    currentAddedParticle = "cube";
    sceneObjects[currentAddedParticle] = [shapeMesh, shapeLight];
    scene.remove(camera)
    camera.add(shapeLight);
    scene.add(camera)
    scene.add(shapeMesh);
  } else {
    const radiusField = document.querySelector('.radius-field').value;
    const shapeMaterial = new THREE.MeshPhongMaterial({
      color: 0xF57328,
      side: THREE.DoubleSide
    })
    currentAddedParticle = particleShape.value;
    let shapeGeometry;
    switch (particleShape.value) {
      case "icosahedron":
        shapeGeometry = new THREE.IcosahedronGeometry(radiusField);
        break;
      case "dodecahedron":
        shapeGeometry = new THREE.DodecahedronGeometry(radiusField);
        break;
      case "tetrahedron":
        shapeGeometry = new THREE.TetrahedronGeometry(radiusField);
        break;
      case "octahedron":
        shapeGeometry = new THREE.OctahedronGeometry(radiusField);
        break;
    }
    const shapeLight = new THREE.DirectionalLight(0xffffff, 0.8);
    const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    shapeMesh.name = `${particleShape.value}Mesh`;
    shapeLight.name = `${particleShape.value}Light`;
    sceneObjects[`${particleShape.value}`] = [shapeMesh, shapeLight];
    scene.remove(camera)
    camera.add(shapeLight);
    scene.add(camera)
    scene.add(shapeMesh);
  }

  document.querySelector(".add-particle-container").style.display = "none";
  document.querySelector('.add-particle-container').setAttribute("style", "display:none");
  particleToggler.innerHTML = "Remove Particle"
});

closeAddParticleButton.addEventListener("click", () => {
  document.querySelector(".add-particle-container").style.display = "none";
  document.querySelector('.add-particle-container').setAttribute("style", "display:none");
});


const canvasVhMin = Math.min(
  document.querySelector(".canvas-container").clientHeight,
  vh(90)
);

document.querySelector(".generator-sidebar").style.height = canvasVhMin;
document.querySelector('.generator-sidebar').setAttribute("style", `height:${canvasVhMin}px`);

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
});



function saveArrayBuffer(text, filename) {
  save(new Blob([buffer], {
    type: 'application/octet-stream'
  }), filename);
}

function vh(percent) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (percent * h) / 100;
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

document.querySelector("#comment_post_form").reset();

const commentsTab = document.querySelector("#comments_tab_button");
const likesTab = document.querySelector("#likes_tab_button");

commentsTab.addEventListener("click", () => {
  if (!commentsTab.classList.contains("active")) {
    commentsTab.classList.add("active");
    likesTab.classList.remove("active");
    // document.querySelector("#comment_post_form").style.display = 'block';
  }
});

likesTab.addEventListener("click", () => {
  if (!likesTab.classList.contains("active")) {
    likesTab.classList.add("active");
    commentsTab.classList.remove("active");
    // document.querySelector("#comment_post_form").style.display = 'none';
  }
});

