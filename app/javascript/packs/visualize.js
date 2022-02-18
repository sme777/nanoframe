import * as THREE from 'three'
import * as Algorithms from "./algorithms"
import * as Helpers from "./visualizeHelpers"
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

const signOutBtn = document.getElementById("signOutButton")
const generatorSize = document.getElementById("generator-size")
const boxState = document.getElementById("box-state")
if (signOutBtn != null || boxState != null) {
    let size = 1
    let visualize = true
    if (generatorSize != null) {
        size = parseInt(generatorSize.value)
        visualize = false
    }
    let insetWidth, insetHeight, camera2
    let firstStartPoint, firstEndPoint, lastStartPoint, lastEndPoint
    let id, graph_json, segments, scaffold_length
    let canvas, width, height, depth, zoomUpdate
    let widthSegmentLenth, heightSegmentLength, depthSegmentLength
    let line0, line1, line2, line3, line4, line5, line6, line7
    let canvasContainer, canvasContainerWidth, canvasContainerHeight
    let routingColors
    let sequence = []
    let planeRoutings
    let prevVertex
    let toggle = 0
    let sphereInter
    let globalPositions
    let matLine = new LineMaterial({
        color: 0xffffff,
        linewidth: 10,
        vertexColors: true,
        dashed: false,
        alphaToCoverage: true,

    })

    let matLineBasic = new THREE.LineBasicMaterial({
        vertexColors: true
    })
    const clock = new THREE.Clock()
    const OrbitControls = oc(THREE)
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()


    for (let i = 0; i < 7249; i++) {
        if (i % 2 == 0) {
            sequence.push("T")
        } else if (i % 3 == 0) {
            sequence.push("C")
        } else  {
            sequence.push("G")
        }
        
    }
    /**
     * 
     * @returns 
     */
    function mergeSets() {
        let arr = []
        for (let i = 0; i < planeRoutings.length; i++) {
            for (let j = 0; j < planeRoutings[i].sets.length; j++)
                arr.push(planeRoutings[i].sets[j])
        }
        return arr
    }

    /**
     * 
     * @param {*} sets 
     * @param {*} takenSets 
     * @returns 
     */
    function sortSets(sets, takenSets) {
        let edgeArr = []
        let next = sets[0]
        let edgesAndLastVertex = getEdgesFromSet(next)
        edgeArr = edgeArr.concat(edgesAndLastVertex[0])
        let counter = 0
        let lastVertex = edgesAndLastVertex[1]
        takenSets.push(sets[0])

        while (sets.length - 1 != counter) {

            next = findNextSet(sets, lastVertex, takenSets)
            takenSets.push(next)
            edgesAndLastVertex = getEdgesFromSet(next)
            edgeArr = edgeArr.concat(edgesAndLastVertex[0])
            lastVertex = edgesAndLastVertex[1]
            counter += 1
        }
        edgeArr.push(new THREE.Vector3(prevVertex.x, prevVertex.y, prevVertex.z))
        return edgeArr
    }

    /**
     * 
     * @param {*} sets 
     * @param {*} lastVertex 
     * @param {*} takenSets 
     * @returns 
     */
    function findNextSet(sets, lastVertex, takenSets) {
        for (let s = 0; s < sets.length; s++) {
            let set = sets[s]
            for (let e = 0; e < set.edges.length; e++) {
                let edge = set.edges[e]
                if (Helpers.equalsVector(lastVertex, edge.v1) || Helpers.equalsVector(lastVertex, edge.v2)) {
                    if (!takenSets.includes(set)) {
                        return set
                    }
                }
            }
        }
        return null
    }

    /**
     * 
     * @param {*} set 
     * @returns 
     */
    function getEdgesFromSet(set) {
        let vectors = []
        const edges = set.edges
        let lastVertex
        for (let i = edges.length - 1; i >= 0; i--) {

            if (!Helpers.includesVector(vectors, edges[i].v1)) {
                vectors.push(Helpers.vectorize(edges[i].v1))
            }
            if (!Helpers.includesVector(vectors, edges[i].v2)) {
                vectors.push(Helpers.vectorize(edges[i].v2))
            }
        }
        lastVertex = edges[0].v2
        if (Helpers.equalsVector(lastVertex, prevVertex)) {
            lastVertex = edges[edges.length - 1].v1
            vectors = Helpers.reverseArray(vectors)
        }
        prevVertex = lastVertex
        return [vectors.slice(0, -1), lastVertex]
    }




    function generateDisplay(edges, scene, camera, residualEdges = false, fullDisplay = true, start = 0) {
        let positions = []
        let colors = []
        const spline = new THREE.CatmullRomCurve3(edges)
        const divisions = 7249//Math.round(12 * edges.length)
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
        if (visualize) {
            document.getElementById("routing-positions").value = JSON.stringify({
                "positions": routingPositions
            })

        }
        const geometry = new LineGeometry()
        geometry.setPositions(positions)
        console.log(JSON.stringify(positions))
        globalPositions = positions
        geometry.setColors(colors)
        console.log(JSON.stringify(colors))

        if (!residualEdges) {
            line0 = new Line2(geometry, matLine)
            // line0.computeLineDistances()
            // line0.scale.set(1, 1, 1)
            
            scene.add(line0)
            // console.log(scene.toJSON())
            const geo = new THREE.BufferGeometry()
            geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
            geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
            line1 = new THREE.Line(geo, matLineBasic)
            line1.computeLineDistances()
            line1.visible = false
            scene.add(line1)
            camera.lookAt(line0.position)
            if (fullDisplay) {
                line0.geometry.center()
            }

            camera.lookAt(line0.position)

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

    /**
     * 
     */
    function clearDisplay(scene) {
        let temp
        for (let i = 0; i < 8; i++) {
            temp = eval(`line${i}`)
            if (temp == undefined) {
                continue
            }
            temp.geometry.dispose()
            temp.material.dispose()
            scene.remove(temp)
        }
    }

    /**
     * 
     * @param {*} start 
     * @param {*} length 
     * @returns 
     */
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

    /**
     * 
     * @param {*} scene 
     */
    function connectEnds(scene) {
        let [positions, colors] = getCurvePoints(lastStartPoint, firstEndPoint)
        // let colors = Array(30).fill(0.5)
        let geometry = new LineGeometry()
        geometry.setPositions(positions)
        geometry.setColors(colors)
        line4 = new Line2(geometry, matLine)
        line4.computeLineDistances()
        line4.scale.set(1, 1, 1)
        scene.add(line4)
        let geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
        line5 = new THREE.Line(geo, matLineBasic)
        scene.add(line5)

        let [positions2, colors2] = getCurvePoints(lastEndPoint, firstStartPoint)
        geometry = new LineGeometry()
        geometry.setPositions(positions2)
        geometry.setColors(colors2)

        line6 = new Line2(geometry, matLine)
        line6.computeLineDistances()
        line6.scale.set(1, 1, 1)
        scene.add(line6)
        geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors2, 3))
        line7 = new THREE.Line(geo, matLineBasic)
        scene.add(line7)
    }

    function getCurvePoints(start, end) {
        let positions = []
        let colors = []
        const divisions = 96
        const point = new THREE.Vector3()
        const spline = new THREE.CatmullRomCurve3([new THREE.Vector3(start[0], start[1], start[2]), new THREE.Vector3(end[0], end[1], end[2])])
        for (let i = 0, l = divisions; i < l; i++) {
            const t = i / l
            spline.getPoint(t, point)
            positions.push(point.x + (Math.random() - 0.5), point.y + (Math.random() - 0.5), point.z + (Math.random() - 0.5))
            colors.push(t, 0.5, t)
        }

        return [positions, colors]
    }


    for (let i = 0; i < size; i++) {

        if (!visualize) {
            id = document.getElementById("index-" + i.toString()).value
            graph_json = JSON.parse(document.getElementById("generator-container-" + id).value)
            canvas = document.getElementById("webgl-public-" + id)
        } else {
            graph_json = JSON.parse(document.getElementById("generator-container").value)
            canvas = document.getElementById("visualize-webgl")
        }
        scaffold_length = graph_json["scaffold_length"]
        segments = graph_json["segments"]
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
        if (visualize) {
            camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000)
            camera2.position.copy(camera.position)
        }
        planeRoutings = graph_json["planes"]
        let takenSets = []
        let objectSets = sortSets(mergeSets(), takenSets)
        const simpleObjectSets = JSON.parse(JSON.stringify(objectSets))
        objectSets = Helpers.normalize(objectSets, widthSegmentLenth, heightSegmentLength, depthSegmentLength)
        generateDisplay(objectSets, scene, camera)

        let controls = new OrbitControls(camera, renderer.domElement)
        controls.minDistance = 10
        controls.maxDistance = 500

        window.addEventListener('resize', onWindowResize)
        canvas.addEventListener('wheel', onZoom)
        document.addEventListener('pointermove', onPointerMove)
        onWindowResize()



        const sphereGeometry = new THREE.SphereGeometry(controls.target.distanceTo( controls.object.position ) * 0.005);
        const sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

        sphereInter = new THREE.Mesh( sphereGeometry, sphereMaterial );
        sphereInter.visible = false;
        scene.add( sphereInter );

        
        requestAnimationFrame(render)

        function onZoom(event) {
            zoomUpdate = true
        }

        function onPointerMove(event) {
            // const rect = canvas.getBoundingClientRect()
            // mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            // mouse.y = -((event.clientY - rect.top) / rect.height) * 2 - 1
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
        }


        function onWindowResize() {

            camera.aspect = canvasContainerWidth / canvasContainerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(canvasContainerWidth, canvasContainerHeight)

            if (visualize) {
                insetWidth = canvasContainerHeight / 4
                insetHeight = canvasContainerHeight / 4
                camera2.aspect = insetWidth / insetHeight
                camera2.updateProjectionMatrix(line1)

            }

        }

        function findIndex(pos) {
            let min = Infinity
            let idx = null
            for (let i = 0; i < globalPositions.length; i += 3) {
                let temp = Math.abs(pos.x - globalPositions[i]) + 
                            Math.abs(pos.y - globalPositions[i+1]) + 
                            Math.abs(pos.z - globalPositions[i+2])
                if (temp < min) {
                    min = temp 
                    idx = Math.floor(i / 3)
                }
            }
            return idx
        }

        function render() {
            renderer.setClearColor(0x000000, 0);
            renderer.setViewport(0, 0, canvasContainerWidth, canvasContainerHeight);
            matLine.resolution.set(canvasContainerWidth, canvasContainerHeight); // resolution of the viewport
            renderer.render(scene, camera);


            if (visualize) {
                raycaster.setFromCamera(mouse, camera)
                // // let x = line0.raycast(raycaster, globalPositions)
                // // console.log(x)
                const intersections = raycaster.intersectObject(line0, true)
                // // console.log(line1)
                // // let intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null
                if (intersections.length > 0) {
                    if (zoomUpdate) {
                        // sphereInter.geometry.dispose()
                        sphereInter.geometry = new THREE.SphereGeometry(controls.target.distanceTo( controls.object.position ) * 0.005)
                        zoomUpdate = false
                    }
                    sphereInter.visible = true
                    sphereInter.position.copy(intersections[0].point)
                    let idx = findIndex(sphereInter.position)
                    
                    if (idx != null) {
                        document.querySelector(".sequnce-name").innerHTML = "Base selection: " + sequence[idx] + "\n" + "Index: " + idx
                    }
                // //     // console.log("touchy touchy")
                //     // console.log(intersections)
                //     let idx = intersections[0].faceIndex;
                //     console.log(intersections[0])
                // line0.material.color.copy(Math.random() * 0xffffff )
                //     // object.material.color.set( Math.random() * 0xffffff );
                } else {
                    sphereInter.visible = false
                }

                renderer.setClearColor(0xf5f5f5, 1)
                renderer.clearDepth()
                renderer.setScissorTest(true)
                renderer.setScissor(20, 20, insetWidth, insetHeight)
                renderer.setViewport(20, 20, insetWidth, insetHeight)
                camera2.position.copy(camera.position)
                camera2.quaternion.copy(camera.quaternion)
                matLine.resolution.set(insetWidth, insetHeight)
                renderer.render(scene, camera2)
                renderer.setScissorTest(false)
            }
            toggle += clock.getDelta()
            requestAnimationFrame(render)
        }

        if (visualize) {
            document.getElementById("set-values").value = JSON.stringify(simpleObjectSets)
            const box = document.getElementById("box-state")
            const boxLabel = document.getElementById("box-state-label")
            let scp = Algorithms.findStrongestConnectedComponents(objectSets, 1 / 3, [width, height, depth])

            box.addEventListener("click", () => {
                if (box.checked) {
                    boxLabel.innerHTML = "Close Form"
                    clearDisplay(scene)
                    generateDisplay(scp[0], scene, camera, false, false, scp[2])
                    generateDisplay(scp[1], scene, camera, true, false, scp[3])
                    connectEnds(scene)
                    // generateDisplay(scp[1], true)
                } else {
                    boxLabel.innerHTML = "Open Form"
                    clearDisplay(scene)
                    generateDisplay(objectSets, scene, camera, false, true, 0)
                }
            })
        }
    }

}