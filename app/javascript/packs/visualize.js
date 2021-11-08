import * as THREE from 'three'
import oc from 'three-orbit-controls'
import {Line2} from './threejs/Line2'
import { LineMaterial } from './threejs/LineMaterial'
import { LineGeometry } from './threejs/LineGeometry'
import * as GeometryUtils from './threejs/GeometryUtils'
import { PLYExporter } from './threejs/PLYExporter'
import * as RoutingSamples from './routingSamples'
import * as dat from 'dat.gui'




const graph_json = JSON.parse(document.getElementById("generator-container").value)
const segments = graph_json["segments"]

// const set = graph_json["sets"][0]

const canvas = document.getElementById("visualize-webgl")

let line, renderer, scene, camera, camera2, controls
let line1
let matLine, matLineBasic, matLineDashed
// let stats, gpuPanel;
// let gui = new dat.GUI()

// viewport
let insetWidth
let insetHeight
let dimensions = 30
let segmentLength = dimensions / segments
// init()

let canvasContainer = document.querySelector(".visualizer-container")
let canvasContainerWidth = canvasContainer.offsetWidth
let canvasContainerHeight = canvasContainer.offsetHeight

renderer = new THREE.WebGLRenderer( { canvas: canvas, alpha: true, antialias: true } )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( canvasContainerWidth, canvasContainerHeight )

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera( 40, canvasContainerWidth / canvasContainerHeight, 1, 1000 )
camera.position.set( -40, 30, 60 )

camera2 = new THREE.PerspectiveCamera( 40, 1, 1, 1000 )
camera2.position.copy( camera.position )

const OrbitControls = oc(THREE)
controls = new OrbitControls( camera, renderer.domElement )
controls.minDistance = 10
controls.maxDistance = 500

// Position and THREE.Color Data

const positions = []
const colors = []

// will need to replace with another function
console.log(segments)
const planeRoutings = segments == 2 ? RoutingSamples.planeRoutings1x1x1 : graph_json["planes"] // RoutingSamples.planeRoutings1x1x1
console.log(planeRoutings)
let takenEdges = []
let totalEdges = 0
let prevVertex
// let objectEdges = sortPlaneEdges(mergePlaneEdges())

// for sets
let takenSets = []
let visitedVertices = []
let objectSets = sortSets(mergeSets())
const simpleObjectSets = JSON.parse(JSON.stringify(objectSets))
objectSets = normalize(objectSets)


function normalize(vectors) {

    for (let i = 0; i < vectors.length; i++) {
        vectors[i].x *= segmentLength
        vectors[i].y *= segmentLength
        vectors[i].z *= segmentLength
        vectors[i].y -= 2*segmentLength
    }
    return vectors
}

function mergePlaneEdges() {
    let arr = []
    // console.log(planeRoutings)
    for (let i = 0; i < planeRoutings.length; i++) {
        const planeSets = planeRoutings[i].sets
        // console.log(planeSets[0].edges)
        for (let j = 0; j < planeSets.length; j++) {
            arr = arr.concat(planeSets[j].edges)
            totalEdges += planeSets[j].edges.length
        }
    }
    return arr
}


function mergeSets() {
    let arr = []
    for (let i = 0; i < planeRoutings.length; i++) {
        for (let j = 0; j < planeRoutings[i].sets.length; j++)
        arr.push(planeRoutings[i].sets[j])
    }
    // console.log(arr)
    return arr
}

