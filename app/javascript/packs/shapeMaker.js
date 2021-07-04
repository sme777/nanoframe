const wireframeMaterial = new THREE.LineBasicMaterial({color: 0x000000});

export function makeDefault() {

}

export function makeCube() {
  const size = 30;
  const widthSegments = 2;  
  const heightSegments = 3;  
  const depthSegments = 4;  
  const geometry = new THREE.WireframeGeometry(new THREE.BoxGeometry(size, size, size, widthSegments, heightSegments, depthSegments));
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makeSphere() {
  const radius =  22;  
  const widthSegments = 10;  
  const heightSegments = 8;
  const geometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(radius, widthSegments, heightSegments));
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
  //scene.add
}

export function makeCylinder() {
  const radiusTop = 18;  
  const radiusBottom = 10;  
  const height = 33;  
  const radialSegments = 12;  
  const geometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, height, radialSegments);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
  }


export function makeCone() {
  const radius = 20;  
  const height = 33;  
  const radialSegments = 20;  
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makePolyhedron() {
  const verticesOfCube = [
    -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
    -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
  ];
  const indicesOfFaces = [
      2, 1, 0,    0, 3, 2,
      0, 4, 7,    7, 3, 0,
      0, 1, 5,    5, 4, 0,
      1, 2, 6,    6, 5, 1,
      2, 3, 7,    7, 6, 2,
      4, 5, 6,    6, 7, 4,
  ];
  const radius = 22;  
  const detail = 0;  
  const geometry = new THREE.PolyhedronGeometry(
    verticesOfCube, indicesOfFaces, radius, detail);  
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
  } 

export function makeTetrahedron() {
  const radius = 22;  
  const detail = 0;  
  const geometry = new THREE.TetrahedronGeometry(radius, detail);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makeOctahedron() {
  const radius = 22;  
  const detail = 0; 
  const geometry = new THREE.OctahedronGeometry(radius, detail);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makeIcosahedron() {
  const radius = 22;  
  const detail = 0;  
  const geometry = new THREE.IcosahedronGeometry(radius, detail);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makeDodecahedron() {
  const radius = 22;  
  const detail = 0;  
  const geometry = new THREE.DodecahedronGeometry(radius, detail);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makeTorus() {
  const radius = 22;  
  const tubeRadius = 2;  
  const radialSegments = 8;  
  const tubularSegments = 24;  
  const geometry = new THREE.TorusGeometry(
      radius, tubeRadius,
      radialSegments, tubularSegments);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}

export function makeTorusKnot() {
  const radius = 15;  
  const tubeRadius = 4;  
  const radialSegments = 8;  
  const tubularSegments = 64;  
  const p = 2;  
  const q = 3;  
  const geometry = new THREE.TorusKnotGeometry(
      radius, tubeRadius, tubularSegments, radialSegments, p, q);
  const mesh = new THREE.LineSegments(geometry, wireframeMaterial);
  return mesh;
}