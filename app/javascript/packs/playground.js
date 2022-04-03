import * as THREE from "three";
import oc from "three-orbit-controls";
// import DragControls from 'three-dragcontrols';
import DragControls from "three-dragcontrols";
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

const canvas = document.getElementById("playground-canvas");
const sideBarHeight = document.querySelector(".sidebarContent").scrollTopMax;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

const OrbitControls = oc(THREE);
const playGroundContainer = document.getElementById("playground");
const playGroundScene = setupPlayGroundScene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let playGroundControls;
renderer.setPixelRatio(playGroundContainer.devicePixelRatio);
let playGroundObjects;
let playGroundDraggers;
console.log(playGroundDraggers);

const material = new LineMaterial({
  color: 0xffffff,
  linewidth: 10,
  vertexColors: true,
  dashed: false,
  alphaToCoverage: true,
});

const sideBarScenes = setupSideBarScene();

function makeScene(elem) {
  const scene = new THREE.Scene();

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  camera.position.set(-40, 60, 90);
  // camera.lookAt(0, 0, 0)

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  return { scene, camera, elem };
}

function setupPlayGroundScene() {
  const sceneInfo = makeScene(
    playGroundContainer,
    playGroundContainer.clientHeight,
    playGroundContainer.clientWidth
  );
  // const geometry = new THREE.BoxGeometry(30, 30, 30)
  // const material = new THREE.MeshPhongMaterial({color: 'red'})
  // const mesh = new THREE.Mesh(geometry, material)
  // sceneInfo.scene.add(mesh)
  // sceneInfo.mesh = mesh

  playGroundControls = new OrbitControls(sceneInfo.camera, playGroundContainer);
  playGroundControls.minDistance = 0.1;
  playGroundControls.maxDistance = 1000;
  playGroundControls.enableDamping = true;
  playGroundControls.enableZoom = false;
  playGroundObjects = [];
  playGroundDraggers = new DragControls(
    playGroundObjects,
    sceneInfo.camera,
    playGroundContainer
  );

  return sceneInfo;
}

function setupSideBarScene() {
  const playGroundItemsSize = parseInt(
    document.getElementById("playground_item_listing").value
  );
  const sideBarScenes = [];
  for (let i = 0; i < playGroundItemsSize; i++) {
    const elementScene = setupSideBarItemScene(i);
    sideBarScenes.push(elementScene);
    document
      .getElementById(`add_playground_item_${i}`)
      .addEventListener("click", () => {
        const routingObject = elementScene.scene
          .getObjectByName("routingObject")
          .clone();

        addItemToPlayground(routingObject);
      });
  }
  return sideBarScenes;
}

function setupSideBarItemScene(idx) {
  const positions = JSON.parse(
    document.getElementById(`item${idx}_geometry`).value
  );
  const colors = JSON.parse(
    document.getElementById(`item${idx}_material`).value
  );
  const playGroundItemContainer = document.getElementById(
    `playground_item_${idx}`
  );
  const sceneInfo = makeScene(playGroundItemContainer);
  const geometry = new LineGeometry();
  geometry.setPositions(positions);
  geometry.setColors(colors);

  const line = new Line2(geometry, material);
  line.geometry.center();
  line.name = "routingObject";
  sceneInfo.scene.add(line);
  sceneInfo.mesh = line;

  const controls = new OrbitControls(sceneInfo.camera, playGroundItemContainer);
  controls.minDistance = 0.1;
  controls.maxDistance = 1000;
  controls.enableZoom = false;

  return sceneInfo;
}

function addItemToPlayground(item) {
  playGroundScene.scene.add(item);
  playGroundObjects.push(item);
  updateDragControls();
}

function updateDragControls() {
  playGroundDraggers = new DragControls(
    playGroundObjects,
    playGroundScene.camera,
    playGroundContainer
  );
}

function resizeRendererToDisplaySize(renderer, camera) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

function renderSceneInfo(
  sceneInfo,
  resolution = {
    height: playGroundContainer.clientHeight,
    width: playGroundContainer.clientWidth,
  }
) {
  const { scene, camera, elem } = sceneInfo;

  const { left, right, top, bottom, width, height } =
    elem.getBoundingClientRect();
  material.resolution.set(resolution.width, resolution.height);

  const isOffscreen =
    bottom < 0 ||
    top > renderer.domElement.clientHeight ||
    right < 0 ||
    left > renderer.domElement.clientWidth;

  // top > scrollHeight

  // const isOffscreen =
  //     scrollHeight + sideBarHeight < top ||
  //     scrollHeight + sideBarHeight < bottom ||
  //     scrollHeight > top ||
  //     scrollHeight > bottom ||
  //     right < 0 ||
  //     left > renderer.domElement.clientWidth

  if (isOffscreen) {
    return;
  }

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const positiveYUpBottom = renderer.domElement.height - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);

  renderer.render(scene, camera);
}

function render() {
  resizeRendererToDisplaySize(renderer, playGroundScene.camera);

  renderer.setScissorTest(false);
  renderer.clear(true, true);
  renderer.setScissorTest(true);

  renderSceneInfo(playGroundScene);
  for (let i = 0; i < sideBarScenes.length; i++) {
    const sidebarContainer = document.getElementById(`playground_item_${i}`);
    renderSceneInfo(sideBarScenes[i], {
      height: sidebarContainer.clientHeight,
      width: sidebarContainer.clientWidth,
    });
  }

  raycaster.setFromCamera(pointer, playGroundScene.camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

/**
 * Event Listeners
 */

const zoomToggle = document.querySelector(".enableZoom");

zoomToggle.addEventListener("click", () => {
  if (playGroundControls.enableZoom) {
    zoomToggle.innerText = "Enable Zoom";
  } else {
    zoomToggle.innerText = "Disable Zoom";
  }
  playGroundControls.enableZoom = !playGroundControls.enableZoom;
});

playGroundDraggers.addEventListener("dragstart", (e) => {
  playGroundControls.enabled = false;
});

playGroundDraggers.addEventListener("dragend", (e) => {
  playGroundControls.enabled = true;
});
