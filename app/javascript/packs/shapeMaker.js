import * as THREE from "three";
import * as Data from "./shapeData";

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

export function makePolyhedron(obj = null) {
  const verticesOfCube = [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
    -1, 1, 1,
  ];
  const indicesOfFaces = [
    2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
    3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
  ];

  const geometry = new THREE.PolyhedronGeometry(
    verticesOfCube,
    indicesOfFaces,
    Data.polyhedronData.radius,
    Data.polyhedronData.detail
  );
  return obj
    ? regenerate(obj, geometry)
    : new THREE.LineSegments(geometry, wireframeMaterial);
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
