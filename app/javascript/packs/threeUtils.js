import * as THREE from "three";
import oc from "three-orbit-controls";
import DragControls from "three-dragcontrols";
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

export function makeScene(elem) {
    const scene = new THREE.Scene();
  
    const fov = 45;
    const aspect = 2;
    const near = 0.01;
    const far = 10000;
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