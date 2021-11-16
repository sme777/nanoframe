import * as THREE from 'three'
import oc from 'three-orbit-controls'
import {Line2} from './threejs/Line2'
import { LineMaterial } from './threejs/LineMaterial'
import { LineGeometry } from './threejs/LineGeometry'
import { PLYExporter } from './threejs/PLYExporter'
import * as RoutingSamples from './routingSamples'
import * as dat from 'dat.gui'



console.log(document.getElementById("generator-container").value)
const graph_json = JSON.parse(document.getElementById("generator-container").value)
const segments = graph_json["segments"]
const scaffold_length = graph_json["scaffold_length"]
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
const planeRoutings = segments == 2 ? RoutingSamples.planeRoutings1x1x1 : graph_json["planes"] // RoutingSamples.planeRoutings1x1x1
let prevVertex
// let objectEdges = sortPlaneEdges(mergePlaneEdges())

// for sets
let takenSets = []
let objectSets = sortSets(mergeSets())
const simpleObjectSets = JSON.parse(JSON.stringify(objectSets))
objectSets = normalize(objectSets)


function normalize(vectors) {

    for (let i = 0; i < vectors.length; i++) {
        vectors[i].x *= segmentLength
        vectors[i].y *= segmentLength
        vectors[i].z *= segmentLength
        vectors[i].y -= 3.5*segmentLength
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
    // let edges = []
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

const spline = new THREE.CatmullRomCurve3( objectSets )
const divisions = Math.round( 12 * objectSets.length )
const point = new THREE.Vector3()
// const color = new THREE.Color()

for ( let i = 0, l = divisions; i < l; i ++ ) {

    const t = i / l

    spline.getPoint( t, point )
    positions.push( point.x, point.y, point.z )
    colors.push( t, t, t )

}

let routingPositions = []
for (let i = 0; i < scaffold_length; i++) {
    const t = i / scaffold_length
    spline.getPoint( t, point )
    routingPositions.push( point.x, point.y, point.z )

}
document.getElementById("routing-positions").value = JSON.stringify({"positions": routingPositions})
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

document.getElementById("set-values").value = JSON.stringify(simpleObjectSets)
