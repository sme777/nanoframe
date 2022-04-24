import * as THREE from "three";
import oc from "three-orbit-controls";
import DragControls from "three-dragcontrols";
import * as RoutingHelpers from "./routingHelpers";
import * as RoutingControls from "./routingControls";
import * as VisualizeHelpers from "./visualizeHelpers";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { Edge } from "./edge";
import { GenerateStaple } from "./staple";


// const scaffoldSequence = document.getElementById("scaffold-container").value;
// const segments = 5;

// unpack dimensions
// const width = graph["width"];
// const height = graph["height"];
// const depth = graph["depth"];
// const dimension = 50;
// const cubeGroup = RoutingHelpers.makeCubeGroup(
//   [width, height, depth],
//   segments
// );
let planes = RoutingHelpers.makePlanes(dimensions, segments);
const planeNeighbors = RoutingHelpers.planeNeighbors(planes);
const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

let current = "front";

let insetWidth;
let insetHeight;

const canvas = document.querySelector("#router-webgl");
let canvasContainer = document.querySelector(".router-container");
let canvasContainerWidth = canvasContainer.offsetWidth;
let canvasContainerHeight = canvasContainer.offsetHeight;

const scene = new THREE.Scene();
console.log(planes[0])
let camera = new THREE.PerspectiveCamera(
  70,
  canvasContainerWidth / canvasContainerHeight,
  0.01,
  8000
);
let initialCameraHeightPosition = 40;
camera.position.y = initialCameraHeightPosition;
// camera.position.z = 25
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(0, 0, 0);

let renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});

const greenHex = [
  0x50c878, 0x5f8575, 0x4f7942, 0x228b22, 0x7cfc00, 0x008000, 0x355e3b,
  0x00a36c, 0x2aaa8a, 0x4cbb17, 0x93c572,
];

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
// change this attribute when edit menu is selected
let isRaycastMode = false;

let prevCamera = camera;
const camera2 = new THREE.PerspectiveCamera(40, 1, 1, 2000);
// let camera2Object = cubeGroup;
camera2.position.set(
  camera.position.x,
  camera.position.y + 200,
  camera.position.z
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);

scene.add(camera);
scene.add(light);

const OrbitControls = oc(THREE);
let controls = new OrbitControls(camera, renderer.domElement);

if (
  RoutingControls.getSwitchContext() == RoutingControls.getContext().planeMode
) {
  controls.enableRotate = false;
}
let currIndex = 0;
let currPlane = planes[currIndex];
// cubeGroup.position.z = 2000;
// scene.add(cubeGroup);
scene.add(currPlane);

let dragControl = new DragControls(currPlane, camera, renderer.domElement);

// window.addEventListener("resize", onWindowResize);
// window.addEventListener("pointermove", onMouseMove);
// onWindowResize();

// DNA scaffold
// const material = new MeshLineMaterial()
// console.log(material)
// material.color.setHex(RoutingControls.viewParams.scaffold_color)
// material.lineWidth = 0.2
// material.color = new THREE.Color(0x29f4a2)
// material.resolution = resolution
// material.side = THREE.DoubleSide
// material.blending = THREE.AdditiveBlending

// function amplify(vertex, volume = dimension / segments) {
//   vertex.x *= volume;
//   vertex.x += -dimension / 2;
//   vertex.y *= volume;
//   vertex.z *= volume;
//   vertex.z += dimension / 2;
//   return vertex;
// }

// function findArrowVectors(vertex) {
//   const first = new THREE.Vector3(vertex.x + 1, vertex.y, vertex.z);
//   const second = new THREE.Vector3(vertex.x - 1, vertex.y, vertex.z);
//   const third = new THREE.Vector3(vertex.x, vertex.y, vertex.z + 1);
//   return [first, second, third];
// }

// function convertTransformAmplify(coordinate, side) {
//   // console.log(coordinate, side)
//   return RoutingHelpers.convertToStandardForm(coordinate, side);
//   // return amplify(
//   //   RoutingHelpers.transform(
//   //     RoutingHelpers.convertToStandardForm(coordinate, side)
//   //   )
//   // );
// }

