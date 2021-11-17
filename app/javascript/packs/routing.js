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
const rawGraph = JSON.parse(document.getElementById("raw-graph-container").value) 
const graph = JSON.parse(document.getElementById("graph-container").value)
const sets = JSON.parse(document.getElementById("sets-container").value)
const scaffoldSequence = document.getElementById("scaffold-container").value
const segments = graph["segments"]
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
let initialCameraHeightPosition = 40
camera.position.y = initialCameraHeightPosition
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
        
            cubeGroup.position.z = 2000
            currPlane.position.set(0, 0, 0)
            camera = prevCamera
            controls = new OrbitControls(camera, renderer.domElement)
            // controls.enableRotate = false
            switchContext = context.planeMode
            camera.position.y = initialCameraHeightPosition
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
let currIndex = 0
let currPlane = planes[currIndex] 
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

function amplify(vertex, volume=dimension/segments) {
    vertex.x *= volume
    vertex.x += -dimension/2 
    vertex.y *= volume
    vertex.z *= volume
    vertex.z += dimension/2 
    return vertex
}

function transform(vertex) {
    let temp = vertex.y 
    vertex.y = vertex.z
    vertex.z = -temp
    return vertex
}

function findArrowVectors(vertex) {
    const first = new THREE.Vector3(vertex.x + 1, vertex.y, vertex.z)
    const second = new THREE.Vector3(vertex.x - 1, vertex.y, vertex.z)
    const third = new THREE.Vector3(vertex.x, vertex.y, vertex.z + 1)
    return [first, second, third]
}

// start adding mesh lines for scaffold
function generatePlaneScaffoldRouting(index) {
    const planeSets = JSON.parse(JSON.stringify(rawGraph.planes[index].sets))
    let red
    let green
    let blue
    const greenStepSize = Math.floor(155 / planeSets.length)
    let setGroups = []
    for (let i = 0; i < planeSets.length; i++){ 
        red = Math.floor(Math.random() * 60)
        green = 100 + i * greenStepSize 
        blue = Math.floor(Math.random() * 60)
        // setColors.push([red, green, blue])
        let setEdges = planeSets[i].edges
        let setMaterial = new MeshLineMaterial()
        setMaterial.color = new THREE.Color("rgb(" + red + ", " + green + ", " + blue +")")
        // setMaterial.color = new THREE.Color(0x29f4a2)
        setMaterial.lineWidth = 0.5
        let setEdgesGroup = new THREE.Group()
        let lineMesh
        // let endTriangle
        let startSquare
        for (let j = 0; j < setEdges.length; j++) {
            let line = new MeshLine()
            let start = amplify(transform(setEdges[j].v1))
            let end = amplify(transform(setEdges[j].v2))
            // let end2 = vectorize({x: })
            line.setPoints([vectorize(start), vectorize(end)])
            lineMesh = new THREE.Mesh(line, setMaterial)
            if (j == 0) {

            }

            if (j == setEdges.length - 1) {
                // let [v1, v2, v3] = findArrowVectors(end)
                
                // // let endTriangle = new THREE.Triangle(v1, v2, v3)
                // // let endTriangleMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} )
                // // let arrowMesh = new THREE.Mesh(endTriangle, endTriangleMaterial)
                // // scene.add(arrowMesh)

                // var geometry = new THREE.Geometry();
                // geometry.vertices.push(v1);
                // geometry.vertices.push(v2);
                // geometry.vertices.push(v3);
                // geometry.vertices.push(v1);
                
                // var liner = new THREE.Line(
                //   geometry,
                //   new THREE.LineBasicMaterial({ color: 0x00ff00 })
                // );
                let arrowGeo = new THREE.TetrahedronGeometry(1.0, 0.0)
                let endTriangleMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} )
                let arrowMesh = new THREE.LineSegments(arrowGeo, setMaterial)
                
                scene.add(arrowMesh)
                arrowMesh.position.set(end.x, end.y+1, end.z);
                // console.log(endTriangle)
                // scene.add(endTriangle)
                // let arrowHelper = new THREE.ArrowHelper( end, end, 1, 0xff0000 );
                // scene.add( arrowHelper );
            }
            setEdgesGroup.add(lineMesh)
        }
        setGroups.push(setEdgesGroup)
    }
    let planeRoutes = new THREE.Group()
    for (let i = 0; i < setGroups.length; i++) {
        planeRoutes.add(setGroups[i])
    }
    return planeRoutes
}
// console.log(graph.planes[3])
// console.log(rawGraph.planes[3])

