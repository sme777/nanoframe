import * as THREE from "three";
import {SetupGeneralScene, SetupItemFeed, Material, ResizeRendererToDisplaySize} from "./sceneUtils"

function main() {

    const canvas = document.querySelector("#homepage-canvas");
    const userFeedContainer = document.querySelector("#user-feed-container");
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearAlpha(0);
    const homepageScene = SetupGeneralScene(userFeedContainer);
    const generatorSize = document.querySelector("#generator-size").value;
    const userFeedScenes = SetupItemFeed(generatorSize);
    const modelItemContainer = document.querySelector(`#page_item_0`);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(modelItemContainer.width, modelItemContainer.height);

    function renderSceneInfo(sceneInfo, resolution) {
        const { scene, camera, elem } = sceneInfo;
        Material.resolution.set(resolution.width, resolution.height);
        const { left, right, top, bottom, width, height } =
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
        ResizeRendererToDisplaySize(renderer, homepageScene.camera);

        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);
      
        renderSceneInfo(homepageScene, {
            height: userFeedContainer.clientHeight,
            width: userFeedContainer.clientWidth,
        });
        for (let i = 0; i < userFeedScenes.length; i++) {
        
          renderSceneInfo(userFeedScenes[i], {
            height: modelItemContainer.clientHeight,
            width: modelItemContainer.clientWidth,
          });
        }
        const transform = `translateY(${window.scrollY}px)`;
        renderer.domElement.style.transform = transform;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();