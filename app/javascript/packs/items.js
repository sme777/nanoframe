import * as THREE from 'three'
import * as RoutingSamples from './routingSamples'
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

if (document.getElementById("signOutButton") != null) {
    const size = parseInt(document.getElementById("generator-size").value)
    let id, graph_json, segments, scaffold_length
    let canvas, width, height, depth
    let widthSegmentLenth, heightSegmentLength, depthSegmentLength
    let line, line1, line2, line3
    let canvasContainer, canvasContainerWidth, canvasContainerHeight
    let routingColors
    let planeRoutings
    let prevVertex
    const OrbitControls = oc(THREE)

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

    for (let i = 0; i < size; i++) {
        // const size = parseInt(document.getElementById("generator-size").value)
        id = document.getElementById("index-" + i.toString()).value
        graph_json = JSON.parse(document.getElementById("generator-container-" + id).value)
        segments = graph_json["segments"]
        scaffold_length = graph_json["scaffold_length"]
        canvas = document.getElementById("webgl-public-" + id)
        width = graph_json["width"]
        height = graph_json["height"]
        depth = graph_json["depth"]
        widthSegmentLenth = width / segments
        heightSegmentLength = height / segments
        depthSegmentLength = depth / segments


        canvasContainer = document.querySelector(".canvas-container")
        canvasContainerWidth = canvasContainer.offsetWidth
        canvasContainerHeight = canvasContainer.offsetHeight
        
        


        let renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(canvasContainerWidth, canvasContainerHeight)

        let scene = new THREE.Scene()

        let camera = new THREE.PerspectiveCamera(40, canvasContainerWidth / canvasContainerHeight, 1, 1000)
        camera.position.set(-40, 60, 90)

        planeRoutings = segments == 2 ? RoutingSamples.planeRoutings1x1x1 : graph_json["planes"]
        let takenSets = []
        let objectSets = sortSets(mergeSets())

        objectSets = normalize(objectSets)
        generateDisplay(objectSets)

        let controls = new OrbitControls(camera, renderer.domElement)
        controls.minDistance = 10
        controls.maxDistance = 500
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

        function generateDisplay(edges, residualEdges = false, fullDisplay = true, start = 0) {
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
                    if (i == 0) {
                        colors.push(0.5, 0.5, t)
                    } else {
                        colors.push(t, 0.5, 0.5)
                    }
                    
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

        function findColorSequnece(start, length) {
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
        window.addEventListener('resize', onWindowResize)
        onWindowResize()

        requestAnimationFrame(render)

        function onWindowResize() {

            camera.aspect = canvasContainerWidth / canvasContainerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(canvasContainerWidth, canvasContainerHeight);

        }


        function render() {
            renderer.setClearColor(0x000000, 0);
            renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);
            matLine.resolution.set(canvasContainerWidth, canvasContainerHeight); // resolution of the viewport
            renderer.render(scene, camera);

            requestAnimationFrame(render)

        }

    }


}