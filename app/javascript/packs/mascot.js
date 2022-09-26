import * as THREE from "three";
import {
    PDBLoader
} from "./threejs/PDBLoader"

function main() {
    const loader = new PDBLoader();
    const offset = new THREE.Vector3();

    const canvas = document.querySelector("#animation-canvas");
    console.log(canvas)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 1, 5000);
    camera.position.z = 2500;
    scene.add(camera);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, 1);
    scene.add(light2);

    const root = new THREE.Group();
    scene.add(root);

    loadMolecules();
    animate();

    function loadMolecules() {
        loader.load((pdb) => {
            console.log(pdb)
            const geometryAtoms = pdb.geometryAtoms;
            console.log(geometryAtoms);
            const geometryBonds = pdb.geometryBonds;
            const json = pdb.json;

            const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
            const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

            geometryAtoms.computeBoundingBox();
            geometryAtoms.boundingBox.getCenter(offset).negate();

            geometryAtoms.translate(offset.x, offset.y, offset.z);
            geometryBonds.translate(offset.x, offset.y, offset.z);

            let positions = geometryAtoms.getAttribute('position');
            const colors = geometryAtoms.getAttribute('color');

            const position = new THREE.Vector3();
            const color = new THREE.Color();

            for (let i = 0; i < positions.count; i++) {

                position.x = positions.getX(i);
                position.y = positions.getY(i);
                position.z = positions.getZ(i);

                color.r = colors.getX(i);
                color.g = colors.getY(i);
                color.b = colors.getZ(i);

                const material = new THREE.MeshPhongMaterial({
                    color: color
                });

                const object = new THREE.Mesh(sphereGeometry, material);
                object.position.copy(position);
                object.position.multiplyScalar(75);
                object.scale.multiplyScalar(25);
                root.add(object);

                const atom = json.atoms[i];

                const text = document.createElement('div');
                text.className = 'label';
                text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
                text.textContent = atom[4];

            }

            positions = geometryBonds.getAttribute('position');

            const start = new THREE.Vector3();
            const end = new THREE.Vector3();

            for (let i = 0; i < positions.count; i += 2) {

                start.x = positions.getX(i);
                start.y = positions.getY(i);
                start.z = positions.getZ(i);

                end.x = positions.getX(i + 1);
                end.y = positions.getY(i + 1);
                end.z = positions.getZ(i + 1);

                start.multiplyScalar(75);
                end.multiplyScalar(75);

                const object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial(0xffffff));
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.scale.set(5, 5, start.distanceTo(end));
                object.lookAt(end);
                root.add(object);

            }

            render();
        });

    }

    function render(time) {
        time *= 0.001;
        const speed = 0.2;
        const rot = time * speed;
      
        root.rotation.y = rot;
        root.rotation.y = rot;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
}

main();