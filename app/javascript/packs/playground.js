import * as THREE from 'three'


const canvas = document.getElementById("playground-canvas")
const renderer = new THREE.WebGLRenderer( {canvas: canvas, alpha: true} )
const playGroundScene = setupPlayGroundScene()
const sideBarScene = setupSideBarScene()
console.log(playGroundScene)
function makeScene(elem) {
    const scene = new THREE.Scene()

    const fov = 45
    const aspect = 2
    const near = 0.1
    const far = 100
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 2
    camera.position.set(0, 1, 2)
    camera.lookAt(0, 0, 0)

    {
        const color = 0xFFFFFF
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        scene.add(light)
    }
    return {scene, camera, elem}
}

function setupPlayGroundScene() {
    const playGroundContainer = document.getElementById("playground")
    const sceneInfo = makeScene(playGroundContainer)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({color: 'red'})
    const mesh = new THREE.Mesh(geometry, material)
    sceneInfo.scene.add(mesh)
    sceneInfo.mesh = mesh
    return sceneInfo
}

function setupSideBarScene() {
    const playGroundItem = document.getElementById("playground-item")
    const sceneInfo = makeScene(playGroundItem)
    const geometry = new THREE.SphereGeometry(0.8, 4, 2)
    const material = new THREE.MeshPhongMaterial({ color: 'blue', flatShading: true,})
    
    const mesh = new THREE.Mesh(geometry, material)
    sceneInfo.scene.add(mesh)
    sceneInfo.mesh = mesh
    return sceneInfo
}


function resizeRendererToDisplaySize(renderer, camera) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }
    return needResize
}


function renderSceneInfo(sceneInfo) {
    const {scene, camera, elem} = sceneInfo

    const {left, right, top, bottom, width, height} = elem.getBoundingClientRect()

    const isOffscreen =
        bottom < 0 ||
        top > renderer.domElement.clientHeight ||
        right < 0 ||
        left > renderer.domElement.clientWidth
    if (isOffscreen) {
        return
    }

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    const positiveYUpBottom = renderer.domElement.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)

    renderer.render(scene, camera);
}

function render(time) {
    time *= 0.001
 
    resizeRendererToDisplaySize(renderer, playGroundScene.camera)
   
    renderer.setScissorTest(false)
    renderer.clear(true, true)
    renderer.setScissorTest(true)
   
    playGroundScene.mesh.rotation.y = time * .1
    sideBarScene.mesh.rotation.y = time * .1
   
    renderSceneInfo(playGroundScene)
    renderSceneInfo(sideBarScene)
   
    requestAnimationFrame(render)
}
requestAnimationFrame(render)
