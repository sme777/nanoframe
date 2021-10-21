import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as dat from 'dat.gui'
import * as RoutingHelpers from './routingHelpers' 
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';

const context = Object.freeze({
    planeMode: Symbol("plane"),
    objectMode: Symbol("object"),
})

const graph_json = JSON.parse(document.getElementById("generator-container").value)

const segments = graph_json["segments"]
const lineSegments = graph_json["lineSegments"]
const planeRoutings = graph_json["planes"]
const dimension = 30 // setup from user choice

console.log(graph_json)

const cubeGroup = RoutingHelpers.makeCubeGroup(dimension, segments)
let planes = RoutingHelpers.makePlanes(dimension, segments)
let routings = RoutingHelpers.makeRoutings(planeRoutings)
let planeAndRoutingGroups = []
const planeNeighbors = RoutingHelpers.planeNeighbors(planes)

// for (let i = 0; i < planes.length; i++) {
//     const gr = new THREE.Group()
//     gr.add(planes[i])
//     gr.add(routings[i])
//     planeAndRoutingGroups.push(gr)
// }

let current = "front"
let switchContext = context.planeMode
let insetWidth
let insetHeight

const canvas = document.querySelector("#router-webgl")
let canvasContainer = document.querySelector(".router-container")
let canvasContainerWidth = canvasContainer.offsetWidth
let canvasContainerHeight = canvasContainer.offsetHeight

const scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(70, canvasContainerWidth / canvasContainerHeight, 0.01, 8000)
camera.position.y = 25
// camera.position.z = 25
const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(0, 0, 0)

let renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
})
let prevCamera = camera
const camera2 = new THREE.PerspectiveCamera(40, 1, 1, 2000)
let camera2Object = cubeGroup
camera2.position.set(camera.position.x, camera.position.y + 200, camera.position.z)

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);

scene.add(camera)
scene.add(light)

// configure dat.gui

const gui = new dat.GUI({
    autoPlace: false
})
document.querySelector('.datGUI').append(gui.domElement)

let params = {
    color: 0xff00ff
}

gui.add(params, "color")
let guiElements = []

const OrbitControls = oc(THREE)
let controls = new OrbitControls(camera, renderer.domElement)

if (switchContext == context.planeMode) {
    controls.enableRotate = false
}
let currPlane = planes[0] 
cubeGroup.position.z = 2000
scene.add(cubeGroup)
scene.add(currPlane)


window.addEventListener( 'resize', onWindowResize )
onWindowResize()

// DNA scaffold

