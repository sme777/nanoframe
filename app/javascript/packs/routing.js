import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as dat from 'dat.gui'
import * as RoutingHelpers from './routingHelpers' 
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import { Edge } from './edge'

const context = Object.freeze({
    planeMode: Symbol("plane"),
    objectMode: Symbol("object"),
})

const sets = JSON.parse(document.getElementById("sets-container").value)
const scaffoldSequence = document.getElementById("scaffold-container").value
const segments = 5 //graph_json["segments"]
const dimension = 50 // setup from user choice

const cubeGroup = RoutingHelpers.makeCubeGroup(dimension, segments)
let planes = RoutingHelpers.makePlanes(dimension, segments)

const planeNeighbors = RoutingHelpers.planeNeighbors(planes)


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
camera.position.y = 40
// camera.position.z = 25
const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(0, 0, 0)

let renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas
})

let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2()
// change this attribute when edit menu is selected
let isRaycastMode = false 

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

// dat.GUI.toggleHide()
const guiTag = document.querySelector('.datGUIRouting')
if (guiTag.value == undefined) {
    guiTag.append(gui.domElement)
    guiTag.value = "added"
}


const viewParams = {
    scaffold_color: 0xff0000,
    staple_color: 0xffff00,
    switchView: () => {
        if (switchContext == context.objectMode) {
        
            controls.enableRotate = false
            cubeGroup.position.z = 2000
            currPlane.position.set(0, 0, 0)
            camera = prevCamera
            controls = new OrbitControls(camera, renderer.domElement)
            switchContext = context.planeMode
            camera.position.y = 25
            scene.add(camera2)    
            
        } else {
            controls.enableRotate = true
            currPlane.position.set(0, 0, 2000)
            cubeGroup.position.z = 0
            prevCamera = camera.clone()
            switchContext = context.objectMode
            camera.position.y = 40
            scene.remove(camera2)
        }
    }
}

const selectionParams = {
    strand: () => {
        isRaycastMode = !isRaycastMode
        console.log("strand selected")
    },

    crossover: () => {
        isRaycastMode = !isRaycastMode

    },
    loopout: () => {
        isRaycastMode = !isRaycastMode

    }
}

const fivePrimeParams = {
    strand: () => {
        isRaycastMode = !isRaycastMode

    },
    domain: () => {
        isRaycastMode = !isRaycastMode

    }
}

const threePrimeParams = {
    strand: () => {
        isRaycastMode = !isRaycastMode

    },
    domain: () => {
        isRaycastMode = !isRaycastMode

    }
}

const otherParams = {
    pencil: () => {
        // isRaycastMode = true

    },

    split: () => {

    },

    insertion: () => {

    },

    deletion: () => {

    }
}

const viewFolder = gui.addFolder("view")
viewFolder.addColor(viewParams, "scaffold_color").name("scaffold color").onChange(() => {material.color.setHex(viewParams.scaffold_color) })
viewFolder.addColor(viewParams, "staple_color").name("staple color")
viewFolder.add(viewParams, "switchView").name("switch view")
viewFolder.closed = false
const selectionFolder = gui.addFolder("selection")
selectionFolder.add(selectionParams, "strand")

selectionFolder.add(selectionParams, "crossover")
selectionFolder.add(selectionParams, "loopout")
selectionFolder.closed = false

const fivePrimeFolder = selectionFolder.addFolder("5'")
const threePrimeFolder = selectionFolder.addFolder("3'")
fivePrimeFolder.add(fivePrimeParams, "strand")
fivePrimeFolder.add(fivePrimeParams, "domain")

threePrimeFolder.add(threePrimeParams, "strand")
threePrimeFolder.add(threePrimeParams, "domain")

const editFolder = gui.addFolder("edit")
editFolder.add(otherParams, "pencil")
editFolder.add(otherParams, "split")
editFolder.add(otherParams, "insertion")
editFolder.add(otherParams, "deletion")
editFolder.closed = false
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
window.addEventListener( 'pointermove', onMouseMove )
onWindowResize()

// DNA scaffold
const material = new MeshLineMaterial();
material.color.setHex(viewParams.scaffold_color)
material.lineWidth = 0.2
material.color = new THREE.Color(0x29f4a2)

function vectorize(vertex) {
    return new THREE.Vector3(vertex.x, vertex.y, vertex.z)
}

