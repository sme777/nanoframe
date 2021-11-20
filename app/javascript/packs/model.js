import * as THREE from 'three'
import oc from 'three-orbit-controls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import * as Maker from "./shapeMaker"
import { DNA } from './dna'
import * as Data from './shapeData'

//console.log(dat)


const OrbitControls = oc(THREE)
const canvas = document.querySelector('#synthesizer')
//canvas.height = $(".synthesizer-container").height()
const renderer = new THREE.WebGLRenderer({alpha: true, canvas})
const fov = 25
const aspect = 4  // the canvas default
const near = 0.1
const far = 10000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
const controls = new OrbitControls( camera, renderer.domElement )
let sequence
controls.enableDamping = true
const gui = new dat.GUI({ autoPlace: false })
document.querySelector('.datGUI').append(gui.domElement)

camera.position.z = 120
const scene = new THREE.Scene()


const shape = document.getElementById('synthesizer-shape')
let chosenShape
let mesh
let meshData
let isGUISet = false
let guiElements = []
//window.addEventListener("wheel", onMouseDrag)
let dna = new DNA(7249)
const geometry = new THREE.BufferGeometry().setFromPoints( dna.positions )
const material = new THREE.LineBasicMaterial( { color : 0xff0000 } )
const curveObject = new THREE.Line( geometry, material )
// scene.add(curveObject)

const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)

