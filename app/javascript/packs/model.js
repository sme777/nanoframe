import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import * as Maker from "./shapeMaker"
import { DNA } from './dna'
import { cubeData } from './shapeData'

//console.log(dat);

function main() {
    const OrbitControls = oc(THREE)
    const canvas = document.querySelector('#synthesizer');
    //canvas.height = $(".synthesizer-container").height();
    const renderer = new THREE.WebGLRenderer({alpha: true, canvas});
    const fov = 25;
    const aspect = 4;  // the canvas default
    const near = 0.1;
    const far = 10000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new OrbitControls( camera, renderer.domElement );
    
    controls.enableDamping = true
    const gui = new dat.GUI({ autoPlace: false });
    document.querySelector('.datGUI').append(gui.domElement)

    camera.position.z = 120;
    const scene = new THREE.Scene();
   

    const shape = document.getElementById('synthesizer-shape');
    let chosenShape;
    let mesh;
    let meshData;
    let isGUISet = false;
    //window.addEventListener("wheel", onMouseDrag);
    let dna = new DNA(7249);
    const geometry = new THREE.BufferGeometry().setFromPoints( dna.positions );
    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    const curveObject = new THREE.Line( geometry, material );
    scene.add(curveObject);

    const axesHelper = new THREE.AxesHelper(15)
    scene.add(axesHelper)

    shape.addEventListener("click", function() {
      chosenShape = shape.value;
      if (mesh != null) {
        mesh.geometry.dispose();
        mesh.material.dispose();
        //mesh.removeFromParent();
        scene.remove(mesh);
      }
      if (chosenShape == 0) {
        mesh = Maker.makeDefault();

      } else if (chosenShape == 1) {
        mesh = Maker.makeCube()
        meshData = cubeData
        if (!isGUISet) {
          gui.add(meshData, 'width', 0, 60).name('Width').setValue(30).onChange(() => {
            Maker.regenerateCube(mesh)
          })
          gui.add(meshData, 'height', 0, 60).name('Height').setValue(30).onChange(() => {
            Maker.regenerateCube(mesh)
          })
          gui.add(meshData, 'depth', 0, 60).name('Depth').setValue(30).onChange(() => {
            Maker.regenerateCube(mesh)
          })

          gui.add(meshData, 'widthSegments', 0, 6).step(1).name('Width Segment').setValue(3).onChange(() => {
            Maker.regenerateCube(mesh)
          })
          gui.add(meshData, 'heightSegments', 0, 6).step(1).name('Height Segment').setValue(3).onChange(() => {
            Maker.regenerateCube(mesh)
          })
          gui.add(meshData, 'depthSegments', 0, 6).step(1).name('Depth Segment').setValue(3).onChange(() => {
            Maker.regenerateCube(mesh)
          })
          isGUISet = true
        }
        //gui.add()
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
    

    // function regenerate() {
    //   if (mesh.geometry instanceof THREE.BoxGeometry) {
    //     Maker.regenerateCube(mesh)
    //   }
      
    // }

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
        // mesh.rotation.x = rot;
        curveObject.rotation.z = rot / 10;
        curveObject.rotation.x = rot / 10;
        mesh.rotation.y = rot;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);


}

main();