// function standardizeAllStaples(stapleSets) {
//   for (let i = 0; i < stapleSets.length - 1; i++) {
//     for (let j = 0; j < stapleSets[i].positions.length; j++) {
//       stapleSets[i].positions[j].v1 = convertTransformAmplify(
//         stapleSets[i].positions[j].v1,
//         stapleSets[i].side
//       );
//       stapleSets[i].positions[j].v2 = convertTransformAmplify(
//         stapleSets[i].positions[j].v2,
//         stapleSets[i].side
//       );
//     }
//   }

//   return stapleSets;
// }

// function standardizeAllPlanes(planeSets) {
//   for (let i = 0; i < planeSets.length; i++) {
//     for (let j = 0; j < planeSets[i].edges.length; j++) {
//       planeSets[i].edges[j].v1 = amplify(
//         RoutingHelpers.transform(planeSets[i].edges[j].v1)
//       );
//       planeSets[i].edges[j].v2 = amplify(
//         RoutingHelpers.transform(planeSets[i].edges[j].v2)
//       );
//     }
//   }
//   return planeSets;
// }

// // start adding mesh lines for scaffold
// function generatePlaneScaffoldRouting(index) {
//   const stanardizedPlaneSets = standardizeAllPlanes(
//     JSON.parse(JSON.stringify(rawGraph.planes[index].sets))
//   );
//   let setGroups = new THREE.Group();
//   for (let i = 0; i < stanardizedPlaneSets.length; i++) {
//     let strand = GenerateStaple(
//       stanardizedPlaneSets[i].edges,
//       greenHex[i % greenHex.length]
//     );
//     setGroups.add(strand);
//   }
//   return setGroups;
// }

// // let planeRoutes = generatePlaneScaffoldRouting(currIndex);
// // scene.add(planeRoutes);

// function onMouseMove(event) {
//   if (!isRaycastMode) {
//     return;
//   }
//   mouse.set(
//     (event.clientX / window.innerWidth) * 2 - 1,
//     -(event.clientY / window.innerHeight) * 2 + 1
//   );

//   // raycaster.setFromCamera( pointer, camera )
//   const intersects = raycaster.intersectObjects(scene, false);
//   // const intersects = raycaster.intersectObjects( scaffold, false )
//   if (intersects.length > 0) {
//     const intersect = intersects[0];

//     rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
//     rollOverMesh.position
//       .divideScalar(50)
//       .floor()
//       .multiplyScalar(50)
//       .addScalar(25);
//   }

//   render();
// }
// let sequenceDivison = [];
// // const es = createEdgeStrands();
// // console.log(es)
// // const mps = createAdjacentEdgeMap();
// // console.log(mps);
// // console.log(mps)
// // const [staples, descriptions, positions] = generateStapleStrands(
// //   mps[0],
// //   mps[1]
// // );
// // console.log(staples, positions)
// // let staplesGroup = generatePlaneStapleRouting(currIndex);
// // scene.add(staplesGroup);

// function generatePlaneStapleRouting(currIndex) {
//   const map = RoutingHelpers.planeStringToNum();
//   const staplePositions = JSON.parse(JSON.stringify(positions));
//   const stanardizedStapleSets = standardizeAllStaples(staplePositions);
//   let edgeGroups = new THREE.Group();

//   for (let i = 0; i < stanardizedStapleSets.length - 1; i++) {
//     if (map[staplePositions[i].side] == currIndex) {
//       edgeGroups.add(
//         GenerateStaple(stanardizedStapleSets[i].positions, 0xff0000, 0.5, true)
//       );
//     }
//   }
//   return edgeGroups;
// }

// function createAdjacentEdgeMap() {
//   let edgeMap = {};
//   let stringMap = {};
//   // let es = sets['vertices']
//   console.log(es);
//   for (let i = 0; i < es.length; i++) {
//     let arr = [];
//     let arr2 = [];

//     for (let j = 0; j < es.length; j++) {
//       if (!(i == j || es[i] == es[j])) {
//         if (VisualizeHelpers.equalsVector(es[i].v2, es[j].v1)) {
//           if (Math.abs(i - j) < 2) {
//             if (RoutingHelpers.isOutgoerEdge(es[i].v2, segments)) {
//               arr.push(es[j]);
//               arr2.push(RoutingHelpers.edgeToString(es[j]));
//             }
//           } else if (!RoutingHelpers.isStraightLine(es[i].v1, es[j].v2)) {
//             arr.push(es[j]);
//             arr2.push(RoutingHelpers.edgeToString(es[j]));
//           }
//         }
//       }
//     }
//     if (arr.length != 0) {
//       edgeMap[RoutingHelpers.edgeToString(es[i])] = arr;
//       stringMap[RoutingHelpers.edgeToString(es[i])] = es[i];
//     }
//   }
//   return [edgeMap, stringMap];
// }

