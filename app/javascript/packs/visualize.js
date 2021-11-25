import * as THREE from 'three'
import oc from 'three-orbit-controls'
import {
    Line2
} from './threejs/Line2'
import {
    LineMaterial
} from './threejs/LineMaterial'
import {
    LineGeometry
} from './threejs/LineGeometry'
import * as RoutingSamples from './routingSamples'
import * as Algorithms from "./algorithms"
import * as dat from 'dat.gui'

const graph_json = JSON.parse(document.getElementById("generator-container").value)
const segments = graph_json["segments"]
const scaffold_length = graph_json["scaffold_length"]
const canvas = document.getElementById("visualize-webgl")
// setup the dimensions of the shape
const width = graph_json["width"]
const height = graph_json["height"]
const depth = graph_json["depth"]
const widthSegmentLenth = width / segments
const heightSegmentLength = height / segments
const depthSegmentLength = depth / segments

let line, renderer, scene, camera, camera2, controls
let line1, line2, line3, line4, line5, line6, line7
let firstStartPoint, firstEndPoint
let lastStartPoint, lastEndPoint
// let matLine, matLineBasic, matLineDashed
let matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 10, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,

})

let matLineBasic = new THREE.LineBasicMaterial({
    vertexColors: true
})   
// viewport
let insetWidth
let insetHeight
let routingColors
let canvasContainer = document.querySelector(".visualizer-container")
let canvasContainerWidth = canvasContainer.offsetWidth
let canvasContainerHeight = canvasContainer.offsetHeight


renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(canvasContainerWidth, canvasContainerHeight)

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(40, canvasContainerWidth / canvasContainerHeight, 1, 1000)
camera.position.set(-40, 60, 90)

camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000)
camera2.position.copy(camera.position)

const OrbitControls = oc(THREE)
controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 10
controls.maxDistance = 500

// will need to replace with another function
const planeRoutings = segments == 2 ? RoutingSamples.planeRoutings1x1x1 : graph_json["planes"]
let prevVertex

// for sets
let takenSets = []
let objectSets = sortSets(mergeSets())

const start = performance.now()
let scp = Algorithms.findStrongestConnectedComponents(objectSets, 1 / 3, [width, height, depth])
const end = performance.now()

const simpleObjectSets = JSON.parse(JSON.stringify(objectSets))
objectSets = normalize(objectSets)
generateDisplay(objectSets)




/*
    Normalize the coordinates retireved fromn graph
    Width corresponds to X
    Height corresponds to Y
    Depth corresponds to Z
*/
function normalize(vectors) {

    for (let i = 0; i < vectors.length; i++) {
        vectors[i].x *= widthSegmentLenth
        vectors[i].y *= heightSegmentLength
        vectors[i].z *= depthSegmentLength
    }

    return vectors
}

function mergeSets() {
    let arr = []
    for (let i = 0; i < planeRoutings.length; i++) {
        for (let j = 0; j < planeRoutings[i].sets.length; j++)
            arr.push(planeRoutings[i].sets[j])
    }
    return arr
}

function sortSets(sets) {

    let edgeArr = []
    let next = sets[0]
    let edgesAndLastVertex = getEdgesFromSet(next)
    edgeArr = edgeArr.concat(edgesAndLastVertex[0])
    let counter = 0
    let lastVertex = edgesAndLastVertex[1]
    takenSets.push(sets[0])

    while (sets.length - 1 != counter) {

        next = findNextSet(sets, lastVertex)
        takenSets.push(next)
        edgesAndLastVertex = getEdgesFromSet(next)
        edgeArr = edgeArr.concat(edgesAndLastVertex[0])
        lastVertex = edgesAndLastVertex[1]
        counter += 1
    }
    edgeArr.push(new THREE.Vector3(prevVertex.x, prevVertex.y, prevVertex.z))
    return edgeArr

}


function findNextSet(sets, lastVertex) {

    for (let s = 0; s < sets.length; s++) {
        let set = sets[s]
        for (let e = 0; e < set.edges.length; e++) {
            let edge = set.edges[e]
            if (equalsVector(lastVertex, edge.v1) || equalsVector(lastVertex, edge.v2)) {
                if (!takenSets.includes(set)) {
                    return set
                }
            }
        }
    }
    return null
}