function sortSets(sets) {

    let edgeArr = []
    let next = sets[0]
    let edgesAndLastVertex = getEdgesFromSet(next)
    edgeArr = edgeArr.concat(edgesAndLastVertex[0])
    let counter = 0
    let lastVertex = edgesAndLastVertex[1]
    // let prevVertex = lastVertex
    takenSets.push(sets[0])

    while (sets.length -1 != counter) {
      
        next = findNextSet(sets, lastVertex)

        takenSets.push(next)
        
        edgesAndLastVertex = getEdgesFromSet(next)
        edgeArr = edgeArr.concat(edgesAndLastVertex[0])
        lastVertex = edgesAndLastVertex[1]
        // prevVertex = lastVertex
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
    // console.log(set)
    for (let i = edges.length - 1; i >= 0; i--) {
        
        if (!includesVector(vectors, edges[i].v1)) {
            vectors.push(vectorize(edges[i].v1))
        }
        if (!includesVector(vectors, edges[i].v2)) {
            vectors.push(vectorize(edges[i].v2))
        }
    }
    // console.log(edges)
    lastVertex = edges[0].v2
    // console.log("here", lastVertex)
    if (equalsVector(lastVertex, prevVertex)) {
        lastVertex = edges[edges.length - 1].v1
        vectors = reverseArray(vectors)
    }
    prevVertex = lastVertex
    // console.log(lastVertex)
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


function sortPlaneEdges(arr) {
    // console.log(arr)
    let next = arr[0]
    takenEdges.push(next)
    let sortedArray = [vectorize(next.v1)]
    let counter = 0
    let edge
    while (counter != arr.length - 1) {
        edge = findNextEdge(arr, next)
        console.log(edge)
        takenEdges.push(edge)
        sortedArray.push(vectorize(edge.v1))
        next = edge
        counter += 1
    }
    console.log(sortedArray)
    return sortedArray
}


// returns next edge based on the end vertex of start edge
function findNextEdge(edges, prev) {
    // let edges_copy = JSON.parse(JSON.stringify(edges))
    for (let i = 0; i < edges.length; i++) {
        const curr = edges[i]
        if (equalsVector(curr.v1, prev.v2) && !takenEdge(curr)) {
            if (!straightPath(curr, prev) && !prematureLoop(curr)) {
                // console.log("fuck")
                // console.log(curr)
                return curr
            }
            
        } 
    }

    for (let i = 0; i < edges.length; i++) {
        const curr = edges[i]
        // console.log("called", i)
        if (equalsVector(curr.v2, prev.v2) && !takenEdge(curr)) {
            if (!straightPath(curr, prev) && !prematureLoop(curr)) {
                return reverseEdge(curr)
            } 
        } 
    }

    for (let i = 0; i < edges.length; i++) {
        const curr = edges[i]
        // console.log("called", i)
        if (equalsVector(curr.v2, prev.v1) && !takenEdge(curr)) {
            if (!straightPath(curr, prev) && !prematureLoop(curr)) {
                return reverseEdge(curr)
            } 
        } 
    }

    for (let i = 0; i < edges.length; i++) {
        const curr = edges[i]
        // console.log("called", i)
        if (equalsVector(curr.v1, prev.v2) && !takenEdge(curr)) {
            if (!straightPath(curr, prev) && !prematureLoop(curr)) {
                return curr
            } 
        } 
    }
    return null
}

function prematureLoop(edgeToAdd) {
    
    if (takenEdges.length == totalEdges) {
        return false
    }
    let startContained = false
    let endContained = false
    console.log(takenEdges)
    for (let i = 0; i < takenEdges.length; i++) {
        if (equalsVector(edgeToAdd.v1, takenEdges[i].v1) || equalsVector(edgeToAdd.v1, takenEdges[i].v2)) {
            startContained = true
        }
        if (equalsVector(edgeToAdd.v2, takenEdges[i].v1) || equalsVector(edgeToAdd.v2, takenEdges[i].v2)) {
            endContained = true
        }
    }
    return startContained && endContained
}

function reverseEdge(edge) {
    const v1 = {
        x: edge.v2.x,
        y: edge.v2.y,
        z: edge.v2.z
    }
    const v2 = {
        x: edge.v1.x,
        y: edge.v1.y,
        z: edge.v1.z
    }

    return {v1: v1, v2: v2}

}

function takenEdge(edge) {
    for (let i = 0; i < takenEdges.length; i++) {
        let edge2Compare = takenEdges[i]
        if ((edge2Compare.v1 == edge.v1 && edge2Compare.v2 == edge.v2) || (edge2Compare.v2 == edge.v1 && edge2Compare.v1 == edge.v2)) {
            return true
        } 
    }
    return false
}

function straightPath(curr, prev) {
    const currVertices = [curr.v1, curr.v2]
    const prevVertices = [prev.v1, prev.v2]
    // console.log(currVertices, prevVertices)
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (isStraighPath(currVertices[i], prevVertices[j])) {
                return true
            }
        }
    }
    return false
}