const line2 = new MeshLine()
line2.setPoints([vectorize({x: -5, y: 0, z: 25}), vectorize({x: -5, y: 0, z: 15})], p => 2)
let mesh2 = new THREE.Mesh(line2, material)
// line2.lineWidth = 10
scene.add(mesh2)
const line3 = new MeshLine()
line3.setPoints([vectorize({x: -5, y: 0, z: 15}), vectorize({x: 5, y: 0, z: 15})],  p => 2)
let mesh3 = new THREE.Mesh(line3, material)
scene.add(mesh3)
const line4 = new MeshLine()
line4.setPoints([vectorize({x: 5, y: 0, z: 15}), vectorize({x: 5, y: 0, z: 5})],  p => 2)
let mesh4 = new THREE.Mesh(line4, material)
scene.add(mesh4)
const line5 = new MeshLine()
line5.setPoints([vectorize({x: 5, y: 0, z: 5}), vectorize({x: -5, y: 0, z: 5})],  p => 2)
let mesh5 = new THREE.Mesh(line5, material)
scene.add(mesh5)
const line6 = new MeshLine()
line6.setPoints([vectorize({x: -5, y: 0, z: 5}), vectorize({x: -5, y: 0, z: -5})],  p => 2)
let mesh6 = new THREE.Mesh(line6, material)
scene.add(mesh6)
const line7 = new MeshLine()
line7.setPoints([vectorize({x: -5, y: 0, z: -5}), vectorize({x: 5, y: 0, z: -5})],  p => 2)
let mesh7 = new THREE.Mesh(line7, material)
scene.add(mesh7)
const line8 = new MeshLine()
line8.setPoints([vectorize({x: 5, y: 0, z: -5}), vectorize({x: 5, y: 0, z: -15})],  p => 2)
let mesh8 = new THREE.Mesh(line8, material)
scene.add(mesh8)
const line9 = new MeshLine()
line9.setPoints([vectorize({x: 5, y: 0, z: -15}), vectorize({x: 15, y: 0, z: -15})],  p => 2)
let mesh9 = new THREE.Mesh(line9, material)
scene.add(mesh9)
const line10 = new MeshLine()
line10.setPoints([vectorize({x: 15, y: 0, z: -15}), vectorize({x: 15, y: 0, z: -25})],  p => 2)
let mesh10 = new THREE.Mesh(line10, material)
scene.add(mesh10)

// staples
const material2 = new MeshLineMaterial()
material2.color = new THREE.Color(0xff4588)
material2.lineWidth = 0.2

const line11 = new MeshLine()
line11.setPoints([vectorize({x: 15.5, y: 0, z: -15}), vectorize({x: 15.5, y: 0, z: -20})],  p => 2)
let mesh11 = new THREE.Mesh(line11, material2)
scene.add(mesh11)
const line12 = new MeshLine()
line12.setPoints([vectorize({x: 15.5, y: 0, z: -15}), vectorize({x: 20.5, y: 0, z: -15})],  p => 2)
let mesh12 = new THREE.Mesh(line12, material2)
scene.add(mesh12)


const line13 = new MeshLine()
line13.setPoints([vectorize({x: 4.5, y: 0, z: -15}), vectorize({x: 4.5, y: 0, z: -20})],  p => 2)
let mesh13 = new THREE.Mesh(line13, material2)
scene.add(mesh13)
const line14 = new MeshLine()
line14.setPoints([vectorize({x: 4.5, y: 0, z: -15}), vectorize({x: -0.5, y: 0, z: -15})],  p => 2)
let mesh14 = new THREE.Mesh(line14, material2)
scene.add(mesh14)


const line15 = new MeshLine()
line15.setPoints([vectorize({x: 5.5, y: 0, z: 0}), vectorize({x: 5.5, y: 0, z: -5})],  p => 2)
let mesh15 = new THREE.Mesh(line15, material2)
scene.add(mesh15)
const line16 = new MeshLine()
line16.setPoints([vectorize({x: 5.5, y: 0, z: -5}), vectorize({x: 10.5, y: 0, z: -5})],  p => 2)
let mesh16 = new THREE.Mesh(line16, material2)
scene.add(mesh16)

