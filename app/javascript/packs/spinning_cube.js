var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({canvas: artifactCanvas});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff, 1 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x810000 } );
var cube = new THREE.Mesh( geometry, material );


scene.add( cube );

// const radius = 10;
// const radials = 16;
// const circles = 8;
// const divisions = 64;

// const helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
// scene.add( helper );

camera.position.z = 5;

var animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();