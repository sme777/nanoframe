import * as THREE from "three";
import oc from "three-orbit-controls";
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

function main() {

    /**
     * Set up scene objects
     */

    const canvas = document.querySelector("#homepage-canvas");
    const userFeedContainer = document.querySelector("#user-feed-container");
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setClearAlpha(0);
    const homepageScene = setupHomepageScene();
    
    
    /**
     * Configure scene objects
     */
    renderer.setPixelRatio(userFeedContainer.devicePixelRatio);

    /**
     * Set up scene materials
     */
    const material = new LineMaterial({
        color: 0xffffff,
        linewidth: 3,
        vertexColors: true,
        dashed: false,
        alphaToCoverage: true,
      });


    /**
     * Set up scene controls
     */
    const OrbitControls = oc(THREE);

    const userFeedScenes = setupUserFeed();

    function setupUserFeed() {
        const generatorSize = document.querySelector("#generator-size").value;
        let userFeedScenes = [];
    
        for (let i = 0; i < generatorSize; i++) {
            const elementScene = setupUserFeedItemScene(i);
            userFeedScenes.push(elementScene);
        }
        return userFeedScenes;
    }
    
    
    function setupUserFeedItemScene(idx) {
        const positions = JSON.parse(
            document.querySelector(`#item${idx}_geometry`).value
        ).flat();
    
        const colors = JSON.parse(
            document.querySelector(`#item${idx}_material`).value
        ).flat();
    
        const homepageItemContainer = document.querySelector(
            `#homepage_item_${idx}`
        );
        const sceneInfo = makeScene(homepageItemContainer);
        const geometry = new LineGeometry();
        geometry.setPositions(positions);
        geometry.setColors(colors);
    
        const line = new Line2(geometry, material);
        line.geometry.center();
        line.name = "routingObject";
        sceneInfo.scene.add(line);
        sceneInfo.mesh = line;

        const controls = new OrbitControls(sceneInfo.camera, homepageItemContainer)
        controls.minDistance = 0.1;
        controls.maxDistance = 1000;

        return sceneInfo;
    }

    function setupHomepageScene() {
        const sceneInfo = makeScene(
            userFeedContainer,
            userFeedContainer.clientHeight,
            userFeedContainer.clientWidth
        );
      
        return sceneInfo;
    }
    
    function setupNanoframeFeed() {
    
    }
    
    
    function makeScene(elem) {
        const scene = new THREE.Scene();
      
        const fov = 45;
        const aspect = 2;
        const near = 0.01;
        const far = 10000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;
        camera.position.set(-40, 60, 90);
        camera.lookAt(0, 0, 0)
      
        {
          const color = 0xffffff;
          const intensity = 1;
          const light = new THREE.DirectionalLight(color, intensity);
          light.position.set(-1, 2, 4);
          scene.add(light);
        }
      
        return { scene, camera, elem };
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

    function renderSceneInfo(sceneInfo, resolution) {
        const { scene, camera, elem } = sceneInfo;
        material.resolution.set(resolution.width, resolution.height);
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
        resizeRendererToDisplaySize(renderer, homepageScene.camera);

        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);
      
        renderSceneInfo(homepageScene, {
            height: userFeedContainer.clientHeight,
            width: userFeedContainer.clientWidth,
        });
        for (let i = 0; i < userFeedScenes.length; i++) {
        const modelItemContainer = document.querySelector(`#homepage_item_${i}`);
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