function getEdgesFromSet(set) {

    let vectors = []
    const edges = set.edges
    let lastVertex
    for (let i = edges.length - 1; i >= 0; i--) {

        if (!includesVector(vectors, edges[i].v1)) {
            vectors.push(vectorize(edges[i].v1))
        }
        if (!includesVector(vectors, edges[i].v2)) {
            vectors.push(vectorize(edges[i].v2))
        }
    }
    lastVertex = edges[0].v2
    if (equalsVector(lastVertex, prevVertex)) {
        lastVertex = edges[edges.length - 1].v1
        vectors = reverseArray(vectors)
    }
    prevVertex = lastVertex
    return [vectors.slice(0, -1), lastVertex]
}

function includesVector(vectors, v) {
    for (let i = 0; i < vectors.length; i++) {
        if (v.x == vectors[i].x && v.y == vectors[i].y && v.z == vectors[i].z) {
            return true
        }
    }
    return false
}

function reverseArray(v) {
    let arr = []
    for (let i = v.length - 1; i > -1; i--) {
        arr.push(v[i])
    }
    return arr
}


function equalsVector(v1, v2) {
    if (v1 == undefined || v2 == undefined) return false
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v2.z)
}

function vectorize(vertex) {
    return new THREE.Vector3(vertex.x, vertex.y, vertex.z)
}

function generateDisplay(edges, residualEdges=false, fullDisplay=true, start=0) {
    let positions = []
    let colors = []
    const spline = new THREE.CatmullRomCurve3(edges)
    const divisions = Math.round(12 * edges.length)
    const point = new THREE.Vector3()

    for (let i = 0, l = divisions; i < l; i++) {
        const t = i / l
        spline.getPoint(t, point)
        if (residualEdges) {
            positions.push(point.x - 30, point.y - 30, point.z + 60)
            
        } else {
            positions.push(point.x, point.y, point.z)
        }
        if (fullDisplay) {
            colors.push(0.5, 0.5, t)
        }
    }
    // set up first and last points
    if (!fullDisplay) {
        if (!residualEdges) {
            firstStartPoint = positions.slice(0, 3)
            firstEndPoint = positions.slice(-3)
        } else {
            lastStartPoint = positions.slice(0, 3)
            lastEndPoint = positions.slice(-3)
        }
    }

    if (fullDisplay) {
        routingColors = colors
    } else {
        colors = findColorSequnece(start, positions.length, divisions)
    }
    let routingPositions = []
    for (let i = 0; i < scaffold_length; i++) {
        const t = i / scaffold_length
        spline.getPoint(t, point)
        routingPositions.push(point.x, point.y, point.z)

    }
    document.getElementById("routing-positions").value = JSON.stringify({
        "positions": routingPositions
    })

    const geometry = new LineGeometry()
    geometry.setPositions(positions)
    geometry.setColors(colors)

    if (!residualEdges) {
        line = new Line2(geometry, matLine)
        line.computeLineDistances()
        line.scale.set(1, 1, 1)
        scene.add(line)
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        line1 = new THREE.Line(geo, matLineBasic)
        line1.computeLineDistances()
        line1.visible = false
        scene.add(line1)
        camera.lookAt(line.position)
        if (fullDisplay) {
            line.geometry.center()
        }
        
        camera.lookAt(line.position)
        

    } else {
        line2 = new Line2(geometry, matLine)
        line2.computeLineDistances()
        line2.scale.set(1, 1, 1)
        scene.add(line2)
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        line3 = new THREE.Line(geo, matLineBasic)
        line3.computeLineDistances()
        line3.visible = false
        scene.add(line3)
    }
}

function findColorSequnece(start, length, divs) {
    let count = 0
    let modIndex
    let subarray = []
    let adjStart = start * 12 * 3
    for (let i = adjStart; count < length; i++, count++) {
        modIndex = i % routingColors.length
        subarray.push(routingColors[modIndex])
    }
    return subarray
}