const line17 = new MeshLine()
line17.setPoints([vectorize({x: 5.5, y: 0, z: 5}), vectorize({x: 5.5, y: 0, z: 0})],  p => 2)
let mesh17 = new THREE.Mesh(line17, material2)
scene.add(mesh17)
const line18 = new MeshLine()
line18.setPoints([vectorize({x: 5.5, y: 0, z: 5}), vectorize({x: 10.5, y: 0, z: 5})],  p => 2)
let mesh18 = new THREE.Mesh(line18, material2)
scene.add(mesh18)


const line19 = new MeshLine()
line19.setPoints([vectorize({x: 5.5, y: 0, z: 20}), vectorize({x: 5.5, y: 0, z: 15})],  p => 2)
let mesh19 = new THREE.Mesh(line19, material2)
scene.add(mesh19)
const line20 = new MeshLine()
line20.setPoints([vectorize({x: 5.5, y: 0, z: 15}), vectorize({x: 10.5, y: 0, z: 15})],  p => 2)
let mesh20 = new THREE.Mesh(line20, material2)
scene.add(mesh20)

const line21 = new MeshLine()
line21.setPoints([vectorize({x: -5.5, y: 0, z: 15}), vectorize({x: -10.5, y: 0, z: 15})],  p => 2)
let mesh21 = new THREE.Mesh(line21, material2)
scene.add(mesh21)
const line22 = new MeshLine()
line22.setPoints([vectorize({x: -5.5, y: 0, z: 15}), vectorize({x: -5.5, y: 0, z: 20})],  p => 2)
let mesh22 = new THREE.Mesh(line22, material2)
scene.add(mesh22)

const line23 = new MeshLine()
line23.setPoints([vectorize({x: -5.5, y: 0, z: 5}), vectorize({x: -10.5, y: 0, z: 5})],  p => 2)
let mesh23 = new THREE.Mesh(line23, material2)
scene.add(mesh23)
const line24 = new MeshLine()
line24.setPoints([vectorize({x: -5.5, y: 0, z: 5}), vectorize({x: -5.5, y: 0, z: 0})],  p => 2)
let mesh24 = new THREE.Mesh(line24, material2)
scene.add(mesh24)

const line25 = new MeshLine()
line25.setPoints([vectorize({x: -5.5, y: 0, z: -5}), vectorize({x: -10.5, y: 0, z: -5})],  p => 2)
let mesh25 = new THREE.Mesh(line25, material2)
scene.add(mesh25)
const line26 = new MeshLine()
line26.setPoints([vectorize({x: -5.5, y: 0, z: -5}), vectorize({x: -5.5, y: 0, z: 0})],  p => 2)
let mesh26 = new THREE.Mesh(line26, material2)
scene.add(mesh26)


const material3 = new MeshLineMaterial()
material3.color = new THREE.Color(0x373aa3)
material3.lineWidth = 0.2

const line27 = new MeshLine()
line27.setPoints([vectorize({x: -5.5, y: 0, z: 20}), vectorize({x: -5.5, y: 0, z: 25})],  p => 2)
let mesh27 = new THREE.Mesh(line27, material3)
scene.add(mesh27)
const line28 = new MeshLine()
line28.setPoints([vectorize({x: 15.5, y: 0, z: -20}), vectorize({x: 15.5, y: 0, z: -25})],  p => 2)
let mesh28 = new THREE.Mesh(line28, material3)
scene.add(mesh28)

function equalsVector(v1, v2) {
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v2.z)
}

function onMouseMove(event) {

    if (!isRaycastMode) {
        return
    }
    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 )

    // raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObjects( scene, false )
    // const intersects = raycaster.intersectObjects( scaffold, false )
    if ( intersects.length > 0 ) {
        const intersect = intersects[ 0 ]

        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal )
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 )

    }

    render()
}
let sequenceDivison = []
const es = createEdgeStrands()
const mps = createAdjacentEdgeMap()
const [staples, descriptions] = generateStapleStrands(mps[0], mps[1])
console.log(staples)
console.log(descriptions)

