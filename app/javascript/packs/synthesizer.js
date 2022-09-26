import * as THREE from "three";
import { SetupGeneralScene, SetupItemFeed, ResizeRendererToDisplaySize, Material } from "./sceneUtils";


function main() {

    const canvas = document.querySelector("#feed-canvas");
    const feedContainer = document.querySelector("#feed-container-body");
    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    renderer.setClearAlpha(0);
    const feedScene = SetupGeneralScene(feedContainer);
    const generatorSize = document.querySelector("#generator-size").value;
    const feedItemsScenes = SetupItemFeed(generatorSize);
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
        ResizeRendererToDisplaySize(renderer, feedScene.camera);

        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);
      
        renderSceneInfo(feedScene, {
            height: feedContainer.clientHeight,
            width: feedContainer.clientWidth,
        });
        for (let i = 0; i < feedItemsScenes.length; i++) {
            renderSceneInfo(feedItemsScenes[i], {
                height: modelItemContainer.clientHeight,
                width: modelItemContainer.clientWidth,
            });
        }
        const transform = `translateY(${window.scrollY}px)`;
        renderer.domElement.style.transform = transform;
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


    document.querySelector("#synthesizer_search_form").reset();
    for (let i = 0; i < generatorSize; i++) {
        let clipboardCopier = document.querySelector(`#generator_${i}_copier`)
        let generatorLink = document.querySelector(`#generator_${i}_link`)
        clipboardCopier.addEventListener("click", () => {
            console.log(generatorLink.href);
            navigator.clipboard.writeText(generatorLink.href);
        });
    };

}

main();

