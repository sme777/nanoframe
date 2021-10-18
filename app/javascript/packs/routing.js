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
const dimension = 30

let planes = []
let grids = []
for (let j = 0; j < 2; j++) {
    const gridHelper = new THREE.GridHelper(dimension, segments, 0xD3D3D3, 0xD3D3D3)
    j % 2 == 1 ? gridHelper.position.set(0, dimension/2, 0) : gridHelper.position.set(0, -dimension/2, 0)
    const pos2Seg = dimension / (segments - 1)

    // gridHelper.geometry.rotateX( Math.PI / 2 );
    planes.push(gridHelper)
}


for (let i = 1; i < segments ; i++) {
    const g1 = createGrid({height: dimension / 2, width: 1, linesHeight: 40, linesWidth: 3, color: 0x000000})
    const g2 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: 40, color: 0x000000})
    const g3 = createGrid({height: dimension / 2, width: 1, linesHeight: 40, linesWidth: 3, color: 0x000000})
    const g4 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: 40, color: 0x000000})
    // g2.geometry.rotateX(Math.PI / 2) , 0, 0,  Math.PI / 2
    g1.position.set(0, -dimension/2 + (i * dimension / segments), dimension /2 )
    g2.position.set(-dimension/2 + (i * dimension / segments), 0, dimension /2 )

    g3.position.set(0, -dimension/2 + (i * dimension / segments), - dimension /2 )
    g4.position.set(-dimension/2 + (i * dimension / segments), 0, - dimension /2 )

    
    grids.push(g1)
    grids.push(g2)
    grids.push(g3)
    grids.push(g4)

}


for (let j = 0; j < 2; j++) {
    const gridHelper = new THREE.GridHelper(dimension, segments, 0xD3D3D3, 0xD3D3D3)
    gridHelper.geometry.rotateZ( Math.PI / 2 );
    j % 2 == 1 ? gridHelper.position.set(dimension / 2, 0, 0) : gridHelper.position.set(-dimension / 2, 0, 0) 
    planes.push(gridHelper)
}

for (let i = 1; i < segments ; i++) {
    const g1 = createGrid({height: dimension / 2, width: 1, linesHeight: 40, linesWidth: 3, color: 0x000000}, Math.PI / 2)
    const g2 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: 40, color: 0x000000},  Math.PI / 2)
    const g3 = createGrid({height: dimension / 2, width: 1, linesHeight: 40, linesWidth: 3, color: 0x000000},  Math.PI / 2)
    const g4 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: 40, color: 0x000000},  Math.PI / 2)
    // g2.geometry.rotateX(Math.PI / 2) , 0, 0,  Math.PI / 2
    g1.position.set(0, dimension /2, -dimension/2 + (i * dimension / segments))
    g2.position.set(-dimension/2 + (i * dimension / segments), dimension /2 , 0)

    g3.position.set(0, - dimension /2, -dimension/2 + (i * dimension / segments) )
    g4.position.set(-dimension/2 + (i * dimension / segments), - dimension /2 , 0)

    
    grids.push(g1)
    grids.push(g2)
    grids.push(g3)
    grids.push(g4)

}



for (let j = 0; j < 2; j++) {
    const gridHelper = new THREE.GridHelper(dimension, segments, 0xD3D3D3, 0xD3D3D3)
    gridHelper.geometry.rotateX( Math.PI / 2 );
    j % 2 == 1 ? gridHelper.position.set(0, 0, dimension /2 ) : gridHelper.position.set(0, 0, -dimension / 2) 
    planes.push(gridHelper)
}

for (let i = 1; i < segments ; i++) {
    const g1 = createGrid({height: dimension / 2, width: 1, linesHeight: 40, linesWidth: 3, color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    const g2 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: 40, color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    const g3 = createGrid({height: dimension / 2, width: 1, linesHeight: 40, linesWidth: 3, color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    const g4 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: 40, color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    // g2.geometry.rotateX(Math.PI / 2) , 0, 0,  Math.PI / 2
    g1.position.set(dimension /2, 0, -dimension/2 + (i * dimension / segments))
    g2.position.set(dimension /2 , -dimension/2 + (i * dimension / segments),  0)
    g3.position.set(- dimension /2, 0, -dimension/2 + (i * dimension / segments))
    g4.position.set(- dimension /2 , -dimension/2 + (i * dimension / segments),  0)

    
    grids.push(g1)
    grids.push(g2)
    grids.push(g3)
    grids.push(g4)


}




let pointer = 0

let insetWidth
let insetHeight

const canvas = document.querySelector("#router-webgl")
let canvasContainer = document.querySelector(".router-container")
let canvasContainerWidth = canvasContainer.offsetWidth
let canvasContainerHeight = canvasContainer.offsetHeight

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, canvasContainerWidth / canvasContainerHeight, 0.01, 5000)
camera.position.y = 35
// camera.position.z = 25
const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(0, 0, 0)

let renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
})

const camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000)
camera2.position.set(camera.position.x, camera.position.y + 10, camera.position.z)



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