function createAdjacentEdgeMap() {
    let edgeMap = {}
    let stringMap = {}
    
    for (let i = 0; i < es.length; i++) {
        let arr = []
        let arr2 = []

        for (let j = 0; j < es.length; j++) {
            if (!(i == j || es[i] == es[j])) {
                if (equalsVector(es[i].v2, es[j].v1)) {
                    if (Math.abs(i - j) < 2) {
                        if (isOutgoerEdge(es[i].v2)) {
                            arr.push(es[j])
                            arr2.push(edgeToString(es[j]))
                            
                        }
                    } else if (!isStraightLine(es[i].v1, es[j].v2)){
                            arr.push(es[j])
                            arr2.push(edgeToString(es[j]))
                    }
                } 
            }
        }
        if (arr.length != 0) {
            edgeMap[edgeToString(es[i])] = arr
            stringMap[edgeToString(es[i])] = es[i]
        }
    }
    return [edgeMap, stringMap]
}

function isOutgoerEdge(v) { 
    if (v == undefined) return false
    if ((v.x % segments == 0 && v.y % segments == 0) ||
        (v.x % segments == 0 && v.z % segments == 0) ||
        (v.y % segments == 0 && v.z % segments == 0))  {
        return true
        }
        return false
}

//create edges with strands
function createEdgeStrands() {
    let edgeSequence
    let edges = []
    const edgeLength = Math.floor((dimension / segments) / 0.332)
    let newEdge 
    for (let i = 0; i < sets.length ; i++) {
        
        if (i == sets.length - 1) {
            // console.log(i)
            edgeSequence = scaffoldSequence.slice(i * edgeLength)
            sequenceDivison.push(edgeSequence)
            newEdge = new Edge(sets[i], sets[0], edgeSequence, edgeLength, null)
            edges.push(newEdge)
        } else {
            edgeSequence = scaffoldSequence.slice(i * edgeLength, i * edgeLength + edgeLength)
            sequenceDivison.push(edgeSequence)
            newEdge = new Edge(sets[i], sets[i+1], edgeSequence, edgeLength, null)
            edges.push(newEdge)
        }
    }
    edges = setNextAndPrev(edges)
    return edges
}

function setNextAndPrev(edges) {
    let curr
    for (let i = 0; i < edges.length; i++) {
        curr = edges[i]
        if (i == 0) {
            curr.next = edges[i+1]
            curr.prev = edges[edges.length - 1]
        } else if (i == edges.length - 1) {
            curr.next = edges[0]
            curr.prev = edges[i-1]
        } else {
            curr.next = edges[i+1]
            curr.prev = edges[i-1]
        }
        
    }
    return edges
}

function findExtraBase(front, back) {
    const frontLast = front.slice(-1)
    const backFirst = back.slice(0, 1)

    const bases = ["A", "T", "G", "C"]
    for (let i = 0; i < bases.length; i++) {
        if (bases[i] != frontLast && bases[i] != backFirst) {
            return bases[i]
        }
    }
    return null
}

console.log(sets)
console.log(sequenceDivison)

function createAdjacentEdgeMap2() {
    let edgeMap = {}
    let stringMap = {}
    let edge
    let adjacentEdgeList
    for (let i = 0; i < es.length; i++) {
        edge = es[i]
        adjacentEdgeList = findAdjacentEdges(edge, i)
        edgeMap[edgeToString(edge)] = adjacentEdgeList
        stringMap[edgeToString(edge)] = edge
    }
    return [edgeMap, stringMap]
}

function findAdjacentEdges(edge, index) {
    // let startArr = []
    // let endArr = []
    let start 
    let end
    
    for (let i = 0; i < es.length; i++) {
        if (i != index) {

            if (equalsVector(es[i].v2, edge.v1)) {
                if (!isStraightLine(es[i].v1, edge.v2)) {
                    if (!isNextOrPrevEdge(i, index, edge.v1)) {
                        // startArr.push(es[i])
                        start = es[i]
                    }                        
                }                    
            }
            
            if (equalsVector(es[i].v1, edge.v2)) {
                if (!isStraightLine(es[i].v2, edge.v1)) {
                    if (!isNextOrPrevEdge(i, index, edge.v2)) {
                        // endArr.push(es[i])
                        end = es[i]
                    }
                }
            }
        }
    }
    return [start, end]
}

function isStraightLine(v1, v2) {
    const xDist = Math.abs(v1.x - v2.x)
    const yDist = Math.abs(v1.y - v2.y)
    const zDist = Math.abs(v1.z - v2.z)

    if (xDist != 0 && yDist == 0 && zDist == 0) {
        return true
    }
    if (xDist == 0 && yDist != 0 && zDist == 0) {
        return true
    }
    if (xDist == 0 && yDist == 0 && zDist != 0) {
        return true
    }
    return false
}

