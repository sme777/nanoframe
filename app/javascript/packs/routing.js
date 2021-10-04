import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as dat from 'dat.gui'

const graph_json = JSON.parse(document.getElementById("generator-container").value)
// set graph values
const segments = graph_json["segments"]
let planes = []
for (let j = 0; j < 6; j++) {
    const gridHelper = new THREE.GridHelper(6, segments)
    // gridHelper.geometry.rotateX( Math.PI / 2 );
    planes.push(gridHelper)
}



let pointer = 0

const canvas = document.querySelector("#router-webgl")
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 5000)
camera.position.y = 5
const light = new THREE.DirectionalLight(0xffffff, 0.8)
light.position.set(0, 0, 0);
let renderer = new THREE.WebGLRenderer({alpha: true, canvas: canvas})
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
    

scene.add(camera)
scene.add(light)

// configure dat.gui

const gui = new dat.GUI({autoPlace: false})
document.querySelector('.datGUI').append(gui.domElement)
console.log(planes[pointer])

let params = {
    color: 0xff00ff
}

gui.add(params, "color")
let guiElements = []

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshPhongMaterial({color: 0x4562df})

// let cube = new THREE.Mesh(geometry, material)
// scene.add(cube)
const OrbitControls = oc(THREE)
const controls = new OrbitControls( camera, renderer.domElement )

scene.add(planes[pointer])
// const gridHelper2 = new THREE.GridHelper(6, segments)
// scene.add(gridHelper2)

document.getElementById("up-key-button").addEventListener("click", () => {
    scene.remove(planes[pointer])
    console.log("Your pressed Up")
})


document.getElementById("down-key-button").addEventListener("click", () => {
    scene.add(planes[pointer])
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

function render(time) {

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