// console.log(rawGraph.planes[4])
// console.log(graph.planes[4])

let planeRoutes = generatePlaneScaffoldRouting(currIndex)
scene.add(planeRoutes)
// scene.add(generatePlaneScaffoldRouting(currIndex + 1))
// scene.add(generatePlaneScaffoldRouting(currIndex+ 2))

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
const [staples, descriptions, positions] = generateStapleStrands(mps[0], mps[1])
// console.log(staples)
// console.log(descriptions)

function generatePlaneStapleRouting(currIndex, positions) {
    
}

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

// console.log(sets)
// console.log(sequenceDivison)

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
    let positions = []
    for (let i = 0; i < edgeKeys.length; i++) {
        stringBuilder = ""
        key = edgeKeys[i]
        let curr = stringMap[key]
        neighbors = edgeMap[edgeKeys[i]][0]
        if (i == edgeKeys.length - 1) {
            // console.log(stringMap[key].sequence.length)
            back = stringMap[key].sequence.slice(15)
        } else {
            back = stringMap[key].back
        }
        if (i == edgeKeys.length - 1) {
            mergeBack = translate(back) + translate(stringMap[edgeKeys[0]].front)
        } else {
            let extraBases = findExtraBase(back, neighbors.front)
            // console.log(stringMap)
            isOutgoer = isOutgoerEdge(stringMap[edgeKeys[i]].v2)
            if (isOutgoer) {
                extraBases += findExtraBase(back, neighbors.front)
            }
            mergeBack = translate(back) + extraBases + translate(neighbors.front)
        }

        // check the direction of flow
        let first
        let last 
        if (curr.start.x - curr.end.x != 0) {
            first = {x : (curr.end.x - curr.start.x) / 2, y: curr.start.y, z: curr.start.z}
        } else if (curr.start.y -curr.end.y != 0) {
            first = {x : curr.start.x, y: (curr.end.y - curr.start.y) / 2, z: curr.start.z}
        } else {
            first = {x : curr.start.x, y: curr.start.y, z: (curr.end.z - curr.start.z) / 2}
        }

        if (curr.end.x - neighbors.end.x != 0) {
            last = {x : (curr.end.x - neighbors.end.x) / 2, y: curr.end.y, z: curr.end.z}
        } else if (curr.end.y - neighbors.end.y != 0) {
            last = {x : curr.end.x, y: (curr.end.y - neighbors.end.y) / 2, z: curr.end.z}
        } else {
            last = {x : curr.end.x, y: curr.end.y, z: (curr.end.z - neighbors.end.z) / 2}
        }
        positions.push([first, stringMap[key].end, last])

        
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
    return [staples, descriptions, positions]
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
/*
    Plane Numbers
    Front -> 0
    Back -> 1
    Top -> 2
    Bottom -> 3
    Left -> 4
    Right -> 5
*/
document.getElementById("up-key-button").addEventListener("click", () => {
    scene.remove(planeRoutes)
    const res = planeNeighbors[current]["up"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    scene.add(planeRoutes)
    // addRoutings()
    // scene.add(currPlane)
})


document.getElementById("down-key-button").addEventListener("click", () => {
    console.log("down")
    scene.remove(planeRoutes)
    const res = planeNeighbors[current]["down"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    // addRoutings()
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    scene.add(planeRoutes)
    // scene.add(currPlane)
})


document.getElementById("right-key-button").addEventListener("click", () => {
    scene.remove(planeRoutes)
    const res = planeNeighbors[current]["right"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    scene.add(planeRoutes)
    // addRoutings()
    // scene.add(currPlane)
})


document.getElementById("left-key-button").addEventListener("click", () => {
    scene.remove(planeRoutes)
    const res = planeNeighbors[current]["left"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    scene.add(planeRoutes)
    // addRoutings()
    // scene.add(currPlane)
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

