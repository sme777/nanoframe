import * as THREE from "three";
import oc from "three-orbit-controls";
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

if (signOutBtn != null || boxState != null) {
  let size = 1;
  let visualize = true;
  if (generatorSize != null) {
    size = parseInt(generatorSize.value);
    visualize = false;
  }
  let insetWidth, insetHeight, camera2;
  let firstStartPoint, firstEndPoint, lastStartPoint, lastEndPoint;
  let id
  let canvas, zoomUpdate;
  let line0, line1, line4, line5, line6, line7;
  let canvasContainer, canvasContainerWidth, canvasContainerHeight;
  let routingColors;
  let isInterpolated;
  let isSplit;
  let sequence = [];

  
  let linearGroup = new THREE.Group();
  linearGroup.name = "Linear";
  let interpolatedGroup = new THREE.Group();
  interpolatedGroup.name = "Interpolated";
  
  let splitLinearGroup = new THREE.Group();
  splitLinearGroup.name = "Linear Open";

  let splitInterpolatedGroup = new THREE.Group();
  splitInterpolatedGroup.name = "Interpolated Open";

  let currentGroup;

  let sphereInter;
  let matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 5,
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,
  });

  let matLineBasic = new THREE.LineBasicMaterial({
    vertexColors: true,
  });
  const clock = new THREE.Clock();
  const OrbitControls = oc(THREE);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function adjustSplitPosition(points) {
    for (let i = 0; i < points.length; i += 3) {
      points[i] -= 10;
      points[i+1] -= 40;
      points[i+2] += 30;

      
    }
    return points;
  }

  function generateDisplay(
    positions = linear_points,
    colors = colors,
    split = false,
    fullDisplay = true
  ) {
    if (!fullDisplay) {
      positions = positions.concat(positions).slice(start, end);
      if (!residualEdges) {
        firstStartPoint = positions.slice(0, 3);
        firstEndPoint = positions.slice(-3);
      } else {
        lastStartPoint = positions.slice(0, 3);
        lastEndPoint = positions.slice(-3);
      }
    }

    if (fullDisplay) {
      routingColors = colors;
    } else {
      colors = findColorSequnece(start, positions.length, divisions);
    }
    if (split && (positions.length > scaffoldPositions.length / 2)){ 
      positions = adjustSplitPosition(positions);
    }

    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);

      line0 = new Line2(geometry, matLine);
      if (fullDisplay) {
        let _ = split ? splitLinearGroup.add(line0) : linearGroup.add(line0);

      }

      if (split && (positions.length < scaffoldPositions.length / 2 )){
        line0.geometry.center()
      }
  }

  function updateDisplay(scene) {
    scene.remove(currentGroup);
    
    if (isInterpolated) {
      currentGroup = isSplit ? splitInterpolatedGroup : interpolatedGroup;
      scene.add(currentGroup);
    } else {
      currentGroup = isSplit ? splitLinearGroup : linearGroup;
      scene.add(currentGroup);
    }
  }

  /**
   *
   * @param {*} start
   * @param {*} length
   * @returns
   */
  function findColorSequnece(start, length) {
    let count = 0;
    let modIndex;
    let subarray = [];
    let adjStart = start * 12 * 3;
    for (let i = adjStart; count < length; i++, count++) {
      modIndex = i % routingColors.length;
      subarray.push(routingColors[modIndex]);
    }
    return subarray;
  }


  /**
   *
   * @param {*} scene
   */
  function connectEnds(scene) {
    let [positions, colors] = getCurvePoints(lastStartPoint, firstEndPoint);
    let geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);
    line4 = new Line2(geometry, matLine);
    line4.computeLineDistances();
    line4.scale.set(1, 1, 1);
    scene.add(line4);
    let geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    line5 = new THREE.Line(geo, matLineBasic);
    scene.add(line5);

    let [positions2, colors2] = getCurvePoints(lastEndPoint, firstStartPoint);
    geometry = new LineGeometry();
    geometry.setPositions(positions2);
    geometry.setColors(colors2);

    line6 = new Line2(geometry, matLine);
    line6.computeLineDistances();
    line6.scale.set(1, 1, 1);
    scene.add(line6);
    geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions2, 3)
    );
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors2, 3));
    line7 = new THREE.Line(geo, matLineBasic);
    scene.add(line7);
  }

  function getCurvePoints(start, end) {
    let positions = [];
    let colors = [];
    const divisions = 96;
    const point = new THREE.Vector3();
    const spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(start[0], start[1], start[2]),
      new THREE.Vector3(end[0], end[1], end[2]),
    ]);
    for (let i = 0, l = divisions; i < l; i++) {
      const t = i / l;
      spline.getPoint(t, point);
      positions.push(
        point.x + (Math.random() - 0.5),
        point.y + (Math.random() - 0.5),
        point.z + (Math.random() - 0.5)
      );
      colors.push(t, 0.5, t);
    }

    return [positions, colors];
  }

  for (let i = 0; i < size; i++) {
    if (!visualize) {
      id = document.getElementById("index-" + i.toString()).value;
      canvas = document.getElementById("webgl-public-" + id);
    } else {
      canvas = document.getElementById("visualize-webgl");
    }


    canvasContainer = document.querySelector(".canvas-container");
    canvasContainerWidth = canvasContainer.offsetWidth;
    canvasContainerHeight = canvasContainer.offsetHeight;

    let renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasContainerWidth, canvasContainerHeight);

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(
      40,
      canvasContainerWidth / canvasContainerHeight,
      1,
      1000
    );
    camera.position.set(-40, 60, 90);
    if (visualize) {
      camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000);
      camera2.position.copy(camera.position);
    }

    let doublePoints = scaffoldPositions.concat(scaffoldPositions);
    let doubleColors = scaffoldColors.concat(scaffoldColors);
    generateDisplay(scaffoldPositions.flat(), scaffoldColors.flat());

    let group1LinearPoints = doublePoints.slice(start, end);
    let group2LinearPoints = doublePoints.slice(end, scaffoldPositions.length + start);
    
    generateDisplay(group1LinearPoints.flat(), doubleColors.slice(start, end).flat(), true);
    generateDisplay(group2LinearPoints.flat(), doubleColors.slice(end, scaffoldPositions.length + start).flat(), true);
    
    let stapleLinearGroup = new THREE.Group();
    stapleLinearGroup.visible = false;

    generateStapleGroup(staples, stapleLinearGroup);

    linearGroup.add(stapleLinearGroup);
    new THREE.Box3()
      .setFromObject(linearGroup)
      .getCenter(linearGroup.position)
      .multiplyScalar(-1);
    currentGroup = linearGroup;
    scene.add(currentGroup);


    let controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 5000;

    window.addEventListener("resize", onWindowResize);
    canvas.addEventListener("wheel", onZoom);
    document.addEventListener("pointermove", onPointerMove);
    onWindowResize();

    const sphereGeometry = new THREE.SphereGeometry(
      controls.target.distanceTo(controls.object.position) * 0.005
    );
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    sphereInter = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereInter.visible = false;
    scene.add(sphereInter);
    let sidePlanes = [];
    
    /**
     * Setup plane for highlight
     */
    for (let i = 0; i < 6; i++) {
      const planeGeometry = new THREE.PlaneGeometry(50, 50);
      const planeMaterial = new THREE.MeshBasicMaterial( {color: 0x8190ed, side: THREE.DoubleSide, opacity: 0, transparent: true} );
      const plane2D = new THREE.Mesh(planeGeometry, planeMaterial);
      if (i - 3 > 0) {
        planeGeometry.rotateY(Math.PI / 2);
        if (i % 2 == 0) {
          plane2D.position.x += 25;
          plane2D.name = "S5";
        } else {
          plane2D.position.x -= 25;
          plane2D.name = "S6";
        }
        
      } else if (i - 1 > 0) {
        planeGeometry.rotateX(Math.PI / 2);
        if (i % 2 == 0) {
          plane2D.position.y += 25;
          plane2D.name = "S3";
        } else {
          plane2D.position.y -= 25;
          plane2D.name = "S4";
        }
      } else {
        if (i % 2 == 0) {
          plane2D.position.z += 25;
          plane2D.name = "S1";
        } else {
          plane2D.position.z -= 25;
          plane2D.name = "S2";
        }
      }
      sidePlanes.push(plane2D);
      scene.add(plane2D);
    }

    requestAnimationFrame(render);


    function generateStapleGroup(staples, group) {
      for (let i = 0; i < staples.data.length; i++) {
        let staplePositions = staples.data[i].positions;
        let stapleColors = [].concat(...Array(staplePositions.length).fill(staples.data[i].color));
        let geometry = new LineGeometry();
        geometry.setPositions(staplePositions.flat());
        geometry.setColors(stapleColors.flat());

        let stapleLine = new Line2(geometry, matLine);

        camera.lookAt(stapleLine.position);

        let stapleGeo = new THREE.BufferGeometry();
        stapleGeo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(staplePositions, 3)
        );
        stapleGeo.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(stapleColors, 3)
        );
        group.add(stapleLine);
      }
    }

    function onZoom(event) {
      zoomUpdate = true;
    }

    function onPointerMove(e) {
      
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX) / window.innerWidth) * 2 - 1;
      const y = -((e.clientY) / window.innerHeight) * 2 + 1;
      mouse.x = x
      mouse.y = y
    }

    function onWindowResize() {
      camera.aspect = canvasContainerWidth / canvasContainerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasContainerWidth, canvasContainerHeight);

      if (visualize) {
        insetWidth = canvasContainerHeight / 4;
        insetHeight = canvasContainerHeight / 4;
        camera2.aspect = insetWidth / insetHeight;
        camera2.updateProjectionMatrix(line1);
      }
    }

    function findIndex(pos) {
      let min = Infinity;
      let idx = null;
      for (let i = 0; i < scaffoldPositions.length; i += 3) {
        let temp =
          Math.abs(pos.x - scaffoldPositions[i]) +
          Math.abs(pos.y - scaffoldPositions[i + 1]) +
          Math.abs(pos.z - scaffoldPositions[i + 2]);
        if (temp < min) {
          min = temp;
          idx = Math.floor(i / 3);
        }
      }
      return idx;
    }

    function render() {
      renderer.setClearColor(0x000000, 0);
      renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);
      matLine.resolution.set(canvasContainerWidth, canvasContainerHeight);
      let minDist = Infinity;
      let minDistPlane = null;
      for (let i = 0; i < sidePlanes.length; i++) {
        if (camera.position.distanceTo(sidePlanes[i].position) < minDist) {
          minDist = camera.position.distanceTo(sidePlanes[i].position);
          minDistPlane = sidePlanes[i].name;
        }
      }

      document.querySelector(".side-id").value = minDistPlane;

      renderer.render(scene, camera);

      if (visualize) {
        raycaster.setFromCamera(mouse, camera);
        const intersections = raycaster.intersectObject(currentGroup, true);

        if (intersections.length > 0) {
          if (zoomUpdate) {
            sphereInter.geometry.dispose()
            sphereInter.geometry = new THREE.SphereGeometry(
              controls.target.distanceTo(controls.object.position) * 0.005
            );
            zoomUpdate = false;
          }
          sphereInter.visible = true;
          sphereInter.position.copy(intersections[0].point);
          const line = intersections[0].object;
          const idx = findIndex(intersections[0].point);
          const colorsCopy = [...scaffoldColors]
          colorsCopy[scaffoldColors[idx * 3]] = 0;
          colorsCopy[scaffoldColors[idx * 3 + 1]] = 0;
          colorsCopy[scaffoldColors[idx * 3 + 2]] = 0;
          if (idx != null) {
            document.querySelector(".sequence-base").value = sequence[idx];
            document.querySelector(".sequence-id").value = idx;
          }
        } else {
          sphereInter.visible = false;
        }

        renderer.setClearColor(0xf5f5f5, 1);
        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setScissor(20, 20, insetWidth, insetHeight);
        renderer.setViewport(20, 20, insetWidth, insetHeight);
        camera2.position.copy(camera.position);
        camera2.quaternion.copy(camera.quaternion);
        matLine.resolution.set(insetWidth, insetHeight);
        renderer.render(scene, camera2);
        renderer.setScissorTest(false);
      }

      requestAnimationFrame(render);
    }
    if (visualize) {
      const box = document.getElementById("box-state");
      const boxLabel = document.getElementById("box-state-label");
      const stapleToggler = document.getElementById("box-state-staples");
      const stapleTogglerLabel = document.getElementById("box-state-staples-label");
      const interpolationToggler = document.getElementById(
        "box-state-interpolated"
      );

      box.addEventListener("click", () => {
        if (box.checked) {
          boxLabel.innerHTML = "Close Form";
          scene.remove(currentGroup);
          isSplit = true;
          currentGroup = isInterpolated ? splitInterpolatedGroup : splitLinearGroup;
          scene.add(currentGroup)

        } else {
          boxLabel.innerHTML = "Open Form";
          isSplit = false;
          scene.remove(currentGroup);
          currentGroup = isInterpolated ? interpolatedGroup : linearGroup;
          scene.add(currentGroup);
        }
      });

      stapleToggler.addEventListener("click", () => {
        if (stapleToggler.checked) {
          stapleTogglerLabel.innerHTML = "Hide Staples";
        } else {
          stapleTogglerLabel.innerHTML = "Show Staples";
        }

        if (isInterpolated) {
          stapleInterpolatedGroup.visible = !stapleInterpolatedGroup.visible;
        } else {
          stapleLinearGroup.visible = !stapleLinearGroup.visible;
        }
      });

      interpolationToggler.addEventListener("click", () => {
        isInterpolated = !isInterpolated;
        updateDisplay(scene);
      });
    }
  }
}