const OrbitControls = oc(THREE)
const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry( 30, 30, 30);
const edges = new THREE.EdgesGeometry( geometry );
const mesh = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xD3D3D3 } ) );
// scene.add( line );
// camera.position.copy()
scene.add(mesh)
for (let i = 0; i < planes.length; i++) {
    scene.add(planes[i])
} 

for (let i = 0; i < grids.length; i++) {
    scene.add(grids[i])
}
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
// let points1 = [new THREE.Vector3(0, 0, 15), new THREE.Vector3(1, 0, 1), new THREE.Vector3(15, 0, 0)]
// const spline1 = new THREE.CatmullRomCurve3(points1)
// const divisions1 = Math.round( 12 * points1.length )
// const point1 = new THREE.Vector3()


function addGridHelpers() {
    for (let i = 0; i < segments; i++) {

    }
}

function createGrid(opts, rotationX=0, rotationY=0, rotationZ=0) {
    const config = opts || {
        height: 30,
        width: 30,
        linesHeight: 10,
        linesWidth: 10,
        color: 0xB0B0B0
    }

    const material = new THREE.LineBasicMaterial({
        color: config.color,
        opacity: 1
    })
    const positions = new Float32Array(config.width * config.linesWidth  + config.height * config.linesHeight )
    const colors = new Float32Array(config.width * config.linesWidth  + config.height * config.linesHeight )
    const gridObject = new THREE.Object3D(),
    gridGeo = new THREE.BufferGeometry(),
    stepw = 2 * config.width / config.linesWidth,
    steph = 2 * config.height / config.linesHeight
    console.log(config.width * config.linesWidth + config.height * config.linesHeight )
    // width
    // let count = 0
    let j = 0

    for (let i = -config.width; i <= config.width; i += stepw) {
        positions[j] = -config.height
        colors[j] = 176
        positions[j+1] = i
        colors[j+1] = 176
        positions[j+2] = 0
        colors[j+2] = 176
        // j += 3
        positions[j+3] = config.height
        colors[j+3] = 176
        positions[j+4] = i
        colors[j+4] = 176
        positions[j+5] = 0
        colors[j+5] = 176 
        j += 6
    
    }
    //height
    for (let i = -config.height; i <= config.height; i += steph) {
        positions[j] = i
        colors[j] = 176
        positions[j+1] = -config.width
        colors[j+1] = 176
        positions[j+2] = 0
        colors[j+2] = 176
        // j += 3
        positions[j+3] = i
        colors[j+3] = 176
        positions[j+4] = config.width
        colors[j+4] = 176
        positions[j+5] = 0
        colors[j+5] = 176 
        j += 6
    }
    console.log(j)
    
    gridGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    gridGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    gridGeo.computeBoundingBox()
    gridGeo.rotateX(rotationX)
    gridGeo.rotateY(rotationY)
    gridGeo.rotateZ(rotationZ)

    var line = new THREE.LineSegments(gridGeo, material);
    gridObject.add(line);

    return gridObject;
}

// const g1 = createGrid({height: 2, width: 15, linesHeight: 5, linesWidth: 20, color: 0xb0b0b0})
// const g2 = createGrid({height: 2, width: 15, linesHeight: 5, linesWidth: 20, color: 0xb0b0b0}, Math.PI / 2)
// // console.log(g)
// scene.add(g1)
// scene.add(g2)


// let positions1 = []
// let colors1 = []

// // const color = new THREE.Color()

// for ( let i = 0, l = divisions1; i < l; i ++ ) {

//     const t = i / l

//     spline1.getPoint( t, point1 )
//     positions1.push( point1.x, point1.y + 15, point1.z )

//     // color.setHSL( t, 1.0, 0.5 )
//     colors1.push( t, t, t )

// }


