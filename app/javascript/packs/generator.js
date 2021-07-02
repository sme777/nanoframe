// import * as Three from 'three'
// import oc from 'three-orbit-controls'
// import * as Maker from "./shapeMaker";

// function main() {
//     // setup
//     const OrbitControls = oc(Three)
//     const canvas = document.querySelector('#generator');
//     const renderer = new THREE.WebGLRenderer({alpha: true, canvas});
//     const fov = 25;
//     const aspect = 4;  // the canvas default
//     const near = 0.1;
//     const far = 1000;
//     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//     const controls = new OrbitControls( camera, renderer.domElement );

//     camera.position.z = 120;
//     const scene = new THREE.Scene();
//     const wireframeMaterial = new THREE.LineBasicMaterial({color: 0x000000});
//     const mesh = Maker.makeTorusKnot();
//     scene.add(mesh);
//     requestAnimationFrame(render);

//     function resizeRendererToDisplaySize(renderer) {
//         const canvas = renderer.domElement;
//         const width = canvas.clientWidth;
//         const height = canvas.clientHeight;
//         const needResize = canvas.width !== width || canvas.height !== height;
//         if (needResize) {
//           renderer.setSize(width, height, false);
//         }
//         return needResize;
//     }

//     function render(time) {
//         time *= 0.001;

//         if (resizeRendererToDisplaySize(renderer)) {
//             const canvas = renderer.domElement;
//             camera.aspect = canvas.clientWidth / canvas.clientHeight;
//             camera.updateProjectionMatrix();
//           }


//         const speed = .2;
//         const rot = time * speed;
//         mesh.rotation.x = rot;
//         mesh.rotation.y = rot;

//         renderer.render(scene, camera);
//         requestAnimationFrame(render);
//     }


//     renderer.setPixelRatio(window.devicePixelRatio);
//     requestAnimationFrame(render);
// }

// main();