// //create edges with strands
// // function createEdgeStrands() {
// //   let edgeSequence;
// //   let edges = [];
// //   const edgeLength = Math.floor(dimension / segments / 0.332);
// //   // console.log(dimension, segments)
// //   let newEdge;
// //   // console.log('here', sets)
// //   for (let i = 0; i < sets["vertices"].length; i++) {
// //     if (i == sets["vertices"].length - 1) {
// //       edgeSequence = scaffoldSequence.slice(i * edgeLength);
// //       sequenceDivison.push(edgeSequence);
// //       newEdge = new Edge(
// //         sets["vertices"][i],
// //         sets["vertices"][0],
// //         edgeSequence,
// //         edgeLength,
// //         null
// //       );
// //       edges.push(newEdge);
// //     } else {
// //       edgeSequence = scaffoldSequence.slice(
// //         i * edgeLength,
// //         i * edgeLength + edgeLength
// //       );
// //       sequenceDivison.push(edgeSequence);
// //       newEdge = new Edge(
// //         sets["vertices"][i],
// //         sets["vertices"][i + 1],
// //         edgeSequence,
// //         edgeLength,
// //         null
// //       );
// //       edges.push(newEdge);
// //     }
// //   }
// //   edges = setNextAndPrev(edges);
// //   return edges;
// // }

// function setNextAndPrev(edges) {
//   let curr;
//   for (let i = 0; i < edges.length; i++) {
//     curr = edges[i];
//     if (i == 0) {
//       curr.next = edges[i + 1];
//       curr.prev = edges[edges.length - 1];
//     } else if (i == edges.length - 1) {
//       curr.next = edges[0];
//       curr.prev = edges[i - 1];
//     } else {
//       curr.next = edges[i + 1];
//       curr.prev = edges[i - 1];
//     }
//   }
//   return edges;
// }

// function generateStapleStrands(edgeMap, stringMap) {
//   const edgeKeys = Object.keys(edgeMap);
//   let key;
//   let back;
//   let neighbors;
//   let isOutgoer;
//   let mergeBack;
//   let staples = [];
//   let stringBuilder = "";
//   let start;
//   let end;
//   let side;
//   let descriptions = [];
//   let descriptionMap = {};
//   let positions = [];
//   let type;
//   for (let i = 0; i < edgeKeys.length; i++) {
//     stringBuilder = "";
//     key = edgeKeys[i];
//     let curr = stringMap[key];
//     neighbors = edgeMap[edgeKeys[i]][0];
//     if (i == edgeKeys.length - 1) {
//       back = stringMap[key].sequence.slice(15);
//     } else {
//       back = stringMap[key].back;
//     }
//     if (i == edgeKeys.length - 1) {
//       mergeBack =
//         RoutingHelpers.translate(back) +
//         RoutingHelpers.translate(stringMap[edgeKeys[0]].front);
//     } else {
//       let extraBases = RoutingHelpers.findExtraBase(back, neighbors.front);
//       isOutgoer = RoutingHelpers.isOutgoerEdge(
//         stringMap[edgeKeys[i]].v2,
//         segments
//       );
//       if (isOutgoer) {
//         extraBases += RoutingHelpers.findExtraBase(back, neighbors.front);
//       }
//       mergeBack =
//         RoutingHelpers.translate(back) +
//         extraBases +
//         RoutingHelpers.translate(neighbors.front);
//     }

//     if (isOutgoer) {
//       type = "Refr";
//       stringBuilder += "Refr-";
//     } else {
//       type = "Refl";
//       stringBuilder += "Refl-";
//     }

