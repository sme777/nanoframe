import * as THREE from 'three'
import * as RoutingSamples from './routingSamples'
import {
    Line2
} from './threejs/Line2'
import {
    LineMaterial
} from './threejs/LineMaterial'
import {
    LineGeometry
} from './threejs/LineGeometry'

if (document.getElementById("signOutButton") != null) {
    const size = parseInt(document.getElementById("generator-size").value)
    let id
    let graph_json
    let canvas
    let width
    let height
    let depth
    let segments
    let scaffold_length
    let planeRoutings
    let prevVertex
    let takenSets = []
    let renderer
    let canvasContainer = document.querySelector(".canvas-container")
    let canvasContainerWidth = canvasContainer.offsetWidth
    let canvasContainerHeight = canvasContainer.offsetHeight
    let scene
    let camera
    let widthSegmentLenth 
    let heightSegmentLength 
    let depthSegmentLength 
    let line, line1, line2, line3
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
    for (let i = 0; i < 1; i++) {
        takenSets = []
        id = document.getElementById("index-"+i.toString()).value
        graph_json = JSON.parse(document.getElementById("generator-container-" + id).value)
        segments = graph_json["segments"]
        scaffold_length = graph_json["scaffold_length"]
        canvas = document.getElementById("webgl-public-" + id)
        planeRoutings = segments == 2 ? RoutingSamples.planeRoutings1x1x1 : graph_json["planes"]
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
        widthSegmentLenth = width / segments
        heightSegmentLength = height / segments
        depthSegmentLength = depth / segments
        // for sets
        
        let objectSets = sortSets(mergeSets())
        console.log(objectSets)
        const simpleObjectSets = JSON.parse(JSON.stringify(objectSets))
        objectSets = normalize(objectSets)
        // generateDisplay(objectSets)

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
        console.log(edgesAndLastVertex)
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
    
    function normalize(vectors) {
    
        for (let i = 0; i < vectors.length; i++) {
            vectors[i].x *= widthSegmentLenth
            vectors[i].y *= heightSegmentLength
            vectors[i].z *= depthSegmentLength
        }
    
        return vectors
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
            positions.push(point.x, point.y, point.z)
            colors.push(0.5, 0.5, t)

        }
    
        let routingPositions = []
        for (let i = 0; i < scaffold_length; i++) {
            const t = i / scaffold_length
            spline.getPoint(t, point)
            routingPositions.push(point.x, point.y, point.z)
    
        }
    
        const geometry = new LineGeometry()
        geometry.setPositions(positions)
        geometry.setColors(colors)
    
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
        line.geometry.center()
        camera.lookAt(line.position)

        // console.log(positions)
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

    function vectorize(vertex) {
        return new THREE.Vector3(vertex.x, vertex.y, vertex.z)
    }
    
    function equalsVector(v1, v2) {
        if (v1 == undefined || v2 == undefined) return false
        return (v1.x == v2.x && v1.y == v2.y && v1.z == v2.z)
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

    function reverseArray(v) {
        let arr = []
        for (let i = v.length - 1; i > -1; i--) {
            arr.push(v[i])
        }
        return arr
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
        requestAnimationFrame(render)
    
    }
    
    requestAnimationFrame(render)
}

