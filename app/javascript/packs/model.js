import * as Three from 'three'
import oc from 'three-orbit-controls'
import * as Maker from "./shapeMaker";

function main() {
    const OrbitControls = oc(Three)
    const canvas = document.querySelector('#synthesizer');
    //canvas.height = $(".synthesizer-container").height();
    const renderer = new THREE.WebGLRenderer({alpha: true, canvas});
    const fov = 25;
    const aspect = 4;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls( camera, renderer.domElement );

    camera.position.z = 120;
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xAAAAAA);
    const shape = document.getElementById('synthesizer-shape');
    let chosenShape;
    let mesh;
    //window.addEventListener("wheel", onMouseDrag);

    shape.addEventListener("click", function() {
      chosenShape = shape.value;
      if (mesh != null) {
        mesh.geometry.dispose();
        mesh.removeFromParent();
        //scene.remove(mesh);
      }
      if (chosenShape == 0) {
        mesh = Maker.makeDefault();
      } else if (chosenShape == 1) {
        mesh = Maker.makeCube();
      } else if (chosenShape == 2) {
        mesh = Maker.makeSphere();
      } else if (chosenShape == 3) {
        mesh = Maker.makeCylinder();
      } else if (chosenShape == 4) {
        mesh = Maker.makeCone();
      } else if (chosenShape == 5) {
        mesh = Maker.makePolyhedron();
      } else if (chosenShape == 6) {
        mesh = Maker.makeTetrahedron();
      } else if (chosenShape == 7) {
        mesh = Maker.makeOctahedron();
      } else if (chosenShape == 8) {
        mesh = Maker.makeIcosahedron();
      } else if (chosenShape == 9){
        mesh = Maker.makeDodecahedron();
      } else if (chosenShape == 10) {
        mesh = Maker.makeTorus();
      } else {
        mesh = Maker.makeTorusKnot();
      }
    
      if (mesh != undefined) {
        scene.add(mesh);
        requestAnimationFrame(render);
      }
      
    });
    

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        if (chosenShape == undefined) {
          return;
        }

        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
          }


        const speed = .2;
        const rot = time * speed;
        mesh.rotation.x = rot;
        mesh.rotation.y = rot;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    requestAnimationFrame(render);
}



main();
