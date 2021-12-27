import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as RoutingHelpers from './routingHelpers' 
import * as RoutingControls from './routingControls'
import * as VisualizeHelpers from './visualizeHelpers'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline'
import { Edge } from './edge'
import { Line2 } from './threejs/Line2'


const rawGraph = JSON.parse(document.getElementById("raw-graph-container").value) 
const graph = JSON.parse(document.getElementById("graph-container").value)
const sets = JSON.parse(document.getElementById("sets-container").value)
const scaffoldSequence = document.getElementById("scaffold-container").value
const segments = graph["segments"]

// unpack dimensions
const width = graph["width"]
const height = graph["height"]
const depth = graph["depth"]
const dimension = 50
const cubeGroup = RoutingHelpers.makeCubeGroup([width, height, depth], segments)
let planes = RoutingHelpers.makePlanes(dimension, segments)
const planeNeighbors = RoutingHelpers.planeNeighbors(planes)
const resolution = new THREE.Vector2( window.innerWidth, window.innerHeight )

let current = "front"

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


const OrbitControls = oc(THREE)
let controls = new OrbitControls(camera, renderer.domElement)

if (RoutingControls.getSwitchContext() == RoutingControls.getContext().planeMode) {
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
material.color.setHex(RoutingControls.viewParams.scaffold_color)
material.lineWidth = 0.2
material.color = new THREE.Color(0x29f4a2)
material.resolution = resolution
material.side = THREE.DoubleSide
// material.blending = THREE.AdditiveBlending

function amplify(vertex, volume=dimension/segments) {
    vertex.x *= volume
    vertex.x += -dimension/2 
    vertex.y *= volume
    vertex.z *= volume
    vertex.z += dimension/2 
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
        red = Math.floor(Math.random() * 100)
        green = 100 + i * greenStepSize 
        blue = Math.floor(Math.random() * 100)
        // setColors.push([red, green, blue])
        let setEdges = planeSets[i].edges
        let setMaterial = new MeshLineMaterial()
        setMaterial.color = new THREE.Color("rgb(" + red + ", " + green + ", " + blue +")")
        // setMaterial.color = new THREE.Color(0x29f4a2)
        setMaterial.lineWidth = 0.75
        setMaterial.resolution = resolution
        setMaterial.side = THREE.DoubleSide

        // setMaterial.blending = THREE.AdditiveBlending

        let setEdgesGroup = new THREE.Group()
        let lineMesh
        // let endTriangle
        let startSquare
        for (let j = 0; j < setEdges.length; j++) {
            let line = new MeshLine()
            let start = amplify(RoutingHelpers.transform(setEdges[j].v1))
            let end = amplify(RoutingHelpers.transform(setEdges[j].v2))
            // let end2 = vectorize({x: })
            line.setPoints([VisualizeHelpers.vectorize(start), VisualizeHelpers.vectorize(end)])
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


let planeRoutes = generatePlaneScaffoldRouting(currIndex)
scene.add(planeRoutes)


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

let staplesGroup = generatePlaneStapleRouting(currIndex)
scene.add(staplesGroup)

function generatePlaneStapleRouting(currIndex) {
    const map = RoutingHelpers.planeStringToNum()
    const staplePositions = JSON.parse(JSON.stringify(positions))
    let red
    let green
    let blue
    const blueStepSize = Math.floor(155 / staplePositions.length)
    let edgeGroups = new THREE.Group()

    for (let i = 0; i < staplePositions.length - 1; i++){ 
        if (map[staplePositions[i].side] == currIndex) {
            red = Math.floor(Math.random() * 60)
            green =  Math.floor(Math.random() * 60)
            blue = Math.floor(Math.random() * 60)
            let edge = staplePositions[i].positions
            let type = staplePositions[i].type
            let side = staplePositions[i].side
            let edgeMaterial = new MeshLineMaterial()
            edgeMaterial.color = type == "Refl" ? new THREE.Color("rgb(" + 255 + ", " + 105 + ", " + 180 +")") : new THREE.Color("rgb(" + 20 + ", " + 20 + ", " + 255 +")")
            edgeMaterial.lineWidth = 0.5
            edgeMaterial.resolution = resolution
            edgeMaterial.side = THREE.DoubleSide
            let line1 = new MeshLine()
            let line2 = new MeshLine()

            let start1 = RoutingHelpers.convertToStandardForm(edge[0], side)
            let end1 = RoutingHelpers.convertToStandardForm(edge[1], side)
            let end2 = RoutingHelpers.convertToStandardForm(edge[2], side)

            start1 = amplify(RoutingHelpers.transform(start1))
            end1 = amplify(RoutingHelpers.transform(end1))
            end2 = amplify(RoutingHelpers.transform(end2))
            let [xCh1, zCh1, xCh2, zCh2] = RoutingHelpers.findDirectionalChange(edge)
            const results = adjustStaplePositions(xCh1, zCh1, xCh2, zCh2, [start1, end1, end2])
            start1 = results[0]
            end1 = results[1]
            end2 = results[2]

            line1.setPoints([VisualizeHelpers.vectorize(start1), VisualizeHelpers.vectorize(end1)])
            if (type == "Refl") {
                line2.setPoints([VisualizeHelpers.vectorize(end1), VisualizeHelpers.vectorize(end2)])
            }
            let lineMesh1 = new THREE.Mesh(line1, edgeMaterial)
            let lineMesh2 = new THREE.Mesh(line2, edgeMaterial)
            edgeGroups.add(lineMesh1)
            edgeGroups.add(lineMesh2)
        }
        // setGroups.push(setEdgesGroup)
    }
    return edgeGroups
}

function adjustStaplePositions(xCh1, zCh1, xCh2, zCh2, arr) {
    let start1 = arr[0]
    let end1 = arr[1]
    let end2 = arr[2]

    if (xCh1 > 0 && zCh2 > 0) {
        end1.z += 0.5
        start1.z += 0.5
        end2.x -= 0.5
        end1.x -= 0.5
    } else if (xCh1 > 0 && zCh2 < 0) {
        start1.z -= 0.5
        end1.z -= 0.5
        end1.x -= 0.5
        end2.x -= 0.5
    } else if (xCh1 < 0 && zCh2 > 0) {
        start1.z += 0.5
        end1.z += 0.5
        end1.x += 0.5
        end2.x += 0.5
    } else if (xCh1 < 0 && zCh2 < 0) {
        start1.z -= 0.5
        end1.z -= 0.5
        end1.x += 0.5
        end2.x += 0.5
    } else if (zCh1 > 0 && xCh2 < 0) {
        start1.x -= 0.5
        end1.x -= 0.5
        end1.z -= 0.5
        end2.z -= 0.5
    } else if (zCh1 > 0 && xCh2 > 0) {
        start1.x += 0.5
        end1.x += 0.5
        end1.z -= 0.5
        end2.z -= 0.5
    } else if (zCh1 < 0 && xCh2 > 0) {
        end1.x += 0.5
        start1.x += 0.5
        end2.z += 0.5
        end1.z += 0.5
    } else if (zCh1 < 0 && xCh2 < 0) {
        end1.x -= 0.5
        start1.x -= 0.5
        end2.z += 0.5
        end1.z += 0.5
    } else if (xCh1 > 0) {
        start1.z -= 0.5
        end1.z -= 0.5
    } else if (xCh1 < 0) {
        start1.z += 0.5
        end1.z += 0.5
    } else if (zCh1 > 0) {
        start1.x += 0.5
        end1.x += 0.5
    } else if (zCh1 < 0) {
        start1.x += 0.5
        end1.x += 0.5
    } else if (xCh2 > 0) {
        start1.z += 0.5
        end1.z += 0.5
    } else if (xCh2 < 0) {
        start1.z -= 0.5
        end1.z -= 0.5
    } else if (zCh2 > 0) {
        start1.x += 0.5
        end1.x += 0.5
    } else if (zCh2 < 0) {
        start1.x -= 0.5
        end1.x -= 0.5
    }
    return [start1, end1, end2]
}


function createAdjacentEdgeMap() {
    let edgeMap = {}
    let stringMap = {}
    
    for (let i = 0; i < es.length; i++) {
        let arr = []
        let arr2 = []

        for (let j = 0; j < es.length; j++) {
            if (!(i == j || es[i] == es[j])) {
                if (VisualizeHelpers.equalsVector(es[i].v2, es[j].v1)) {
                    if (Math.abs(i - j) < 2) {
                        if (RoutingHelpers.isOutgoerEdge(es[i].v2, segments)) {
                            arr.push(es[j])
                            arr2.push(RoutingHelpers.edgeToString(es[j]))
                            
                        }
                    } else if (!RoutingHelpers.isStraightLine(es[i].v1, es[j].v2)){
                            arr.push(es[j])
                            arr2.push(RoutingHelpers.edgeToString(es[j]))
                    }
                } 
            }
        }
        if (arr.length != 0) {
            edgeMap[RoutingHelpers.edgeToString(es[i])] = arr
            stringMap[RoutingHelpers.edgeToString(es[i])] = es[i]
        }
    }
    return [edgeMap, stringMap]
}



//create edges with strands
function createEdgeStrands() {
    let edgeSequence
    let edges = []
    const edgeLength = Math.floor((dimension / segments) / 0.332)
    let newEdge 
    for (let i = 0; i < sets.length ; i++) {
        
        if (i == sets.length - 1) {
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
    let type
    for (let i = 0; i < edgeKeys.length; i++) {
        stringBuilder = ""
        key = edgeKeys[i]
        let curr = stringMap[key]
        neighbors = edgeMap[edgeKeys[i]][0]
        if (i == edgeKeys.length - 1) {
            back = stringMap[key].sequence.slice(15)
        } else {
            back = stringMap[key].back
        }
        if (i == edgeKeys.length - 1) {
            mergeBack = RoutingHelpers.translate(back) + RoutingHelpers.translate(stringMap[edgeKeys[0]].front)
        } else {
            let extraBases = RoutingHelpers.findExtraBase(back, neighbors.front)
            isOutgoer = RoutingHelpers.isOutgoerEdge(stringMap[edgeKeys[i]].v2, segments)
            if (isOutgoer) {
                extraBases += RoutingHelpers.findExtraBase(back, neighbors.front)
            }
            mergeBack = RoutingHelpers.translate(back) + extraBases + RoutingHelpers.translate(neighbors.front)
        }

        
        if (isOutgoer) {
            type = "Refr"
            stringBuilder += "Refr-"
        } else {
            type = "Refl"
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
            side = "S5"
            stringBuilder +="S5-"
        } else if (start.x == segments && end.x == segments) {
            side = "S6"
            stringBuilder += "S6-"
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
        let arr
 
        let first
        let last 
        if (curr.start.x - curr.end.x != 0) {
            first = {x : (curr.end.x + curr.start.x) / 2, y: curr.start.y, z: curr.start.z}
        } else if (curr.start.y -curr.end.y != 0) {
            first = {x : curr.start.x, y: (curr.end.y + curr.start.y) / 2, z: curr.start.z}
        } else {
            first = {x : curr.start.x, y: curr.start.y, z: (curr.end.z + curr.start.z) / 2}
        }

        if (curr.end.x - neighbors.end.x != 0) {
            last = {x : (neighbors.end.x + curr.end.x) / 2, y: curr.end.y, z: curr.end.z}
        } else if (neighbors.end.y - curr.end.y != 0) {
            last = {x : curr.end.x, y: (neighbors.end.y + curr.end.y) / 2, z: curr.end.z}
        } else {
            last = {x : curr.end.x, y: curr.end.y, z: (neighbors.end.z + curr.end.z) / 2}
        }


        positions.push({"positions": [first, stringMap[key].end, last], "side": side, "type": type})
 
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

    if (RoutingControls.getSwitchContext() == RoutingControls.getContext().planeMode) {
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
    scene.remove(staplesGroup)
    const res = planeNeighbors[current]["up"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    staplesGroup = generatePlaneStapleRouting(currIndex)
    scene.add(planeRoutes)
    scene.add(staplesGroup)
    // addRoutings()
    // scene.add(currPlane)
})


document.getElementById("down-key-button").addEventListener("click", () => {
    scene.remove(planeRoutes)
    scene.remove(staplesGroup)
    const res = planeNeighbors[current]["down"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    // addRoutings()
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    staplesGroup = generatePlaneStapleRouting(currIndex)
    scene.add(planeRoutes)
    scene.add(staplesGroup)
    // scene.add(currPlane)
})


document.getElementById("right-key-button").addEventListener("click", () => {
    scene.remove(planeRoutes)
    scene.remove(staplesGroup)
    const res = planeNeighbors[current]["right"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    staplesGroup = generatePlaneStapleRouting(currIndex)
    scene.add(planeRoutes)
    scene.add(staplesGroup)
    // addRoutings()
    // scene.add(currPlane)
})


document.getElementById("left-key-button").addEventListener("click", () => {
    scene.remove(planeRoutes)
    scene.remove(staplesGroup)
    const res = planeNeighbors[current]["left"]
    current = res[0]
    // currPlane = res[1]
    currIndex = res[2]
    planeRoutes = generatePlaneScaffoldRouting(currIndex)
    staplesGroup = generatePlaneStapleRouting(currIndex)
    scene.add(planeRoutes)
    scene.add(staplesGroup)
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

document.getElementById("staples_field").value = JSON.stringify(staples)
document.getElementById("staples_descriptions_field").value = JSON.stringify(descriptions)
document.getElementById("staples_table").innerHTML += t;