// let points2 = [new THREE.Vector3(-15, 0, 0), new THREE.Vector3(-1, 0, -1), new THREE.Vector3(0, 0, -15)]
// const spline2 = new THREE.CatmullRomCurve3(points2)
// const divisions2 = Math.round( 12 * points2.length )
// const point2 = new THREE.Vector3()

// let positions2 = []
// let colors2 = []
// // const color = new THREE.Color()

// for ( let i = 0, l = divisions2; i < l; i ++ ) {

//     const t = i / l

//     spline2.getPoint( t, point2 )
//     positions2.push( point2.x, point2.y + 15, point2.z )

//     // color.setHSL( t, 1.0, 0.5 )
//     colors2.push( t, t, t )

// }



// const geometry1 = new LineGeometry()
// // const geoAttributes = vSet1
// geometry1.setPositions(positions1)
// geometry1.setColors(colors1)
// // console.log(geometry1)
// let matLine = new LineMaterial({
//     color: 0xff0000,
//     linewidth: 10,
//     vertexColors: true,
//     dashed: false,
//     alphaToCoverage: true,

// })
// let line = new Line2(geometry1, matLine)
// line.computeLineDistances()
// line.scale.set(1, 1, 1)
// scene.add(line)


// const geometry2 = new LineGeometry()
// // const geoAttributes = vSet1
// geometry2.setPositions(positions2)
// geometry2.setColors(colors2)

// let line2 = new Line2(geometry2, matLine)
// line2.computeLineDistances()
// line2.scale.set(1, 1, 1)
// scene.add(line2)


// let points3 = [new THREE.Vector3(-3, 0, 0), new THREE.Vector3(-1, 0, 1), new THREE.Vector3(0, 0, 3)]
// const spline3 = new THREE.CatmullRomCurve3(points3)
// const divisions3 = Math.round( 12 * points3.length )
// const point3 = new THREE.Vector3()

// let positions3 = []
// let colors3 = []
// // const color = new THREE.Color()

// for ( let i = 0, l = divisions3; i < l; i ++ ) {

//     const t = i / l

//     spline3.getPoint( t, point3 )
//     positions3.push( point3.x, point3.y + 15, point3.z )

//     // color.setHSL( t, 1.0, 0.5 )
//     colors3.push( t, t, t )

// }

// const geometry3 = new LineGeometry()
// // const geoAttributes = vSet1
// geometry3.setPositions(positions3)
// geometry3.setColors(colors3)
// // console.log(geometry1)

// let line3 = new Line2(geometry3, matLine)
// line3.computeLineDistances()
// line3.scale.set(1, 1, 1)
// scene.add(line3)


// //
// let points4 = [new THREE.Vector3(3, 0, 0), new THREE.Vector3(1, 0, -1), new THREE.Vector3(0, 0, -3)]
// const spline4 = new THREE.CatmullRomCurve3(points4)
// const divisions4 = Math.round( 12 * points4.length )
// const point4 = new THREE.Vector3()

// let positions4 = []
// let colors4 = []
// // const color = new THREE.Color()

// for ( let i = 0, l = divisions4; i < l; i ++ ) {

//     const t = i / l

//     spline4.getPoint( t, point4 )
//     positions4.push( point4.x, point4.y + 15, point4.z )

//     // color.setHSL( t, 1.0, 0.5 )
//     colors4.push( t, t, t )

// }

// const geometry4 = new LineGeometry()
// // const geoAttributes = vSet1
// geometry4.setPositions(positions4)
// geometry4.setColors(colors4)
// // console.log(geometry1)

// let line4 = new Line2(geometry4, matLine)
// line4.computeLineDistances()
// line4.scale.set(1, 1, 1)
// scene.add(line4)


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

    camera2.position.set(camera.position.x * 2, camera.position.y * 2, camera.position.z * 2)
    camera2.quaternion.copy(camera.quaternion)

    renderer.render( scene, camera2 )

    renderer.setScissorTest( false )

    requestAnimationFrame(render)
}

requestAnimationFrame(render)
renderer.render(scene, camera)

// DOM modifiers

document.querySelector(".select-container").style.visibility = 'hidden'

document.getElementById("select-btn").addEventListener("click", () => {
    const selectionDiv = document.querySelector(".select-container")
    if (selectionDiv.style.visibility == 'visible') {
        selectionDiv.style.visibility = 'hidden'
    } else {
        selectionDiv.style.visibility = 'visible'
    }
})


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