function isNextOrPrevEdge(i, index, v) {
    if ((v.x % segments == 0 && v.y % segments == 0) ||
    (v.x % segments == 0 && v.z % segments == 0) ||
    (v.y % segments == 0 && v.z % segments == 0))  {
        return false
    }
    return !(Math.abs(i - index) > 1)
}

function generateStapleStrands(edgeMap, stringMap) {
    const edgeKeys = Object.keys(edgeMap)
    let key
    let back
    let neighbors
    let isOutgoer
    let mergeBack
    let staples = []
    let stringBuilder = ""
    let start
    let end 
    let side
    let descriptions = []
    let descriptionMap = {}

    for (let i = 0; i < edgeKeys.length; i++) {
        stringBuilder = ""
        key = edgeKeys[i]
        neighbors = edgeMap[edgeKeys[i]]
        if (i == edgeKeys.length - 1) {
            // console.log(stringMap[key].sequence.length)
            back = stringMap[key].sequence.slice(15)
        } else {
            back = stringMap[key].back
        }
        if (i == edgeKeys.length - 1) {
            mergeBack = translate(back) + translate(stringMap[edgeKeys[0]].front)
        } else {
            let extraBases = findExtraBase(back, neighbors[0].front)
            // console.log(stringMap)
            isOutgoer = isOutgoerEdge(stringMap[edgeKeys[i]].v2)
            if (isOutgoer) {
                extraBases += findExtraBase(back, neighbors[0].front)
            }
            mergeBack = translate(back) + extraBases + translate(neighbors[0].front)
        }

        
        if (isOutgoer) {
            stringBuilder += "Refr-"
        } else {
            stringBuilder += "Refl-"
        }
        
        // check sides
        start = stringMap[edgeKeys[i]].v1
        end = stringMap[edgeKeys[i]].v2
        if (start.z == 0 && end.z == 0) {
            side = "S1"
            stringBuilder +="S1-"
        } else if (start.z == -segments && end.z == -segments) {
            side = "S2"
            stringBuilder +="S2-"
        } else if (start.x == 0 && end.x == 0) {
            side = "S6"
            stringBuilder +="S6-"
        } else if (start.x == segments && end.x == segments) {
            side = "S5"
            stringBuilder += "S5-"
        } else if (start.y == 0 && end.y == 0) {
            side = "S4"
            stringBuilder += "S4-"
        } else if (start.y == segments && end.y == segments) {
            side = "S3"
            stringBuilder += "S3-"
        }
        const [row, col] = findRowAndCol(stringMap[edgeKeys[i]], side)
        
        stringBuilder += "R" + row + "-" + "C" + col
        if (!isOutgoer) {
            if (descriptionMap[stringBuilder] == undefined) {
                descriptionMap[stringBuilder] = 1
                stringBuilder += "-1"
            } else {
                descriptionMap[stringBuilder] += 1
                stringBuilder += "-" + descriptionMap[stringBuilder].toString()
            }
        }

        descriptions.push(stringBuilder)
        staples.push(mergeBack)
    }
    return [staples, descriptions]
}

