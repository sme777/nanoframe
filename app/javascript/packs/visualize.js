import * as THREE from "three";
import * as Algorithms from "./algorithms";
import oc from "three-orbit-controls";
import { Line2 } from "./threejs/Line2";
import { LineMaterial } from "./threejs/LineMaterial";
import { LineGeometry } from "./threejs/LineGeometry";

document.addEventListener("turbolinks:load", function() {
    main();
  })

function main() {
if (signOutBtn != null || boxState != null) {
  let size = 1;
  let visualize = true;
  if (generatorSize != null) {
    size = parseInt(generatorSize.value);
    visualize = false;
  }
  let insetWidth, insetHeight, camera2;
  let firstStartPoint, firstEndPoint, lastStartPoint, lastEndPoint;
  let id, segments, scaffold_length;
  let canvas, zoomUpdate;
  let line0, line1, line2, line3, line4, line5, line6, line7;
  let canvasContainer, canvasContainerWidth, canvasContainerHeight;
  let routingColors;
  let isInterpolated;
  let sequence = [];

  let interpolatedGroup = new THREE.Group();
  let linearGroup = new THREE.Group();
  let currentGroup;

  let toggle = 0;
  let sphereInter;
  let globalPositions;
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

  for (let i = 0; i < 7219; i++) {
    if (i % 2 == 0) {
      sequence.push("T");
    } else if (i % 3 == 0) {
      sequence.push("C");
    } else {
      sequence.push("G");
    }
  }

  function generateDisplay(
    positions = linear_points,
    type = "linear",
    colors = colors,
    residualEdges = false,
    fullDisplay = true,
    start = 0,
    end = scaffold_length * 3
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

    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    globalPositions = positions;
    geometry.setColors(colors);

    if (!residualEdges) {
      line0 = new Line2(geometry, matLine);

      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      line1 = new THREE.Line(geo, matLineBasic);
      line1.computeLineDistances();
      line1.visible = false;

      if (fullDisplay) {
        if (type === "linear") {
          linearGroup.add(line0);
        } else if (type == "interpolated") {
          interpolatedGroup.add(line0);
        }
      }
    } else {
      line2 = new Line2(geometry, matLine);
      line2.computeLineDistances();
      line2.scale.set(1, 1, 1);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      line3 = new THREE.Line(geo, matLineBasic);
      line3.computeLineDistances();
      // line3.visible = false
    }
  }

  function updateDisplay(scene) {
    scene.remove(currentGroup);

    if (isInterpolated) {
      currentGroup = interpolatedGroup;
      scene.add(currentGroup);
    } else {
      currentGroup = linearGroup;
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
    // let colors = Array(30).fill(0.5)
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
  let linear_points, interpolated_points, start, length;
  
  let colors, staples_colors;
  let simpleObjectSets;

  for (let i = 0; i < size; i++) {
    if (!visualize) {
      id = document.getElementById("index-" + i.toString()).value;
      canvas = document.getElementById("webgl-public-" + id);
    } else {
      canvas = document.getElementById("visualize-webgl");
    }

    scaffold_length = graph_json["scaffold_length"];
    segments = graph_json["segments"];

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

    // let objectSets = convertToVector3D(graph_json["planes"])
    // simpleObjectSets = convertToVector3D(graph_json["alg"])
    start = graph_json["start"];
    length = graph_json["length"];
    linear_points = graph_json["linear_points"];
    interpolated_points = graph_json["interpolated_points"];
    colors = graph_json["colors"];
    staples_colors = graph_json["staple_colors"];
    /**
     * test start
     */
     console.log(colors.toString())
    let stapleLinearGroup = new THREE.Group();
    let stapleInterpolatedGroup = new THREE.Group();
    stapleLinearGroup.visible = false;
    stapleInterpolatedGroup.visible = false;
    generateStapleGroup(staples.linear, stapleLinearGroup);
    generateStapleGroup(staples.interpolated, stapleInterpolatedGroup); // TODO Fix

    linearGroup.add(stapleLinearGroup);
    interpolatedGroup.add(stapleInterpolatedGroup);
    // interpolatedGroup.add(stapleGroup)
    new THREE.Box3()
      .setFromObject(linearGroup)
      .getCenter(linearGroup.position)
      .multiplyScalar(-1);
    new THREE.Box3()
      .setFromObject(interpolatedGroup)
      .getCenter(interpolatedGroup.position)
      .multiplyScalar(-1);
    currentGroup = linearGroup;
    scene.add(currentGroup);

    /**
     * test end
     */
    generateDisplay(linear_points, "linear", colors);
    generateDisplay(interpolated_points, "interpolated", colors);

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 500;
    // controls.enableZoom = false

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

    requestAnimationFrame(render);

    function generateStapleGroup(staples, group) {
      let pointer = 0
      for (let i = 0; i < staples.length; i++) {
        if (pointer > staples_colors.length) continue; // TODO fix for interpolated
        let staple_points = staples[i];
        let staple_colors = staples_colors.slice(pointer, pointer + staples[i].length); //Array(staples[i].length).fill(0);
        
        pointer += staples[i].length;
        let geometry = new LineGeometry();
        geometry.setPositions(staple_points);
        geometry.setColors(staple_colors);

        let staple_line = new Line2(geometry, matLine);

        camera.lookAt(staple_line.position);

        let staple_geo = new THREE.BufferGeometry();
        staple_geo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(staple_points, 3)
        );
        staple_geo.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(staple_colors, 3)
        );
        let staple_line1 = new THREE.Line(staple_geo, matLineBasic);
        staple_line1.computeLineDistances();
        staple_line1.visible = false;
        group.add(staple_line);
        // scene.add(staple_line1)
      }
    }

    function onZoom(event) {
      zoomUpdate = true;
    }

    function onPointerMove(event) {
      // const rect = canvas.getBoundingClientRect()
      // mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      // mouse.y = -((event.clientY - rect.top) / rect.height) * 2 - 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
      for (let i = 0; i < globalPositions.length; i += 3) {
        let temp =
          Math.abs(pos.x - globalPositions[i]) +
          Math.abs(pos.y - globalPositions[i + 1]) +
          Math.abs(pos.z - globalPositions[i + 2]);
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
      matLine.resolution.set(canvasContainerWidth, canvasContainerHeight); // resolution of the viewport
      renderer.render(scene, camera);

      if (visualize) {
        raycaster.setFromCamera(mouse, camera);
        // let x = line0.raycast(raycaster, globalPositions)
        const intersections = raycaster.intersectObject(line0, true);
        // let intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null
        if (intersections.length > 0) {
          if (zoomUpdate) {
            // sphereInter.geometry.dispose()
            sphereInter.geometry = new THREE.SphereGeometry(
              controls.target.distanceTo(controls.object.position) * 0.005
            );
            zoomUpdate = false;
          }
          sphereInter.visible = true;
          sphereInter.position.copy(intersections[0].point);
          let idx = findIndex(sphereInter.position);

          if (idx != null) {
            document.querySelector(".sequence-base").value = sequence[idx];
            document.querySelector(".sequence-id").value = idx;
            // document.querySelector(".sequnce-name").innerHTML = "Base selection: " + sequence[idx] + "\n" + "Index: " + idx
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
      toggle += clock.getDelta();
      requestAnimationFrame(render);
    }
    // console.log(visualize);
    if (visualize) {
      // const algs = graph_json['alg']//document.getElementById("set-values").value = JSON.stringify(simpleObjectSets)
      const box = document.getElementById("box-state");
      const boxLabel = document.getElementById("box-state-label");
      // let scp = Algorithms.findStrongestConnectedComponents(simpleObjectSets, 1 / 3, [width, height, depth])
      const stapleToggler = document.getElementById("box-state-staples");
      const interpolationToggler = document.getElementById(
        "box-state-interpolated"
      );

      box.addEventListener("click", () => {
        if (box.checked) {
          boxLabel.innerHTML = "Close Form";
          scene.remove(currentGroup);
          // console.log(psz)
          const dpsz = linear_points.concat(linear_points);
        //   console.log(scp);
          generateDisplay(
            linear_points,
            colors,
            false,
            false,
            scp[2] * 3 * 30,
            scp[2] * 3 + scp[0].length * 3 * 30
          );
          generateDisplay(
            linear_points,
            colors,
            true,
            false,
            scp[3] * 3 * 30,
            scp[1].length * 3 + scp[3] * 3 * 30
          );
          // generateDisplay(scene, camera, dpsz.slice(start, start + length), false, false, start)
          // generateDisplay(scene, camera, dpsz.slice(start + length, psz.length + start), true, false, (start + length - 1) % psz.length)
          // connectEnds(scene)
          // generateDisplay(scp[1], true)
        } else {
          boxLabel.innerHTML = "Open Form";
          scene.remove(currentGroup);
          generateDisplay(linear_points, colors, false, true, 0);
        }
      });

      stapleToggler.addEventListener("click", () => {
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
}