function isStraighPath(v1, v2) {
    let xDiff = Math.abs(v1.x - v2.x)
    let yDiff = Math.abs(v1.y - v2.y)
    let zDiff = Math.abs(v1.z - v2.z) 
    return (xDiff == dimensions) && (yDiff == 0) && (zDiff == 0)
    || (xDiff == 0) && (yDiff == dimensions) && (zDiff == 0)
    || (xDiff == 0) && (yDiff == 0) && (zDiff == dimensions)

}

function equalsVector(v1, v2) {
    if (v1 == undefined || v2 == undefined) return false
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v2.z)
}

function vectorize(vertex) {
    return new THREE.Vector3(vertex.x, vertex.y, vertex.z)
}

const spline = new THREE.CatmullRomCurve3( objectSets )
const divisions = Math.round( 12 * objectSets.length )
const point = new THREE.Vector3()
// const color = new THREE.Color()

for ( let i = 0, l = divisions; i < l; i ++ ) {

    const t = i / l

    spline.getPoint( t, point )
    positions.push( point.x, point.y, point.z )

    // color.setHSL( t, 1.0, 0.5 )
    colors.push( t, t, t )

}


// Line2 ( LineGeometry, LineMaterial )

const geometry = new LineGeometry()
geometry.setPositions( positions )
geometry.setColors( colors )

matLine = new LineMaterial( {

    color: 0xffffff,
    linewidth: 10, // in world units with size attenuation, pixels otherwise
    vertexColors: true,
    
    //resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true,

} )

line = new Line2( geometry, matLine )
line.computeLineDistances()
line.scale.set( 1, 1, 1 )
scene.add( line )

// exporter
const exporter = new PLYExporter()
const data = exporter.parse(line)
document.getElementById("ply-value").value = data

// middle coordinates
// let pos = new THREE.Vector3()
// geometry.boundingBox.getCenter(pos)
// camera.position.set(pos.x*2 , pos.y*2, pos.z*2)
const geo = new THREE.BufferGeometry()
geo.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
geo.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) )

matLineBasic = new THREE.LineBasicMaterial( { vertexColors: true } )
matLineDashed = new THREE.LineDashedMaterial( { vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 } )

line1 = new THREE.Line( geo, matLineBasic )
line1.computeLineDistances()
line1.visible = false
scene.add( line1 )

//

window.addEventListener( 'resize', onWindowResize )
onWindowResize()

requestAnimationFrame(render)

function onWindowResize() {

    camera.aspect = canvasContainerWidth / canvasContainerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( canvasContainerWidth, canvasContainerHeight );

    insetWidth = canvasContainerHeight / 4; // square
    insetHeight = canvasContainerHeight / 4;

    camera2.aspect = insetWidth / insetHeight;
    camera2.updateProjectionMatrix();

}

function render() {

    // main scene

    renderer.setClearColor( 0x000000, 0 );

    renderer.setViewport( 0, 0, canvasContainerWidth, canvasContainerHeight );

    // renderer will set this eventually
    matLine.resolution.set( canvasContainerWidth, canvasContainerHeight ); // resolution of the viewport

    // gpuPanel.startQuery();
    renderer.render( scene, camera );
    // gpuPanel.endQuery();

    // inset scene

    renderer.setClearColor( 0xf5f5f5, 1 );

    renderer.clearDepth(); // important!

    renderer.setScissorTest( true );

    renderer.setScissor( 20, 20, insetWidth, insetHeight );

    renderer.setViewport( 20, 20, insetWidth, insetHeight );

    camera2.position.copy( camera.position );
    camera2.quaternion.copy( camera.quaternion );

    // renderer will set this eventually
    matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport

    renderer.render( scene, camera2 );

    renderer.setScissorTest( false );
    requestAnimationFrame( render )

}

// document.getElementById("routing-btn").addEventListener("click", (e) => {
//     e.preventDefault()
//     let httpRequest
//     if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
//         httpRequest = new XMLHttpRequest();
//         console.log("FINE")
//     } else if (window.ActiveXObject) { // IE 6 and older
//         httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
//         console.log("ok?")
//     }
//     console.log("lol")
//     httpRequest.onreadystatechange = () => {

//     }

//     httpRequest.open('GET', '/nanobot/visualize_update', true);
//     httpRequest.send();
// })

let link = document.getElementById("routing-btn").href + "?sets=" + JSON.stringify(simpleObjectSets)
document.getElementById("routing-btn").href=link
