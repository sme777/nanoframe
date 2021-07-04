//import MTLLoader from 'three-mtl-loader';

let scene = new THREE.Scene();
var drawingSurface = document.getElementById('synthesizer');
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
//camera.position.set( 500, 800, 1300 );
//camera.lookAt( 0, 0, 0 );

let renderer = new THREE.WebGLRenderer( { antialias: true, canvas: drawingSurface} )
//let canvas_container = document.getElementById('synthesizer');
//renderer.setSize($(canvas_container).width(), $(canvas_container).height());
//canvas_container.appendChild(renderer.domElement);
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let isShiftDown = false;
const objects = [];

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

//backbone tubes


let cylinderMaterial = new THREE.MeshBasicMaterial( { color: cylinder } );
let purpleMaterial = new THREE.MeshBasicMaterial( { color: purple } );

let adenineMaterial = new THREE.MeshBasicMaterial( { color: adenine } );
let thymineMaterial = new THREE.MeshBasicMaterial( { color: thymine } );
let guanineMaterial = new THREE.MeshBasicMaterial( { color: guanine } );
let cytosineMaterial = new THREE.MeshBasicMaterial( { color: cytosine } );

let dna = new THREE.Object3D();
let holder = new THREE.Object3D();


for (var i = 0; i <= 0; i++) {


	let cylinder = new THREE.Mesh(tubeGeometry, cylinderMaterial);
	cylinder.rotation.z = 90 * Math.PI/180; 
	cylinder.position.x = 0;
	let ballRight;
	let ballLeft;
	let random_number1 = Math.random();
	let random_number2 = Math.random();
	if (random_number1 > 0.5) {
		if (random_number2 > 0.5) {
			ballRight = new THREE.Mesh( ballGeometry, adenineMaterial );
			ballLeft = new THREE.Mesh( ballGeometry, thymineMaterial );
		} else {
			ballRight = new THREE.Mesh( ballGeometry, thymineMaterial );
			ballLeft = new THREE.Mesh( ballGeometry, adenineMaterial );
		}
	} else {
		if (random_number2 > 0.5) {
			ballRight = new THREE.Mesh( ballGeometry, guanineMaterial );
			ballLeft = new THREE.Mesh( ballGeometry, cytosineMaterial );
		} else {
			ballRight = new THREE.Mesh( ballGeometry, cytosineMaterial );
			ballLeft = new THREE.Mesh( ballGeometry, guanineMaterial );
		}
	}
	ballRight.position.x = 6;
	ballLeft.position.x = -5;

	

	let row = new THREE.Object3D();
	if (i == 0) {
		let oxygen1 = new THREE.CylinderGeometry(0.4,0.4,5,32);
		let oxygen2 = new THREE.CylinderGeometry(0.4,0.4,5,32);
		let oxygen3 = new THREE.CylinderGeometry(0.4,0.4,5,32);
		let oxygen4 = new THREE.CylinderGeometry(0.4,0.4,5,32);

		const cylinder1 = new THREE.Mesh(oxygen1, cylinderMaterial);
		cylinder1.rotation.z = 45 * Math.PI/180;
		cylinder1.position.x = 3;
		const cylinder2 = new THREE.Mesh(oxygen2, cylinderMaterial);
		cylinder2.rotation.z = 90 * Math.PI/180;
		cylinder2.position.x = -3;
		const cylinder3 = new THREE.Mesh(oxygen3, cylinderMaterial);
		cylinder3.rotation.z = 90 * Math.PI/180;
		cylinder3.position.x = 3;
		const cylinder4 = new THREE.Mesh(oxygen4, cylinderMaterial);
		cylinder4.rotation.x = 90 * Math.PI/180;
		cylinder4.position.y = -3;
		const phosphor = new THREE.Mesh( ballGeometry, adenineMaterial );
		// row.add(cylinder1);
		// row.add(cylinder2);
		// row.add(cylinder3);
		// row.add(cylinder4);
		// row.add(phosphor);
		//const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		//const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

		//const cubeA = new THREE.Mesh( geometry, material );
		//cubeA.position.set( 20, 20, 0 );

		//const cubeB = new THREE.Mesh( geometry, material );
		//cubeB.position.set( -20, -20, 0 );

		//create a group and add the two cubes
		//These cubes can now be rotated / scaled etc as a group
		const group = new THREE.Group();
		group.add( cylinder1 );
		group.add( cylinder2 );
		group.add( cylinder3 );
		group.add( cylinder4 );
		group.add( phosphor );

		dna.add( group );
		
	} else {
		row.add(cylinder);
		row.add(ballRight);
		row.add(ballLeft);
		row.position.y = i*2;
		row.rotation.y = 30*i * Math.PI/180;
		dna.add(row);
	}




};


dna.position.y = -20;

scene.add(dna);

dna.position.y = -20;
holder.add(dna)
//objects.push(holder);
scene.add(holder);

var CubeConfigData = function() {
	this.zoom = 20;
};

// let mtlLoader = new MTLLoader();
// mtlLoader.load("backbone.mtl", function(materials){
// 	materials.preload();

// 	let objLoader = new THREE.OBJLoader();
// 	objLoader.setMaterials(materials);
// 	objLoader.load("/vecs/backbone.obj", function(object) {
// 		scene.add(object);
// 		render();
// 	});
// });





// var render = function () {

// 	requestAnimationFrame(render);

// 	holder.rotation.x += 0.00;
// 	holder.rotation.y += 0.00;
// 	renderer.render(scene, camera);
// }

render();

//document.addEventListener( 'mousemove', onDocumentMouseMove );
//document.addEventListener( 'mousedown', onDocumentMouseDown );
//document.addEventListener( 'keydown', onDocumentKeyDown );
//document.addEventListener( 'keyup', onDocumentKeyUp );

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
		console.log("yello");
        const intersect = intersects[ 0 ];

        rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
        rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

    }

    render();

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( objects );
	console.log(objects);
	console.log("me: "+ intersects.length);
    if ( intersects.length > 0 ) {
		console.log("fuck");
        const intersect = intersects[ 0 ];

        // delete cube

        if ( isShiftDown ) {

            if ( intersect.object !== plane ) {

                scene.remove( intersect.object );

                objects.splice( objects.indexOf( intersect.object ), 1 );

            }

            // create cube

        } else {

            const voxel = new THREE.Mesh( sphereGeo, cubeMaterial );
            voxel.position.copy( intersect.point ).add( intersect.face.normal );
            voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
            scene.add( voxel );

            objects.push( voxel );

        }

        render();

    }

}

function onDocumentKeyDown( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = true; break;
    }
}

function onDocumentKeyUp( event ) {
    switch ( event.keyCode ) {
        case 16: isShiftDown = false; break;
    }
}

function render() {
	renderer.render(scene, camera);
}

//render();