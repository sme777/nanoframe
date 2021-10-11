import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as dat from 'dat.gui'
import {
    Line2
} from './threejs/Line2'
import {
    LineMaterial
} from './threejs/LineMaterial'
import {
    LineGeometry
} from './threejs/LineGeometry'
import * as geometry1Utils from './threejs/GeometryUtils'


const graph_json = JSON.parse(document.getElementById("generator-container").value)

const segments = graph_json["segments"]
const lineSegments = graph_json["lineSegments"]
const planeRoutings = graph_json["planes"]


let planes = []
for (let j = 0; j < 6; j++) {
    const gridHelper = new THREE.GridHelper(30, segments)
    // gridHelper.geometry1.rotateX( Math.PI / 2 );
    planes.push(gridHelper)
}



let pointer = 0

const canvas = document.querySelector("#router-webgl")
let canvasContainer = document.querySelector(".router-container")
let canvasContainerWidth = canvasContainer.offsetWidth
let canvasContainerHeight = canvasContainer.offsetHeight

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, canvasContainerWidth / canvasContainerHeight, 0.01, 5000)
camera.position.y = 25
const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(0, 0, 0)

let renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvasContainerWidth, canvasContainerHeight);


scene.add(camera)
scene.add(light)

// configure dat.gui

const gui = new dat.GUI({
    autoPlace: false
})
document.querySelector('.datGUI').append(gui.domElement)
// console.log(planes[pointer])

let params = {
    color: 0xff00ff
}

gui.add(params, "color")
let guiElements = []

// const geometry1 = new THREE.Boxgeometry1(1, 1, 1)
// const material = new THREE.MeshPhongMaterial({color: 0x4562df})

// let cube = new THREE.Mesh(geometry1, material)
// scene.add(cube)
const OrbitControls = oc(THREE)
const controls = new OrbitControls(camera, renderer.domElement)

scene.add(planes[pointer])
// const gridHelper2 = new THREE.GridHelper(6, segments)
// scene.add(gridHelper2)


// event listeners for key inputs
// window.addEventListener('keypress', logKey)

// function logKey(e) {
//     if (e.keyCode == '38') {
//         console.log('up arrow')
//     } else if (e.keyCode == '40') {
//         console.log("down key")
//     } else if (e.keyCode == '37') {
//         console.log("left arrow")
//     } else if (e.keyCode == '39') {
//         console.log("shiish")
//     }
//     // if e.ley == ""
// }

// create sequence routing 
let points1 = [new THREE.Vector3(0, 0, 15), new THREE.Vector3(1, 0, 1), new THREE.Vector3(15, 0, 0)]
const spline1 = new THREE.CatmullRomCurve3(points1)
const divisions1 = Math.round( 12 * points1.length )
const point1 = new THREE.Vector3()

let positions1 = []
let colors1 = []
// const color = new THREE.Color()

for ( let i = 0, l = divisions1; i < l; i ++ ) {

    const t = i / l

    spline1.getPoint( t, point1 )
    positions1.push( point1.x, point1.y, point1.z )

    // color.setHSL( t, 1.0, 0.5 )
    colors1.push( t, t, t )

}


let points2 = [new THREE.Vector3(-15, 0, 0), new THREE.Vector3(-1, 0, -1), new THREE.Vector3(0, 0, -15)]
const spline2 = new THREE.CatmullRomCurve3(points2)
const divisions2 = Math.round( 12 * points2.length )
const point2 = new THREE.Vector3()

let positions2 = []
let colors2 = []
// const color = new THREE.Color()

for ( let i = 0, l = divisions2; i < l; i ++ ) {

    const t = i / l

    spline2.getPoint( t, point2 )
    positions2.push( point2.x, point2.y, point2.z )

    // color.setHSL( t, 1.0, 0.5 )
    colors2.push( t, t, t )

}



const geometry1 = new LineGeometry()
// const geoAttributes = vSet1
geometry1.setPositions(positions1)
geometry1.setColors(colors1)
// console.log(geometry1)
let matLine = new LineMaterial({
    color: 0xff0000,
    linewidth: 10,
    vertexColors: true,
    dashed: false,
    alphaToCoverage: true,

})
let line = new Line2(geometry1, matLine)
line.computeLineDistances()
line.scale.set(1, 1, 1)
scene.add(line)


