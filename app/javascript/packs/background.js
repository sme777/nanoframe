import * as THREE from 'three'
import {DnaHelix} from './background-material'
import {PostEffect} from './background-material'

const resolution = new THREE.Vector2()
const canvas = document.getElementById("background-webgl")
let renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, canvas: canvas})
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera()
let clock = new THREE.Clock({autoStart: false})

// For post effects
const renderTarget = new THREE.WebGLRenderTarget()
const scenePE = new THREE.Scene()
const cameraPE = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2)

// Preloader

// DNA Helices
let dnaHelix = new DnaHelix()

// Post Effect
let postEffect = new PostEffect(renderTarget.texture)
postEffect.createObj()
scenePE.add(postEffect.obj)


// Functions

const render = () => {
    // var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    // console.log(gl)
    const time = clock.getDelta()
    dnaHelix.render(time)
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)
    postEffect.render(time)
    renderer.setRenderTarget(null)
    renderer.render(scenePE, cameraPE)
}

const renderLoop = () => {
    render()
    requestAnimationFrame(renderLoop)
}


const resizeCamera = () => {
    camera.setFocalLength(50)
    camera.setViewOffset(
        1200,
        800,
        (resolution.x - 1200) / -2,
        (resolution.y - 800) / -2,
        resolution.x,
        resolution.y
    );
    camera.updateProjectionMatrix()
}

renderer.setClearColor(0x000000, 1.0)

camera.aspect = 3 / 2
camera.far = 1000
camera.position.set(-110, -75, 45)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(dnaHelix)

clock.start()
renderLoop()