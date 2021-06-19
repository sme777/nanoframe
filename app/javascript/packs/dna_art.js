let scene = new THREE.Scene();
var drawingSurface = document.getElementById('synthesizer');
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer( { antialias: true, canvas: drawingSurface} )
//let canvas_container = document.getElementById('synthesizer');
//renderer.setSize($(canvas_container).width(), $(canvas_container).height());
//canvas_container.appendChild(renderer.domElement);

let adenine = 0x87A96B;
let thymine = 0xA52A2A;
let guanine = 0x7CB9E8;
let cytosine = 0xF28C28;

let cylinder = 0x2e50ac;
let purple = 0x74ffc4;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 35;

let tubeGeometry = new THREE.CylinderGeometry(0.4,0.4,10,32);
let ballGeometry = new THREE.SphereGeometry(1.1,32,32);

let cylinderMaterial = new THREE.MeshBasicMaterial( { color: cylinder } );
let purpleMaterial = new THREE.MeshBasicMaterial( { color: purple } );

let adenineMaterial = new THREE.MeshBasicMaterial( { color: adenine } );
let thymineMaterial = new THREE.MeshBasicMaterial( { color: thymine } );
let guanineMaterial = new THREE.MeshBasicMaterial( { color: guanine } );
let cytosineMaterial = new THREE.MeshBasicMaterial( { color: cytosine } );

let dna = new THREE.Object3D();
let holder = new THREE.Object3D();


for (var i = 0; i <= 20; i++) {


	let cylinder = new THREE.Mesh(tubeGeometry, cylinderMaterial);
	cylinder.rotation.z = 90 * Math.PI/180; 
	cylinder.position.x = 0;
	let ballRight;
	let ballLeft;
	if (i % 2 == 0) {
		ballRight = new THREE.Mesh( ballGeometry, adenineMaterial );
		ballLeft = new THREE.Mesh( ballGeometry, thymineMaterial );
	} else {
		ballRight = new THREE.Mesh( ballGeometry, guanineMaterial );
		ballLeft = new THREE.Mesh( ballGeometry, cytosineMaterial );
	}
	ballRight.position.x = 6;
	ballLeft.position.x = -5;

	

	var row = new THREE.Object3D();

	row.add(cylinder);
	row.add(ballRight);
	row.add(ballLeft);

	row.position.y = i*2;
	row.rotation.y = 30*i * Math.PI/180;

	dna.add(row);

};


dna.position.y = -20;

scene.add(dna);

dna.position.y = -20;
holder.add(dna)
scene.add(holder);

var CubeConfigData = function() {
	this.zoom = 20;
};





var render = function () {

	requestAnimationFrame(render);

	holder.rotation.x += 0.00;
	holder.rotation.y += 0.06;
	renderer.render(scene, camera);
}

render();