shape.addEventListener("click", function() {
  chosenShape = shape.value
  if (mesh != null) {
    mesh.geometry.dispose()
    mesh.material.dispose()
    scene.remove(mesh)
  }
  if (chosenShape == 0) {
    mesh = Maker.makeDefault()

  } else if (chosenShape == 1) {
    clearGUIElemens()
    mesh = Maker.makeCube()
    meshData = Data.cubeData

    guiElements.push(gui.add(meshData, 'width', 0, 240).name('Width').setValue(30).onChange(() => {
      
      Maker.regenerateCube(mesh)
    }))
    guiElements.push(gui.add(meshData, 'height', 0, 240).name('Height').setValue(30).onChange(() => {
      
      Maker.regenerateCube(mesh)
    }))
    guiElements.push(gui.add(meshData, 'depth', 0, 240).name('Depth').setValue(30).onChange(() => {
      Maker.regenerateCube(mesh)
    }))

    guiElements.push(gui.add(meshData, 'widthSegments', 1, 15).step(1).name('Width Stripes').setValue(2).onChange(() => {
      Maker.regenerateCube(mesh)
    }))

    guiElements.push(gui.add(meshData, 'heightSegments', 1, 15).step(1).name('Height Stripes').setValue(2).onChange(() => {
      Maker.regenerateCube(mesh)
    }))
    guiElements.push(gui.add(meshData, 'depthSegments', 1, 15).step(1).name('Depth Stripes').setValue(2).onChange(() => {
      Maker.regenerateCube(mesh)
    }))
    
  } else if (chosenShape == 2) {
    clearGUIElemens()
    mesh = Maker.makeSphere()
    meshData = Data.sphereData

    guiElements.push(gui.add(meshData, 'radius', 0, 50).name('Radius').setValue(22).onChange(() => {
      Maker.regenerateSphere(mesh)
    }))
    guiElements.push(gui.add(meshData, 'widthSegments', 0, 25).step(1).name('Width Segment').setValue(10).onChange(() => {
      Maker.regenerateSphere(mesh)
    }))
    guiElements.push(gui.add(meshData, 'heightSegments', 0, 25).step(1).name('Height Segment').setValue(8).onChange(() => {
      Maker.regenerateSphere(mesh)
    }))

  } else if (chosenShape == 3) {
    clearGUIElemens()
    mesh = Maker.makeCylinder()
    meshData = Data.cylinderData

    guiElements.push(gui.add(meshData, 'height', 0, 50).name('Height').setValue(33).onChange(() => {
      Maker.regenerateCylinder(mesh)
    }))
    guiElements.push(gui.add(meshData, 'radialSegments', 2, 25).name('Radial Segment').setValue(12).onChange(() => {
      Maker.regenerateCylinder(mesh)
    }))

    guiElements.push(gui.add(meshData, 'radiusTop', 0, 30).name('Radius Top').setValue(18).onChange(() => {
      Maker.regenerateCylinder(mesh)
    }))
    guiElements.push(gui.add(meshData, 'radiusBottom', 0, 30).name('Radius Bottom').setValue(10).onChange(() => {
      Maker.regenerateCylinder(mesh)
    }))


  } else if (chosenShape == 4) {
    clearGUIElemens()
    mesh = Maker.makeCone()
    meshData = Data.coneData

    guiElements.push(gui.add(meshData, 'height', 0, 50).name('Height').setValue(33).onChange(() => {
      Maker.regenerateCone(mesh)
    }))

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(20).onChange(() => {
      Maker.regenerateCone(mesh)
    }))

    guiElements.push(gui.add(meshData, 'radialSegments', 2, 40).step(1).name('Radial Segment').setValue(20).onChange(() => {
      Maker.regenerateCone(mesh)
    }))

  } else if (chosenShape == 5) {
    clearGUIElemens()
    mesh = Maker.makePolyhedron()
    meshData = Data.polyhedronData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(22).onChange(() => {
      Maker.regeneratePolyhedron(mesh)
    }))
    guiElements.push(gui.add(meshData, 'detail', 0, 10).name('Detail').step(1).setValue(0).onChange(() => {
      Maker.regeneratePolyhedron(mesh)
    }))
  } else if (chosenShape == 6) {
    clearGUIElemens()
    mesh = Maker.makeTetrahedron()
    meshData = Data.tetrahedronData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(22).onChange(() => {
      Maker.regenerateTetrahedron(mesh)
    }))
    guiElements.push(gui.add(meshData, 'detail', 0, 10).name('Detail').step(1).setValue(0).onChange(() => {
      Maker.regenerateTetrahedron(mesh)
    }))
  } else if (chosenShape == 7) {
    clearGUIElemens()
    mesh = Maker.makeOctahedron()
    meshData = Data.octahedronData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(22).onChange(() => {
      Maker.regenerateOctahedron(mesh)
    }))
    guiElements.push(gui.add(meshData, 'detail', 0, 10).name('Detail').step(1).setValue(0).onChange(() => {
      Maker.regenerateOctahedron(mesh)
    }))
  } else if (chosenShape == 8) {
    clearGUIElemens()
    mesh = Maker.makeIcosahedron()
    meshData = Data.icosahedronData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(22).onChange(() => {
      Maker.regenerateIcosahedron(mesh)
    }))
    guiElements.push(gui.add(meshData, 'detail', 0, 10).name('Detail').step(1).setValue(0).onChange(() => {
      Maker.regenerateIcosahedron(mesh)
    }))
  } else if (chosenShape == 9){
    clearGUIElemens()
    mesh = Maker.makeDodecahedron()
    meshData = Data.dodecahedronData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(22).onChange(() => {
      Maker.regenerateDodecahedron(mesh)
    }))
    guiElements.push(gui.add(meshData, 'detail', 0, 10).name('Detail').step(1).setValue(0).onChange(() => {
      Maker.regenerateDodecahedron(mesh)
    }))
  } else if (chosenShape == 10) {
    clearGUIElemens()
    mesh = Maker.makeTorus()
    meshData = Data.torusData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(22).onChange(() => {
      Maker.regenerateTorus(mesh)
    }))
    guiElements.push(gui.add(meshData, 'radialSegments', 2, 30).name('Radial Segment').step(1).setValue(8).onChange(() => {
      Maker.regenerateTorus(mesh)
    }))

    guiElements.push(gui.add(meshData, 'tubeRadius', 0, 15).name('Tube Radius').setValue(2).onChange(() => {
      Maker.regenerateTorus(mesh)
    }))
    guiElements.push(gui.add(meshData, 'tubularSegments', 2, 50).name('Tubular Segment').step(1).setValue(24).onChange(() => {
      Maker.regenerateTorus(mesh)
    }))
  } else {
    clearGUIElemens()
    mesh = Maker.makeTorusKnot()
    meshData = Data.torusKnotData

    guiElements.push(gui.add(meshData, 'radius', 0, 40).name('Radius').setValue(15).onChange(() => {
      Maker.regenerateTorusKnot(mesh)
    }))

    guiElements.push(gui.add(meshData, 'radialSegments', 2, 30).name('Radial Segment').step(1).setValue(8).onChange(() => {
      Maker.regenerateTorusKnot(mesh)
    }))

    guiElements.push(gui.add(meshData, 'tubeRadius', 0, 20).name('Tube Radius').setValue(4).onChange(() => {
      Maker.regenerateTorusKnot(mesh)
    }))


    guiElements.push(gui.add(meshData, 'tubularSegments', 2, 100).name('Tubular Segment').step(1).setValue(64).onChange(() => {
      Maker.regenerateTorusKnot(mesh)
    }))

    guiElements.push(gui.add(meshData, 'p', 0.1, 10).name('P').setValue(2).onChange(() => {
      Maker.regenerateTorusKnot(mesh)
    }))
    guiElements.push(gui.add(meshData, 'q', 0.1, 10).name('Q').setValue(3).onChange(() => {
      Maker.regenerateTorusKnot(mesh)
    }))
  }

  if (mesh != undefined) {
    scene.add(mesh)
    requestAnimationFrame(render)
  }
  
})


function clearGUIElemens() {
  for (let i = 0; i < guiElements.length; i++) {
    gui.remove(guiElements[i])
  }
  guiElements = []
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

function render(time) {
    if (chosenShape == undefined) {
      return
    }

    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }


    const speed = .2
    const rot = time * speed
    // mesh.rotation.x = rot
    curveObject.rotation.z = rot / 10
    curveObject.rotation.x = rot / 10
    mesh.rotation.y = rot

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

requestAnimationFrame(render)

document.querySelector('#sequenceUpload').onchange = function(){
let file = this.files[0];
let reader = new FileReader();
reader.onload = function(progressEvent){
    sequence = dna.generateFromFile(this.result)
};
reader.readAsText(file);
};

document.querySelector(".synthesizer-btn").onclick = () => {
    let dnaSequence
    if (document.querySelector("#sequenceCheckbox").checked) {
        dnaSequence = dna.generateRandom()
    } else {
        dnaSequence = sequence
    }
    let dnaPositions = dna.parsePositions()
    let jsonObj = {"sequence": dnaSequence}
    //console.log(jsonObj)
    document.querySelector(".json-input").value = JSON.stringify(jsonObj)
}