function connectEnds() {
    let [positions, colors] = getCurvePoints(lastStartPoint, firstEndPoint)
    // let colors = Array(30).fill(0.5)
    let geometry = new LineGeometry()
    geometry.setPositions(positions)
    geometry.setColors(colors)
    line4 = new Line2(geometry, matLine)
    line4.computeLineDistances()
    line4.scale.set(1, 1, 1)
    scene.add(line4)
    let geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    line5  = new THREE.Line(geo, matLineBasic)
    scene.add(line5)

    let [positions2, colors2] = getCurvePoints(lastEndPoint, firstStartPoint)
    geometry = new LineGeometry()
    geometry.setPositions(positions2)
    geometry.setColors(colors2)

    line6 = new Line2(geometry, matLine)
    line6.computeLineDistances()
    line6.scale.set(1, 1, 1)
    scene.add(line6)
    geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3))
    line7  = new THREE.Line(geo, matLineBasic)
    scene.add(line7)
}

function getCurvePoints(start, end) {
    let positions = []
    let colors = []
    const divisions = 96
    const point = new THREE.Vector3()
    const spline = new THREE.CatmullRomCurve3([new THREE.Vector3(start[0], start[1], start[2]), new THREE.Vector3(end[0], end[1], end[2])])
    for (let i = 0, l = divisions; i < l; i++) {
        const t = i / l
        spline.getPoint(t, point)
        positions.push(point.x + (Math.random() - 0.5), point.y + (Math.random() - 0.5), point.z + (Math.random() - 0.5))
        colors.push(t, 0.5, t)
    }

    return [positions, colors]
}

function clearDisplay() {
    if (line != undefined) {
        line.geometry.dispose()
        line.material.dispose()
        scene.remove(line)
    }

    if (line1 != undefined) {
        line1.geometry.dispose()
        line1.material.dispose()
        scene.remove(line1)
    }

    if (line2 != undefined) {
        line2.geometry.dispose()
        line2.material.dispose()
        scene.remove(line2)
    }

    if (line3 != undefined) {
        line3.geometry.dispose()
        line3.material.dispose()
        scene.remove(line3)
    }

    if (line4 != undefined) {
        line4.geometry.dispose()
        line4.material.dispose()
        scene.remove(line4)
    }

    if (line5 != undefined) {
        line5.geometry.dispose()
        line5.material.dispose()
        scene.remove(line5)
    }


    if (line6 != undefined) {
        line6.geometry.dispose()
        line6.material.dispose()
        scene.remove(line6)
    }


    if (line7 != undefined) {
        line7.geometry.dispose()
        line7.material.dispose()
        scene.remove(line7)
    }


}
window.addEventListener('resize', onWindowResize)
onWindowResize()

requestAnimationFrame(render)

function onWindowResize() {

    camera.aspect = canvasContainerWidth / canvasContainerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasContainerWidth, canvasContainerHeight);

    insetWidth = canvasContainerHeight / 4; // square
    insetHeight = canvasContainerHeight / 4;

    camera2.aspect = insetWidth / insetHeight;
    camera2.updateProjectionMatrix();

}

function render() {

    // main scene

    renderer.setClearColor(0x000000, 0);

    renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);

    // renderer will set this eventually
    matLine.resolution.set(canvasContainerWidth, canvasContainerHeight); // resolution of the viewport

    // gpuPanel.startQuery();
    renderer.render(scene, camera);
    // gpuPanel.endQuery();

    // inset scene

    renderer.setClearColor(0xf5f5f5, 1);

    renderer.clearDepth(); // important!

    renderer.setScissorTest(true);

    renderer.setScissor(20, 20, insetWidth, insetHeight);

    renderer.setViewport(20, 20, insetWidth, insetHeight);

    camera2.position.copy(camera.position);
    camera2.quaternion.copy(camera.quaternion);

    // renderer will set this eventually
    matLine.resolution.set(insetWidth, insetHeight); // resolution of the inset viewport

    renderer.render(scene, camera2);

    renderer.setScissorTest(false);
    requestAnimationFrame(render)

}

document.getElementById("set-values").value = JSON.stringify(simpleObjectSets)



const box = document.getElementById("box-state")
const boxLabel = document.getElementById("box-state-label")

box.addEventListener("click", () => {
    if (box.checked) {
        boxLabel.innerHTML = "Close Form"
        clearDisplay()
        generateDisplay(scp[0], false, false, scp[2])
        generateDisplay(scp[1], true, false, scp[3])
        connectEnds()
        // generateDisplay(scp[1], true)
    } else {
        boxLabel.innerHTML = "Open Form"
        clearDisplay()
        generateDisplay(objectSets, false, true, 0)
    }
})



console.log(`Finding Strongest Components took ${end-start} milliseconds.`)