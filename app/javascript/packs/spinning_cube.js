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
let rate = 0.01;
var animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += rate;
	cube.rotation.y += rate;

	renderer.render( scene, camera );
};

document.getElementById("guest").addEventListener("click", function() {
	rate += 0.05;
})

animate();