//     // check sides
//     start = stringMap[edgeKeys[i]].v1;
//     end = stringMap[edgeKeys[i]].v2;
//     if (start.z == 0 && end.z == 0) {
//       side = "S1";
//       stringBuilder += "S1-";
//     } else if (start.z == -segments && end.z == -segments) {
//       side = "S2";
//       stringBuilder += "S2-";
//     } else if (start.x == 0 && end.x == 0) {
//       side = "S5";
//       stringBuilder += "S5-";
//     } else if (start.x == segments && end.x == segments) {
//       side = "S6";
//       stringBuilder += "S6-";
//     } else if (start.y == 0 && end.y == 0) {
//       side = "S4";
//       stringBuilder += "S4-";
//     } else if (start.y == segments && end.y == segments) {
//       side = "S3";
//       stringBuilder += "S3-";
//     }
//     const [row, col] = findRowAndCol(stringMap[edgeKeys[i]], side);

//     stringBuilder += "R" + row + "-" + "C" + col;
//     if (!isOutgoer) {
//       if (descriptionMap[stringBuilder] == undefined) {
//         descriptionMap[stringBuilder] = 1;
//         stringBuilder += "-1";
//       } else {
//         descriptionMap[stringBuilder] += 1;
//         stringBuilder += "-" + descriptionMap[stringBuilder].toString();
//       }
//     }

//     descriptions.push(stringBuilder);
//     staples.push(mergeBack);
//     let arr;

//     let first;
//     let last;
//     if (curr.start.x - curr.end.x != 0) {
//       first = {
//         x: (curr.end.x + curr.start.x) / 2,
//         y: curr.start.y,
//         z: curr.start.z,
//       };
//     } else if (curr.start.y - curr.end.y != 0) {
//       first = {
//         x: curr.start.x,
//         y: (curr.end.y + curr.start.y) / 2,
//         z: curr.start.z,
//       };
//     } else {
//       first = {
//         x: curr.start.x,
//         y: curr.start.y,
//         z: (curr.end.z + curr.start.z) / 2,
//       };
//     }

//     if (curr.end.x - neighbors.end.x != 0) {
//       last = {
//         x: (neighbors.end.x + curr.end.x) / 2,
//         y: curr.end.y,
//         z: curr.end.z,
//       };
//     } else if (neighbors.end.y - curr.end.y != 0) {
//       last = {
//         x: curr.end.x,
//         y: (neighbors.end.y + curr.end.y) / 2,
//         z: curr.end.z,
//       };
//     } else {
//       last = {
//         x: curr.end.x,
//         y: curr.end.y,
//         z: (neighbors.end.z + curr.end.z) / 2,
//       };
//     }

//     positions.push({
//       positions: makeEdges(first, stringMap[key].end, last),
//       side: side,
//       type: type,
//     });
//   }
//   return [staples, descriptions, positions];
// }

// function makeEdges(first, middle, last) {
//   return [
//     { v1: middle, v2: last },
//     { v1: first, v2: middle },
//   ];
// }

// function findRowAndCol(edge, side) {
//   let edgeRow;
//   let edgeCol;
//   let col;
//   let row;
//   if (side == "S1" || side == "S2") {
//     edgeRow = segments - Math.abs(edge.v1.y) + 1;
//     edgeCol = edge.v1.x + 1;

//     if (edge.v1.x - edge.v2.x > 0) {
//       if (edge.next.v2.y > edge.v2.y) {
//         col = edgeCol - 1;
//         row = edgeRow;
//       } else {
//         col = edgeCol - 1;
//         row = edgeRow - 1;
//       }
//     } else if (edge.v1.x - edge.v2.x < 0) {
//       if (edge.next.v2.y > edge.v2.y) {
//         col = edgeCol;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     } else if (edge.v1.y - edge.v2.y > 0) {
//       if (edge.next.v2.x > edge.v2.x) {
//         col = edgeCol;
//         row = edgeRow - 1;
//       } else {
//         col = edgeCol;
//         row = edgeRow;
//       }
//     } else {
//       if (edge.next.v2.x > edge.v2.x) {
//         col = edgeCol - 1;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     }
//   } else if (side == "S3" || side == "S4") {
//     edgeRow = segments - Math.abs(edge.v1.z) + 1;
//     edgeCol = edge.v1.x + 1;

