import * as THREE from "three";
import * as Data from "./shapeData";

const polyhedronJSON = require("./polyhedron/shapes.json")
const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

export function makeDefault() {}

export function makeCube(obj = null) {
  
  const geometry = new THREE.WireframeGeometry(
    new THREE.BoxGeometry(
      Data.cubeData.width,
      Data.cubeData.height,
      Data.cubeData.depth,
      Data.cubeData.widthSegments + 1,
      Data.cubeData.heightSegments + 1,
      Data.cubeData.depthSegments + 1
    )
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeSphere(obj = null) {
  const geometry = new THREE.WireframeGeometry(
    new THREE.SphereGeometry(
      Data.sphereData.radius,
      Data.sphereData.widthSegments,
      Data.sphereData.heightSegments
    )
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeCylinder(obj = null) {
  const geometry = new THREE.CylinderGeometry(
    Data.cylinderData.radiusTop,
    Data.cylinderData.radiusBottom,
    Data.cylinderData.height,
    Data.cylinderData.radialSegments
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeCone(obj = null) {
  const geometry = new THREE.ConeGeometry(
    Data.coneData.radius,
    Data.coneData.height,
    Data.coneData.radialSegments
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makePolyhedron(shapeName) {
  const verticesOfCube = polyhedronJSON[shapeName]["vertices"]
  const indicesOfFaces =  polyhedronJSON[shapeName]["faces"]

  const geometry = new THREE.PolyhedronGeometry(
    verticesOfCube,
    indicesOfFaces,
    Data.polyhedronData.radius,
    Data.polyhedronData.detail
  );
  
  const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x00ff00, side: THREE.DoubleSide, opacity: 0.5, transparent: true}));
  const edges = new THREE.EdgesGeometry( geometry );
  const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );

  return [mesh, line];
}

export function makeTetrahedron(obj = null) {
  const geometry = new THREE.TetrahedronGeometry(
    Data.tetrahedronData.radius,
    Data.tetrahedronData.detail
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeOctahedron(obj = null) {
  const geometry = new THREE.OctahedronGeometry(
    Data.octahedronData.radius,
    Data.octahedronData.detail
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeIcosahedron(obj = null) {
  const geometry = new THREE.IcosahedronGeometry(
    Data.icosahedronData.radius,
    Data.icosahedronData.detail
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeDodecahedron(obj = null) {
  const geometry = new THREE.DodecahedronGeometry(
    Data.dodecahedronData.radius,
    Data.dodecahedronData.detail
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeTorus(obj = null) {
  const geometry = new THREE.TorusGeometry(
    Data.torusData.radius,
    Data.torusData.tubeRadius,
    Data.torusData.radialSegments,
    Data.torusData.tubularSegments
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

export function makeTorusKnot(obj = null) {
  const geometry = new THREE.TorusKnotGeometry(
    Data.torusKnotData.radius,
    Data.torusKnotData.tubeRadius,
    Data.torusKnotData.tubularSegments,
    Data.torusKnotData.radialSegments,
    Data.torusKnotData.p,
    Data.torusKnotData.q
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
}

function regenerate(obj, geometry) {
  obj.geometry.dispose();
  obj.geometry = geometry;
  return obj;
}
