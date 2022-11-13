import * as THREE from "three";
import DragControls from 'three-dragcontrols';
import oc from "three-orbit-controls";
import {
  SetupGeneralScene,
  SetupItemFeed,
  ResizeRendererToDisplaySize,
  Material
} from "./sceneUtils";
import {
  LineGeometry
} from "./threejs/LineGeometry";


function main() {
  const canvas = document.querySelector("#playground-canvas");
  const sidebarContent = document.querySelector(".sidebarContent");
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setClearAlpha(0);
  const playGroundContainer = document.querySelector("#playground");
  const playGroundScene = SetupGeneralScene(playGroundContainer);
  /**
   * Set up playground draggers and controls
   */
  let playGroundObjects = []
  let playGroundDraggers = new DragControls(
    playGroundObjects,
    playGroundScene.camera,
    playGroundContainer
  );
  const OrbitControls = oc(THREE)
  const playGroundControls = new OrbitControls(playGroundScene.camera, playGroundContainer);
  playGroundControls.minDistance = 0.01;
  playGroundControls.maxDistance = 10000;
  playGroundControls.enableDamping = true;
  playGroundControls.enableZoom = false;

  const generatorSize = document.querySelector("#playground_item_listing").value;
  const playgroundItemsScenes = SetupItemFeed(generatorSize);
  const modelItemContainer = document.querySelector(`#page_item_0`);

  for (let i = 0; i < playgroundItemsScenes.length; i++) {
    document
      .getElementById(`add_playground_item_${i}`)
      .addEventListener("click", () => {
        const wireframeObject = playgroundItemsScenes[i].scene
          .getObjectByName("wireframeObject")
          .clone();

        addItemToPlayground(wireframeObject);
      });
  }

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(modelItemContainer.width, modelItemContainer.height);

  function addItemToPlayground(item) {
    playGroundScene.scene.add(item);
    playGroundObjects.push(item);
    playGroundDraggers = new DragControls(
      playGroundObjects,
      playGroundScene.camera,
      playGroundContainer
    );
  }

  function renderSceneInfo(sceneInfo, resolution) {
    const {
      scene,
      camera,
      elem
    } = sceneInfo;
    Material.resolution.set(resolution.width, resolution.height);
    const {
      left,
      right,
      top,
      bottom,
      width,
      height
    } =
    elem.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const isOffscreen =
      bottom < 0 ||
      top > renderer.domElement.clientHeight ||
      right < 0 ||
      left > renderer.domElement.clientWidth;

    if (isOffscreen) {
      return;
    }

    const positiveYUpBottom = window.innerHeight - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);
    renderer.render(scene, camera);
  }


  function render() {
    ResizeRendererToDisplaySize(renderer, playGroundScene.camera);

    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);

    renderSceneInfo(playGroundScene, {
      height: playGroundContainer.clientHeight,
      width: playGroundContainer.clientWidth,
    });
    for (let i = 0; i < playgroundItemsScenes.length; i++) {
      renderSceneInfo(playgroundItemsScenes[i], {
        height: modelItemContainer.clientHeight,
        width: modelItemContainer.clientWidth,
      });
    }
    const transform = `translateY(${window.scrollY}px)`;
    renderer.domElement.style.transform = transform;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  /**
   * Event Listeners
   */

  const zoomToggle = document.querySelector("#zoom_enabler");
  const stapleToggler = document.querySelector("#switch_staples_showing");
  const resetPlayground = document.querySelector("#reset_playground");
  const stapleDownloader = document.querySelector("#download_playground_staples");
  const nfrDownloader = document.querySelector("#download_playground_as_nfr");
  const oxdnaDownloader = document.querySelector("#download_playground_as_oxdna");
  const pdbDownloader = document.querySelector("#download_playground_as_pdb");

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

  stapleToggler.addEventListener("click", () => {
    const isHidden = stapleToggler.checked ? true : false;
    for (let i = 0; i < playGroundObjects.length; i++) {
      playGroundObjects[i].getObjectByName("stapleObject").visible = isHidden;
    }
  });

  resetPlayground.addEventListener("click", () => {
    for (let i = 0; i < playGroundObjects.length; i++) {
      playGroundScene.scene.remove(playGroundScene.scene.getObjectByName(playGroundObjects[i].name));
    }
  })
}

main();



// function resizeRendererToDisplaySize(renderer, camera) {
//   const canvas = renderer.domElement;
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight;
//   const needResize = canvas.width !== width || canvas.height !== height;
//   if (needResize) {
//     renderer.setSize(width, height, false);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
//   }
//   return needResize;
// }
// const initialOffsetTop = sideBarScenes[0].elem.parentElement.offsetTop;
// const scrollHeight =  sideBar.offsetHeight;

// function renderSceneInfo(
//   sceneInfo,
//   resolution = {
//     height: playGroundContainer.clientHeight,
//     width: playGroundContainer.clientWidth,
//   }
// ) {
//   const { scene, camera, elem } = sceneInfo;
//   const isMainScreen = resolution.height == playGroundContainer.clientHeight;
//   const sceneObject = scene.getObjectByName("routingObject");
//   const { left, right, top, bottom, width, height } =
//     elem.getBoundingClientRect();
//   material.resolution.set(resolution.width, resolution.height);

//   let newHeight = height;
//   let newBottom = bottom;

//   if (!isMainScreen) {
//     if (((top - initialOffsetTop) >= scrollHeight) || ((bottom - initialOffsetTop) <= 0)) {
//       return;
//     } else if (scrollHeight - (top - initialOffsetTop) < height) {
//       newHeight = scrollHeight - (top - initialOffsetTop); 
//       newBottom = bottom - (height - newHeight);
//       sceneObject.position.y = - (height - newHeight) / 3;
//     } else if (bottom - initialOffsetTop < height) {
//       newHeight = bottom - initialOffsetTop; 
//       newBottom = bottom;
//       sceneObject.position.y = (height - newHeight) / 3;
//     }
//   }



//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();

//   const positiveYUpBottom = window.innerHeight - newBottom;
//   renderer.setScissor(left, positiveYUpBottom, width, newHeight);
//   renderer.setViewport(left, positiveYUpBottom, width, newHeight);
//   renderer.render(scene, camera);
// }

// function render() {
//   resizeRendererToDisplaySize(renderer, playGroundScene.camera);

//   renderer.setScissorTest(false);
//   renderer.clear(true, true);
//   renderer.setScissorTest(true);

//   renderSceneInfo(playGroundScene);
//   for (let i = 0; i < sideBarScenes.length; i++) {
//     const sidebarContainer = document.getElementById(`playground_item_${i}`);
//     renderSceneInfo(sideBarScenes[i], {
//       height: sidebarContainer.clientHeight,
//       width: sidebarContainer.clientWidth,
//     });
//   }

//   raycaster.setFromCamera(pointer, playGroundScene.camera);
//   // const transform = `translateY(${window.scrollY}px)`;
//   // renderer.domElement.style.transform = transform;
//   requestAnimationFrame(render);
// }
// requestAnimationFrame(render);