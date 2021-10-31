import * as THREE from 'three'
import * as Data from './shapeData'

const wireframeMaterial = new THREE.LineBasicMaterial({color: 0x000000})

export function makeDefault() {

}

export function makeCube() {
  const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(
    Data.cubeData.width,
    Data.cubeData.height, 
    Data.cubeData.depth, 
    Data.cubeData.widthSegments + 1, 
    Data.cubeData.heightSegments + 1, 
    Data.cubeData.depthSegments + 1
  ))
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateCube(cube) {
    const newGeometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(
    Data.cubeData.width,
    Data.cubeData.height, 
    Data.cubeData.depth, 
    Data.cubeData.widthSegments + 1, 
    Data.cubeData.heightSegments + 1, 
    Data.cubeData.depthSegments + 1
  ))
  cube.geometry.dispose()
  cube.geometry = newGeometry
  return cube
}

export function makeSphere() {
  const geometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(
    Data.sphereData.radius, 
    Data.sphereData.widthSegments, 
    Data.sphereData.heightSegments
  ))
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateSphere(sphere) {
  const newGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(
    Data.sphereData.radius, 
    Data.sphereData.widthSegments, 
    Data.sphereData.heightSegments
  ))

  sphere.geometry.dispose()
  sphere.geometry = newGeometry
  return sphere
}

export function makeCylinder() {
  const geometry = new THREE.CylinderGeometry(
    Data.cylinderData.radiusTop, 
    Data.cylinderData.radiusBottom, 
    Data.cylinderData.height, 
    Data.cylinderData.radialSegments
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateCylinder(cylinder) {
  const newGeometry = new THREE.CylinderGeometry(
    Data.cylinderData.radiusTop, 
    Data.cylinderData.radiusBottom, 
    Data.cylinderData.height, 
    Data.cylinderData.radialSegments
  )
  cylinder.geometry.dispose()
  cylinder.geometry = newGeometry
  return cylinder
}


export function makeCone() {
  const geometry = new THREE.ConeGeometry(
    Data.coneData.radius, 
    Data.coneData.height, 
    Data.coneData.radialSegments
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateCone(cone) {
  const newGeometry = new THREE.ConeGeometry(
    Data.coneData.radius, 
    Data.coneData.height, 
    Data.coneData.radialSegments
  )
  cone.geometry.dispose()
  cone.geometry = newGeometry
  return cone
}

export function makePolyhedron() {
  const verticesOfCube = [
    -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
    -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
  ]
  const indicesOfFaces = [
      2, 1, 0,    0, 3, 2,
      0, 4, 7,    7, 3, 0,
      0, 1, 5,    5, 4, 0,
      1, 2, 6,    6, 5, 1,
      2, 3, 7,    7, 6, 2,
      4, 5, 6,    6, 7, 4,
  ]

  const geometry = new THREE.PolyhedronGeometry(
    verticesOfCube, 
    indicesOfFaces, 
    Data.polyhedronData.radius, 
    Data.polyhedronData.detail
  )  
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regeneratePolyhedron(polyhedron) {
    const verticesOfCube = [
    -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
    -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
  ]
  const indicesOfFaces = [
      2, 1, 0,    0, 3, 2,
      0, 4, 7,    7, 3, 0,
      0, 1, 5,    5, 4, 0,
      1, 2, 6,    6, 5, 1,
      2, 3, 7,    7, 6, 2,
      4, 5, 6,    6, 7, 4,
  ]

  const newGeometry = new THREE.PolyhedronGeometry(
    verticesOfCube, 
    indicesOfFaces, 
    Data.polyhedronData.radius, 
    Data.polyhedronData.detail
  )

  polyhedron.geometry.dispose()
  polyhedron.geometry = newGeometry
  return polyhedron

}

export function makeTetrahedron() {
  const geometry = new THREE.TetrahedronGeometry(
    Data.tetrahedronData.radius, 
    Data.tetrahedronData.detail
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateTetrahedron(tetrahedron) {
  const newGeometry = new THREE.TetrahedronGeometry(
    Data.tetrahedronData.radius, 
    Data.tetrahedronData.detail
  )

  tetrahedron.geometry.dispose()
  tetrahedron.geometry = newGeometry
  return tetrahedron
}

export function makeOctahedron() {
  const geometry = new THREE.OctahedronGeometry(
    Data.octahedronData.radius, 
    Data.octahedronData.detail
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateOctahedron(octahedron) {
  const newGeometry = new THREE.OctahedronGeometry(
    Data.octahedronData.radius, 
    Data.octahedronData.detail
  )

  octahedron.geometry.dispose()
  octahedron.geometry = newGeometry
  return octahedron
}

export function makeIcosahedron() {
  const geometry = new THREE.IcosahedronGeometry(
    Data.icosahedronData.radius, 
    Data.icosahedronData.detail
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateIcosahedron(icosahedron) {
  const newGeometry = new THREE.IcosahedronGeometry(
    Data.icosahedronData.radius, 
    Data.icosahedronData.detail
  )

  icosahedron.geometry.dispose()
  icosahedron.geometry = newGeometry
  return icosahedron
}

export function makeDodecahedron() {
  const geometry = new THREE.DodecahedronGeometry(
    Data.dodecahedronData.radius, 
    Data.dodecahedronData.detail
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateDodecahedron(dodecahedron) {
  const newGeometry = new THREE.DodecahedronGeometry(
    Data.dodecahedronData.radius, 
    Data.dodecahedronData.detail
  )

  dodecahedron.geometry.dispose()
  dodecahedron.geometry = newGeometry
  return dodecahedron
}

export function makeTorus() {
  const geometry = new THREE.TorusGeometry(
    Data.torusData.radius, 
    Data.torusData.tubeRadius,
    Data.torusData.radialSegments, 
    Data.torusData.tubularSegments
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateTorus(torus) {
  const newGeometry = new THREE.TorusGeometry(
    Data.torusData.radius, 
    Data.torusData.tubeRadius,
    Data.torusData.radialSegments, 
    Data.torusData.tubularSegments
  )

  torus.geometry.dispose()
  torus.geometry = newGeometry
  return torus
}

export function makeTorusKnot() {
  const geometry = new THREE.TorusKnotGeometry(
    Data.torusKnotData.radius, 
    Data.torusKnotData.tubeRadius, 
    Data.torusKnotData.tubularSegments, 
    Data.torusKnotData.radialSegments, 
    Data.torusKnotData.p, 
    Data.torusKnotData.q
  )
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial)
  return mesh
}

export function regenerateTorusKnot(torusKnot) {
  const newGeometry = new THREE.TorusKnotGeometry(
    Data.torusKnotData.radius, 
    Data.torusKnotData.tubeRadius, 
    Data.torusKnotData.tubularSegments, 
    Data.torusKnotData.radialSegments, 
    Data.torusKnotData.p, 
    Data.torusKnotData.q
  )

  torusKnot.geometry.dispose()
  torusKnot.geometry = newGeometry
  return torusKnot
}