function findRowAndCol(edge, side) {
    let edgeRow 
    let edgeCol
    let col
    let row
    if (side == "S1" || side == "S2") {

        edgeRow = segments - Math.abs(edge.v1.y)  + 1 
        edgeCol = edge.v1.x + 1 

        if (edge.v1.x - edge.v2.x > 0) {
            if (edge.next.v2.y  > edge.v2.y) {
                col = edgeCol - 1
                row = edgeRow
            } else {
                col = edgeCol - 1
                row = edgeRow - 1
            }
        } else if (edge.v1.x - edge.v2.x < 0) {
            if (edge.next.v2.y  > edge.v2.y) {
                col = edgeCol
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        } else if (edge.v1.y - edge.v2.y > 0) {
            if (edge.next.v2.x  > edge.v2.x) {
                col = edgeCol 
                row = edgeRow - 1
            } else {
                col = edgeCol 
                row = edgeRow
            }
        } else {
            if (edge.next.v2.x  > edge.v2.x) {
                col = edgeCol - 1
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        }
    } else if (side == "S3" || side == "S4") {
        edgeRow = segments - Math.abs(edge.v1.z)  + 1 
        edgeCol = edge.v1.x + 1 

        if (edge.v1.x - edge.v2.x > 0) {
            if (edge.next.v2.z  > edge.v2.z) {
                col = edgeCol - 1
                row = edgeRow
            } else {
                col = edgeCol - 1
                row = edgeRow - 1
            }
        } else if (edge.v1.x - edge.v2.x < 0) {
            if (edge.next.v2.z  > edge.v2.z) {
                col = edgeCol
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        } else if (edge.v1.z - edge.v2.z > 0) {
            if (edge.next.v2.x  > edge.v2.x) {
                col = edgeCol 
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        } else {
            if (edge.next.v2.z  > edge.v2.z) {
                col = edgeCol - 1
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow 
            }
        }
    } else if (side == "S5" || side == "S6") {
        edgeRow = segments - Math.abs(edge.v1.y)  + 1
        edgeCol = segments - Math.abs(edge.v1.z) + 1 

        if (edge.v1.z - edge.v2.z > 0) {
            if (edge.next.v2.y  > edge.v2.y) {
                col = edgeCol - 1
                row = edgeRow
            } else {
                col = edgeCol - 1
                row = edgeRow - 1
            }
        } else if (edge.v1.z - edge.v2.z < 0) {
            if (edge.next.v2.y  > edge.v2.y) {
                col = edgeCol
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        } else if (edge.v1.y - edge.v2.y > 0) {
            if (edge.next.v2.z  > edge.v2.z) {
                col = edgeCol 
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        } else {
            if (edge.next.v2.z  > edge.v2.z) {
                col = edgeCol - 1
                row = edgeRow
            } else {
                col = edgeCol 
                row = edgeRow - 1
            }
        }
    }

    return [row, col]



}

function generateStapleDescriptions(edgeMap, stringMap) {
    const edgeKeys = Object.keys(edgeMap)
    let stapleName
    let descriptions = []
    for (let i = 0; i < edgeKeys.length; i++) {
        // stringMap[key]
        descriptions.push(i.toString())
    }
    return descriptions
}

function translate(seq) {
    tr = ""
    for (let i = 0; i < seq.length; i++) {
        if (seq.charAt(i) == "A") {
            tr += "T"
        } else if (seq.charAt(i) == "T") {
            tr += "A"
        } else if (seq.charAt(i) == "G") {
            tr += "C"
        } else if (seq.charAt(i) == "C") {
            tr += "G"
        }
    }
    return tr
}

// let staples = generateStapleStrands(mps)

function edgeToString(edge) {
    let result =""
    result += "(" + edge.v1.x + " " + edge.v1.y + " " + edge.v1.z +")"
    result += "->"
    result += "(" + edge.v2.x + " " + edge.v2.y + " " + edge.v2.z +")"
    return result
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


        camera2.position.set(camera2Object.position.x , camera2Object.position.y + 100, camera2Object.position.z)
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
document.getElementById("up-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["up"]
    current = res[0]
    currPlane = res[1]
    currIndex = res[2]
    // addRoutings()
    scene.add(currPlane)
})


document.getElementById("down-key-button").addEventListener("click", () => {
    console.log("down")
    scene.remove(currPlane)
    const res = planeNeighbors[current]["down"]
    current = res[0]
    currPlane = res[1]
    currIndex = res[2]
    // addRoutings()
    scene.add(currPlane)
})


document.getElementById("right-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["right"]
    current = res[0]
    currPlane = res[1]
    currIndex = res[2]
    // addRoutings()
    scene.add(currPlane)
})


document.getElementById("left-key-button").addEventListener("click", () => {
    scene.remove(currPlane)
    const res = planeNeighbors[current]["left"]
    current = res[0]
    currPlane = res[1]
    currIndex = res[2]
    // addRoutings()
    scene.add(currPlane)
})

let t = "";
for (var i = 0; i < staples.length; i++){
      var tr = "<tr>"
      tr += "<td>"+(i + 1) +"</td>"
      tr += "<td>"+descriptions[i] + "</td>"
      tr += "<td>"+staples[i]+"</td>"
      tr += "<td>"+staples[i].length+"</td>"
      tr += "</tr>"
      t += tr
}
// console.log(staples)
document.getElementById("staples_field").value = JSON.stringify(staples)
document.getElementById("staples_descriptions_field").value = JSON.stringify(descriptions)
document.getElementById("staples_table").innerHTML += t;

