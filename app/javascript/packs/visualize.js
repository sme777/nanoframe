import * as THREE from 'three'
import oc from 'three-orbit-controls'
import {Line2} from './threejs/Line2'
import { LineMaterial } from './threejs/LineMaterial'
import { LineGeometry } from './threejs/LineGeometry'
import * as GeometryUtils from './threejs/GeometryUtils'
import * as dat from 'dat.gui'




const graph_json = JSON.parse(document.getElementById("generator-container").value)
const segments = graph_json["segments"]
console.log(graph_json["sets"])
const set = graph_json["sets"][0]

const canvas = document.getElementById("visualize-webgl")

let line, renderer, scene, camera, camera2, controls
let line1
let matLine, matLineBasic, matLineDashed
// let stats, gpuPanel;
// let gui = new dat.GUI()

// viewport
let insetWidth
let insetHeight

// init()

let canvasContainer = document.querySelector(".visualizer-container")
let canvasContainerWidth = canvasContainer.offsetWidth
let canvasContainerHeight = canvasContainer.offsetHeight

renderer = new THREE.WebGLRenderer( { canvas: canvas, alpha: true, antialias: true } )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( canvasContainerWidth, canvasContainerHeight )

scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera( 40, canvasContainerWidth / canvasContainerHeight, 1, 1000 )
camera.position.set( - 40, 0, 60 )

camera2 = new THREE.PerspectiveCamera( 40, 1, 1, 1000 )
camera2.position.copy( camera.position )

const OrbitControls = oc(THREE)
controls = new OrbitControls( camera, renderer.domElement )
controls.minDistance = 10
controls.maxDistance = 500

// Position and THREE.Color Data

const positions = []
const colors = []

const points = GeometryUtils.hilbert3D(set.edges)
// console.log(points)
const spline = new THREE.CatmullRomCurve3( points )
const divisions = Math.round( 12 * points.length )
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
