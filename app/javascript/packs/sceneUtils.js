import * as THREE from "three";
import { Line2 } from "./threejs/Line2";
import oc from "three-orbit-controls";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

const OrbitControls = oc(THREE);

export const Material = new LineMaterial({
    color: 0xffffff,
    linewidth: 3,
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,
});

export function SetupGeneralScene(container) {
    const sceneInfo = makeScene(
        container,
        container.clientHeight,
        container.clientWidth
    );
    return sceneInfo;
}

export function SetupItemFeed(itemCount) {
    let itemScenes = [];
    for (let i = 0; i < itemCount; i++) {
        try {
            const elementScene = setupItemScene(i);
            if (elementScene != null) {
                itemScenes.push(elementScene);
            }
        } catch (e) {
            console.log(`Error retrieving synth properties ${e}`)
        }
    }
    return itemScenes;
}

function setupItemScene(idx) {
    if (document.querySelector(`#item${idx}_geometry`) == null) {
        return null;
    }
    const positions = JSON.parse(
        document.querySelector(`#item${idx}_geometry`).value
    ).flat();
    const colors = JSON.parse(
        document.querySelector(`#item${idx}_material`).value
    ).flat();

    const wrapperItemContainer = document.querySelector(
        `#page_item_${idx}`
    );
    const sceneInfo = makeScene(wrapperItemContainer);
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);

    const line = new Line2(geometry, Material);
    line.geometry.center();
    line.name = "routingObject";
    sceneInfo.scene.add(line);
    sceneInfo.mesh = line;

    const controls = new OrbitControls(sceneInfo.camera, wrapperItemContainer)
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.enableZoom = false;
    return sceneInfo;
}

export function ResizeRendererToDisplaySize(renderer, camera) {
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
