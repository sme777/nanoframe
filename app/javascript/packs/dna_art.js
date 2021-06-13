var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

//var renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
var renderer = new THREE.WebGLRenderer({canvas: artifactCanvas});

var cylinder = 0x2e50ac;
var purple = 0x74ffc4;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 35;

var tubeGeometry = new THREE.CylinderGeometry(0.4,0.4,10,32);
var ballGeometry = new THREE.SphereGeometry(1.1,32,32);

var cylinderMaterial = new THREE.MeshBasicMaterial( { color: cylinder } );
var purpleMaterial = new THREE.MeshBasicMaterial( { color: purple } );

var dna = new THREE.Object3D();
var holder = new THREE.Object3D();


for (var i = 0; i <= 20; i++) {

	var cylinder = new THREE.Mesh(tubeGeometry, cylinderMaterial);
	cylinder.rotation.z = 90 * Math.PI/180; 
	cylinder.position.x = 0;

	var ballRight = new THREE.Mesh( ballGeometry, purpleMaterial );
	ballRight.position.x = 6;

	var ballLeft = new THREE.Mesh( ballGeometry, purpleMaterial );
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