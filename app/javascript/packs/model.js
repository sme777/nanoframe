import * as Three from 'three'
import oc from 'three-orbit-controls'



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
    const wireframeMaterial = new THREE.LineBasicMaterial({color: 0x000000});
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
        mesh = makeDefault();
      } else if (chosenShape == 1) {
        mesh = makeCube();
      } else if (chosenShape == 2) {
        mesh = makeSphere();
      } else if (chosenShape == 3) {
        mesh = makeCylinder();
      } else if (chosenShape == 4) {
        mesh = makeCone();
      } else if (chosenShape == 5) {
        mesh = makePolyhedron();
      } else if (chosenShape == 6) {
        mesh = makeTetrahedron();
      } else if (chosenShape == 7) {
        mesh = makeOctahedron();
      } else if (chosenShape == 8) {
        mesh = makeIcosahedron();
      } else if (chosenShape == 9){
        mesh = makeDodecahedron();
      } else if (chosenShape == 10) {
        mesh = makeTorus();
      } else {
        mesh = makeTorusKnot();
      }
    
      if (mesh != undefined) {
        scene.add(mesh);
        requestAnimationFrame(render);
      }
      
    });
    
    
    //
    //let mesh = makeCube();
    

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

    function makeDefault() {

    }

    function makeCube() {
      const size = 30;
      const widthSegments = 2;  
      const heightSegments = 3;  
      const depthSegments = 4;  
      const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments));
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makeSphere() {
      const radius =  22;  
      const widthSegments = 10;  
      const heightSegments = 8;
      const geometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(radius, widthSegments, heightSegments));
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
      //scene.add
    }

    function makeCylinder() {
      const radiusTop = 18;  
      const radiusBottom = 10;  
      const height = 33;  
      const radialSegments = 12;  
      const geometry = new THREE.CylinderGeometry(
        radiusTop, radiusBottom, height, radialSegments);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
      }


    function makeCone() {
      const radius = 20;  
      const height = 33;  
      const radialSegments = 20;  
      const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makePolyhedron() {
      const verticesOfCube = [
        -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
        -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
      ];
      const indicesOfFaces = [
          2, 1, 0,    0, 3, 2,
          0, 4, 7,    7, 3, 0,
          0, 1, 5,    5, 4, 0,
          1, 2, 6,    6, 5, 1,
          2, 3, 7,    7, 6, 2,
          4, 5, 6,    6, 7, 4,
      ];
      const radius = 22;  
      const detail = 0;  
      const geometry = new THREE.PolyhedronGeometry(
        verticesOfCube, indicesOfFaces, radius, detail);  
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
      } 

    function makeTetrahedron() {
      const radius = 22;  
      const detail = 0;  
      const geometry = new THREE.TetrahedronGeometry(radius, detail);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makeOctahedron() {
      const radius = 22;  
      const detail = 0; 
      const geometry = new THREE.OctahedronGeometry(radius, detail);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makeIcosahedron() {
      const radius = 22;  
      const detail = 0;  
      const geometry = new THREE.IcosahedronGeometry(radius, detail);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makeDodecahedron() {
      const radius = 22;  
      const detail = 0;  
      const geometry = new THREE.DodecahedronGeometry(radius, detail);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makeTorus() {
      const radius = 22;  
      const tubeRadius = 2;  
      const radialSegments = 8;  
      const tubularSegments = 24;  
      const geometry = new THREE.TorusGeometry(
          radius, tubeRadius,
          radialSegments, tubularSegments);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    function makeTorusKnot() {
      const radius = 15;  
      const tubeRadius = 4;  
      const radialSegments = 8;  
      const tubularSegments = 64;  
      const p = 2;  
      const q = 3;  
      const geometry = new THREE.TorusKnotGeometry(
          radius, tubeRadius, tubularSegments, radialSegments, p, q);
      const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
      return mesh;
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    requestAnimationFrame(render);
}



main();