const geometry2 = new LineGeometry()
// const geoAttributes = vSet1
geometry2.setPositions(positions2)
geometry2.setColors(colors2)

let line2 = new Line2(geometry2, matLine)
line2.computeLineDistances()
line2.scale.set(1, 1, 1)
scene.add(line2)


let points3 = [new THREE.Vector3(-3, 0, 0), new THREE.Vector3(-1, 0, 1), new THREE.Vector3(0, 0, 3)]
const spline3 = new THREE.CatmullRomCurve3(points3)
const divisions3 = Math.round( 12 * points3.length )
const point3 = new THREE.Vector3()

let positions3 = []
let colors3 = []
// const color = new THREE.Color()

for ( let i = 0, l = divisions3; i < l; i ++ ) {

    const t = i / l

    spline3.getPoint( t, point3 )
    positions3.push( point3.x, point3.y, point3.z )

    // color.setHSL( t, 1.0, 0.5 )
    colors3.push( t, t, t )

}

const geometry3 = new LineGeometry()
// const geoAttributes = vSet1
geometry3.setPositions(positions3)
geometry3.setColors(colors3)
// console.log(geometry1)

let line3 = new Line2(geometry3, matLine)
line3.computeLineDistances()
line3.scale.set(1, 1, 1)
scene.add(line3)


//
let points4 = [new THREE.Vector3(3, 0, 0), new THREE.Vector3(1, 0, -1), new THREE.Vector3(0, 0, -3)]
const spline4 = new THREE.CatmullRomCurve3(points4)
const divisions4 = Math.round( 12 * points4.length )
const point4 = new THREE.Vector3()

let positions4 = []
let colors4 = []
// const color = new THREE.Color()

for ( let i = 0, l = divisions4; i < l; i ++ ) {

    const t = i / l

    spline4.getPoint( t, point4 )
    positions4.push( point4.x, point4.y, point4.z )

    // color.setHSL( t, 1.0, 0.5 )
    colors4.push( t, t, t )

}

const geometry4 = new LineGeometry()
// const geoAttributes = vSet1
geometry4.setPositions(positions4)
geometry4.setColors(colors4)
// console.log(geometry1)

let line4 = new Line2(geometry4, matLine)
line4.computeLineDistances()
line4.scale.set(1, 1, 1)
scene.add(line4)


window.addEventListener( 'resize', onWindowResize )
onWindowResize()
// camera.lookAt(new THREE.Vector3(0, -15, 0))
// const geo = new THREE.Buffergeometry1()
// geo.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
// geo.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) )

// let matLineBasic = new THREE.LineBasicMaterial( { vertexColors: true } )
// let matLineDashed = new THREE.LineDashedMaterial( { vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 } )

// let line1 = new THREE.Line( geo, matLineBasic )
// line1.computeLineDistances()
// line1.visible = false
// scene.add( line1 )

// for (let i = 0; i < lineSegments; i++) {
//     const geometry1 = new Linegeometry1()
//     const geoAttributes = getSegmentAttributes(i)
//     geometry1.setPositions(geoAttributes[0])
//     geometry1.setColors(geoAttributes[1])
//     let matLine = new LineMaterial({
//         color: 0xff0000,
//         linewidth: 10,
//         vertexColors: true,
//         dashed: false,
//         alphaToCoverage: true,

//     })

//     let line = new Line2(geometry1, matLine)
//     line.computeLineDistances()
//     line.scale.set(1, 1, 1)
//     scene.add(line)
// }


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


document.getElementById("up-key-button").addEventListener("click", () => {
    scene.remove(planes[pointer])
    scene.remove(line)
    scene.remove(line2)
    console.log("Your pressed Up")
})


document.getElementById("down-key-button").addEventListener("click", () => {
    scene.add(planes[pointer])
    scene.add(line)
    scene.add(line2)
    console.log("Your pressed Down")
})


document.getElementById("right-key-button").addEventListener("click", () => {
    console.log("Your pressed Right")
})


document.getElementById("left-key-button").addEventListener("click", () => {
    console.log("Your pressed Left")
})

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

}

function render(time) {
    renderer.setClearColor( 0x000000, 0 );
    renderer.setViewport( 0, 0, canvasContainerWidth, canvasContainerHeight );
    matLine.resolution.set( canvasContainerWidth, canvasContainerHeight ); // resolution of the viewport

    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

requestAnimationFrame(render)
renderer.render(scene, camera)