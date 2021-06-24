function main() {
    const canvas = document.querySelector('#synthesizer');
    //canvas.height = $(".synthesizer-container").height();
    const renderer = new THREE.WebGLRenderer({alpha: true, canvas});
    const fov = 25;
    const aspect = 4;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 120;
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xAAAAAA);
    const shape = document.getElementById('synthesizer-shape');
    let chosenShape;
    let mesh;
    shape.addEventListener("click", function() {
      chosenShape = shape.value;
      if (mesh != null) {
        mesh.geometry.dispose();
        mesh.removeFromParent();
        //scene.remove(mesh);
      }
      if (chosenShape == 0) {
        mesh = makeCube();
      } else if (chosenShape == 1) {
        mesh = makeCube();
      } else if (chosenShape == 2) {
        mesh = makeSphere();
      } else {
        mesh = makeSphere();
      }
      scene.add(mesh);
      requestAnimationFrame(render);
      
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

    function makeCube() {
      const size = 30;
      const widthSegments = 2;  
      const heightSegments = 3;  
      const depthSegments = 4;  
      const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments));
      const material = new THREE.LineBasicMaterial({color: 0x000000});
      const mesh = new THREE.LineSegments(geometry, material);
      //mesh.position.x = 10;
      //scene.add(mesh);
      return mesh;
    }

    function makeSphere() {
      const radius =  22;  
      const widthSegments = 10;  
      const heightSegments = 8;
      const geometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(radius, widthSegments, heightSegments));
      const material = new THREE.LineBasicMaterial({color: 0x000000});
      const mesh = new THREE.LineSegments(geometry, material);
      return mesh;
      //scene.add
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    requestAnimationFrame(render);
}



main();