//     if (edge.v1.x - edge.v2.x > 0) {
//       if (edge.next.v2.z > edge.v2.z) {
//         col = edgeCol - 1;
//         row = edgeRow;
//       } else {
//         col = edgeCol - 1;
//         row = edgeRow - 1;
//       }
//     } else if (edge.v1.x - edge.v2.x < 0) {
//       if (edge.next.v2.z > edge.v2.z) {
//         col = edgeCol;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     } else if (edge.v1.z - edge.v2.z > 0) {
//       if (edge.next.v2.x > edge.v2.x) {
//         col = edgeCol;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     } else {
//       if (edge.next.v2.z > edge.v2.z) {
//         col = edgeCol - 1;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow;
//       }
//     }
//   } else if (side == "S5" || side == "S6") {
//     edgeRow = segments - Math.abs(edge.v1.y) + 1;
//     edgeCol = segments - Math.abs(edge.v1.z) + 1;

//     if (edge.v1.z - edge.v2.z > 0) {
//       if (edge.next.v2.y > edge.v2.y) {
//         col = edgeCol - 1;
//         row = edgeRow;
//       } else {
//         col = edgeCol - 1;
//         row = edgeRow - 1;
//       }
//     } else if (edge.v1.z - edge.v2.z < 0) {
//       if (edge.next.v2.y > edge.v2.y) {
//         col = edgeCol;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     } else if (edge.v1.y - edge.v2.y > 0) {
//       if (edge.next.v2.z > edge.v2.z) {
//         col = edgeCol;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     } else {
//       if (edge.next.v2.z > edge.v2.z) {
//         col = edgeCol - 1;
//         row = edgeRow;
//       } else {
//         col = edgeCol;
//         row = edgeRow - 1;
//       }
//     }
//   }

//   return [row, col];
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

// function onWindowResize() {
//   camera.aspect = canvasContainerWidth / canvasContainerHeight;
//   camera.updateProjectionMatrix();

//   renderer.setSize(canvasContainerWidth, canvasContainerHeight);

//   insetWidth = canvasContainerHeight / 4;
//   insetHeight = canvasContainerHeight / 4;

//   camera2.aspect = insetWidth / insetHeight;
//   camera2.updateProjectionMatrix();
// }

function render(time) {
  renderer.setClearColor(0x000000, 0);
  renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);
  // matLine.resolution.set( canvasContainerWidth, canvasContainerHeight ); // resolution of the viewport

  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
  renderer.setClearColor(0xf5f5f5, 1);

  renderer.clearDepth(); // important!

  renderer.setScissorTest(true);

  renderer.setScissor(20, 20, insetWidth, insetHeight);

  renderer.setViewport(20, 20, insetWidth, insetHeight);

  // if (
  //   RoutingControls.getSwitchContext() == RoutingControls.getContext().planeMode
  // ) {
  //   cubeGroup.rotation.z = time * 0.1;

  //   camera2.position.set(
  //     camera2Object.position.x,
  //     camera2Object.position.y + 100,
  //     camera2Object.position.z
  //   );
  //   camera2.quaternion.copy(camera.quaternion);

  //   renderer.render(scene, camera2);
  // }
  renderer.setScissorTest(false);
  // camera2Object.quaternion.copy(camera.quaternion)

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
renderer.render(scene, camera);

// DOM modifiers
/*
    Plane Numbers
    Front -> 0
    Back -> 1
    Top -> 2
    Bottom -> 3
    Left -> 4
    Right -> 5
*/

const dirs = ["right", "left", "up", "down"];
for (let i in dirs) {
  document
    .getElementById(`${dirs[i]}-key-button`)
    .addEventListener("click", () => {
      scene.remove(planeRoutes);
      scene.remove(staplesGroup);
      const res = planeNeighbors[current][dirs[i]];
      current = res[0];
      currIndex = res[2];
      planeRoutes = generatePlaneScaffoldRouting(currIndex);
      staplesGroup = generatePlaneStapleRouting(currIndex);
      scene.add(planeRoutes);
      scene.add(staplesGroup);
    });
}

// console.log(staples)
// console.log(staplesGroup)

// let t = "";
// for (var i = 0; i < staples.length; i++) {
//   var tr = "<tr>";
//   tr += "<td>" + (i + 1) + "</td>";
//   tr += "<td>" + descriptions[i] + "</td>";
//   tr += "<td>" + staples[i] + "</td>";
//   tr += "<td>" + staples[i].length + "</td>";
//   tr += "</tr>";
//   t += tr;
// }

// document.getElementById("staples_field").value = JSON.stringify(staples);
// document.getElementById("staples_descriptions_field").value =
//   JSON.stringify(descriptions);
// document.getElementById("staples_table").innerHTML += t;