const points = [];
for (let j = 0; j < 7.5; j += 0.1) {
  points.push(-15 + j, 0, 0);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points.push(-7.5, 0, j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points.push(-7.5 + j, 0, 7.5);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points.push(0, 0, 7.5 + j);
}
const line = new MeshLine();
line.setPoints(points);
const material = new MeshLineMaterial();
material.color.setHex(0xff0000)
material.lineWidth = 0.2
const meshik = new THREE.Mesh(line, material);
scene.add(meshik);


// part 2
const points2 = [];
for (let j = 0; j < 7.5; j += 0.1) {
  points2.push(-15 + j, 0, -7.5);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points2.push(-7.5, 0, -7.5+j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points2.push(-7.5 + j, 0, 0);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points2.push(0, 0, j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points2.push(j, 0, 7.5);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points2.push(7.5, 0, 7.5+j);
}
const line2 = new MeshLine();
line2.setPoints(points2);
const meshik2 = new THREE.Mesh(line2, material);
scene.add(meshik2);

// part 3
const points3 = [];
for (let j = 0; j < 7.5; j += 0.1) {
  points3.push(-7.5, 0, -15+j);
}
for (let j = 0; j < 7.3; j += 0.1) {
    points3.push(-7.5+j, 0, -7.5);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points3.push(0, 0, -7.5+j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points3.push(j, 0, 0);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points3.push(7.5, 0, j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points3.push(7.5+j, 0, 7.5);
}

const line3 = new MeshLine();
line3.setPoints(points3);
const meshik3 = new THREE.Mesh(line3, material);
scene.add(meshik3);

// part 4
const points4 = [];
for (let j = 0; j < 7.5; j += 0.1) {
  points4.push(0, 0, -15+j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points4.push(j, 0, -7.5);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points4.push(7.5, 0, -7.5+j);
}

for (let j = 0; j < 7.5; j += 0.1) {
    points4.push(7.5+j, 0, 0);
}

const line4 = new MeshLine();
line4.setPoints(points4);
const meshik4 = new THREE.Mesh(line4, material);
scene.add(meshik4);

// part 5
const points5 = [];
for (let j = 0; j < 7.5; j += 0.1) {
  points5.push(7.5, 0, -15+j);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points5.push(7.5+j, 0, -7.5);
}


const line5 = new MeshLine();
line5.setPoints(points5);
const meshik5 = new THREE.Mesh(line5, material);
scene.add(meshik5);

// part 6
const points6 = [];
for (let j = 0; j < 7.5; j += 0.1) {
  points6.push(-15+j, 0, 7.5);
}
for (let j = 0; j < 7.5; j += 0.1) {
    points6.push(-7.5, 0, 7.5+j);
}


const line6 = new MeshLine();
line6.setPoints(points6);
const meshik6 = new THREE.Mesh(line6, material);
scene.add(meshik6);

function getSegmentAttributes(index) {
    let positions = []
    let colors = []
    let l
    // call hilbert space
    let vectors = vectorizePlane(index)
    for (let v = 0; v < vectors.length; v++) {

        const points1 = vectors[v]
        const spline1 = new THREE.CatmullRomCurve3(points1)
        const divisions1 = Math.round(12 * points1.length)
        const point = new THREE.Vector3()

        for (let i = 0; l = divisions1, i < l; i++) {
            const t = i / l
            spline1.getPoint(t, point)
            positions.push(point.x, point.y, point.z)
            colors.push(t, t, t)
        }
    }


    return [positions, colors]
}

function vectorizePlane(index) {
    const planeRouting = planeRoutings[index]
    const planeEdges = planeRouting["edges"]
    let vectorGroups = []

    for (let i = 0; i < planeEdges.length; i++) {
        let edge = planeEdges[i]

        const v1 = edge.v1
        const v2 = edge.v2

        if (vectorGroups.length == 0) {
            vectorGroups.push([new THREE.Vector3(v1.x, v1.y, v1.z),
                new THREE.Vector3(v2.x, v2.y, v2.z)
            ])
        } else {
            let lastGroup = vectorGroups[vectorGroups.length - 1]
            if (equalsVector(v1, lastGroup[lastGroup.length - 1])) {
                lastGroup.push(new THREE.Vector3(v2.x, v2.y, v2.z))
                vectorGroups[vectorGroups.length - 1] = lastGroup
            } else {
                vectorGroups.push([new THREE.Vector3(v1.x, v1.y, v1.z),
                    new THREE.Vector3(v2.x, v2.y, v2.z)
                ])
            }
        }
    }
    return vectorGroups
}

function equalsVector(v1, v2) {
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v2.z)
}


function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
    }
    return needResize
}

function onWindowResize() {

    camera.aspect = canvasContainerWidth / canvasContainerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( canvasContainerWidth, canvasContainerHeight );

    insetWidth = canvasContainerHeight / 4
    insetHeight = canvasContainerHeight / 4

    camera2.aspect = insetWidth / insetHeight
    camera2.updateProjectionMatrix()
}

function render(time) {
    renderer.setClearColor( 0x000000, 0 );
    renderer.setViewport( 0, 0, canvasContainerWidth, canvasContainerHeight );
    // matLine.resolution.set( canvasContainerWidth, canvasContainerHeight ); // resolution of the viewport

    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)
    renderer.setClearColor( 0xf5f5f5, 1 );

    renderer.clearDepth(); // important!

    renderer.setScissorTest( true );

    renderer.setScissor( 20, 20, insetWidth, insetHeight );

    renderer.setViewport( 20, 20, insetWidth, insetHeight );

    if (switchContext == context.planeMode) {
        cubeGroup.rotation.z = time * 0.1


        camera2.position.set(camera2Object.position.x , camera2Object.position.y + 60, camera2Object.position.z)
        camera2.quaternion.copy(camera.quaternion)

        renderer.render( scene, camera2 )

        
    }
    renderer.setScissorTest( false )
    // camera2Object.quaternion.copy(camera.quaternion)


    requestAnimationFrame(render)
}

requestAnimationFrame(render)
renderer.render(scene, camera)

// DOM modifiers

document.querySelector(".select-container").style.display = 'none'

document.getElementById("select-btn").addEventListener("click", () => {
    const selectionDiv = document.querySelector(".select-container")
    
    if (selectionDiv.style.display == 'none') {
        selectionDiv.style.display = 'block'
        document.querySelector(".insertion-elem").classList.remove("active")
        document.querySelector(".deletion-elem").classList.remove("active")
        document.querySelector(".select-elem").classList.add("active")
    } else {
        selectionDiv.style.display = 'none'
        document.querySelector(".select-elem").classList.remove("active")
    }
})

document.getElementById("select-strand-btn").addEventListener("click", () => {
    const strand = document.querySelector(".strand-elem")
    if (strand.classList.contains("bg-warning")) {
        strand.classList.remove("bg-warning")
    } else {
        document.querySelector(".crossover-elem").classList.remove("bg-warning")
        document.querySelector(".three-elem").classList.remove("bg-warning")
        document.querySelector(".five-elem").classList.remove("bg-warning")
        document.querySelector(".loopout-elem").classList.remove("bg-warning")
        strand.classList.add("bg-warning")
    }
})

document.getElementById("select-three-prime-btn").addEventListener("click", () => {
    const threePrime = document.querySelector(".three-elem")
    if (threePrime.classList.contains("bg-warning")) {
        threePrime.classList.remove("bg-warning")
    } else {
        document.querySelector(".crossover-elem").classList.remove("bg-warning")
        document.querySelector(".strand-elem").classList.remove("bg-warning")
        document.querySelector(".five-elem").classList.remove("bg-warning")
        document.querySelector(".loopout-elem").classList.remove("bg-warning")
        threePrime.classList.add("bg-warning")
    }
})

document.getElementById("select-five-prime-btn").addEventListener("click", () => {
    const fivePrime = document.querySelector(".five-elem")
    if (fivePrime.classList.contains("bg-warning")) {
        fivePrime.classList.remove("bg-warning")
    } else {
        document.querySelector(".strand-elem").classList.remove("bg-warning")
        document.querySelector(".three-elem").classList.remove("bg-warning")
        document.querySelector(".crossover-elem").classList.remove("bg-warning")
        document.querySelector(".loopout-elem").classList.remove("bg-warning")
        fivePrime.classList.add("bg-warning")
    }
})

document.getElementById("select-crossover-btn").addEventListener("click", () => {
    const crossover = document.querySelector(".crossover-elem")
    if (crossover.classList.contains("bg-warning")) {
        crossover.classList.remove("bg-warning")
    } else {
        document.querySelector(".strand-elem").classList.remove("bg-warning")
        document.querySelector(".three-elem").classList.remove("bg-warning")
        document.querySelector(".five-elem").classList.remove("bg-warning")
        document.querySelector(".loopout-elem").classList.remove("bg-warning")
        crossover.classList.add("bg-warning")
    }
})


document.getElementById("select-loopout-btn").addEventListener("click", () => {
    const loopout = document.querySelector(".loopout-elem")
    if (loopout.classList.contains("bg-warning")) {
        loopout.classList.remove("bg-warning")
    } else {
        document.querySelector(".strand-elem").classList.remove("bg-warning")
        document.querySelector(".three-elem").classList.remove("bg-warning")
        document.querySelector(".five-elem").classList.remove("bg-warning")
        document.querySelector(".crossover-elem").classList.remove("bg-warning")
        loopout.classList.add("bg-warning")
    }
})

document.getElementById("insertion-btn").addEventListener("click", () => {

    let insertion = document.querySelector(".insertion-elem")
    if (insertion.classList.contains("active")) {
        insertion.classList.remove("active")
    } else {
        insertion.classList.add("active")
        document.querySelector(".deletion-elem").classList.remove("active")
        document.querySelector(".select-elem").classList.remove("active")
        document.querySelector(".select-container").style.display = 'none'
    }
})

document.getElementById("deletion-btn").addEventListener("click", () => {

    let deletion = document.querySelector(".deletion-elem")
    if (deletion.classList.contains("active")) {
        deletion.classList.remove("active")
    } else {
        deletion.classList.add("active")
        document.querySelector(".insertion-elem").classList.remove("active")
        document.querySelector(".select-elem").classList.remove("active")
        document.querySelector(".select-container").style.display = 'none'
    }
})

// switch view from plane to 3d object or vice versa

document.getElementById("switch-view-btn").addEventListener("click", () => {
    if (switchContext == context.objectMode) {
        
        controls.enableRotate = false
        cubeGroup.position.z = 2000
        currPlane.position.set(0, 0, 0)
        // camera.rotation.set(0, 0, 0)??
        // camera.updateMatrix()
        console.log(camera)
        camera = prevCamera
        controls = new OrbitControls(camera, renderer.domElement)
        // camera2Object = cubeGroup
        switchContext = context.planeMode
        camera.position.y = 25
        scene.add(camera2)

        scene.add(meshik)
        scene.add(meshik2)
        scene.add(meshik3)
        scene.add(meshik4)
        scene.add(meshik5)
        scene.add(meshik6)
        document.querySelector(".switch-elem").classList.remove("active")

        
    } else {
        controls.enableRotate = true
        currPlane.position.set(0, 0, 2000)
        cubeGroup.position.z = 0
        console.log(camera)
        prevCamera = camera.clone()
        switchContext = context.objectMode
        camera.position.y = 40
        // console.log(cubeGroup)
        scene.remove(camera2)
        scene.remove(meshik)
        scene.remove(meshik2)
        scene.remove(meshik3)
        scene.remove(meshik4)
        scene.remove(meshik5)
        scene.remove(meshik6)
        document.querySelector(".insertion-elem").classList.remove("active")
        document.querySelector(".deletion-elem").classList.remove("active")
        document.querySelector(".select-elem").classList.remove("active")
        document.querySelector(".switch-elem").classList.add("active")
    }
    
})


document.getElementById("up-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["up"]
    current = res[0]
    currPlane = res[1]
    scene.add(currPlane)
    console.log("up pressed")
})


document.getElementById("down-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["down"]
    current = res[0]
    currPlane = res[1]
    scene.add(currPlane)
    console.log("down pressed")
})


document.getElementById("right-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["right"]
    current = res[0]
    currPlane = res[1]
    scene.add(currPlane)
    console.log("right pressed")
})


document.getElementById("left-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["left"]
    current = res[0]
    currPlane = res[1]
    scene.add(currPlane)
    console.log("left pressed")
})