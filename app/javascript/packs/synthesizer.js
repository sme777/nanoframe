const Shape = Object.freeze({
    CUBE:   Symbol("cube"),
    SPHERE:  Symbol("sphere"),
    PRISM: Symbol("prism"),
    TETRAHEDRON: Symbol("tetrahedron") 
});


let camera, scene, renderer;
let plane;
let mouse, raycaster, isShiftDown = false;

let rollOverMesh, rollOverMaterial;
let sphereGeo, cubeMaterial;

const objects = [];

init();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 500, 800, 1300 );
	camera.lookAt( 0, 0, 0 );

	scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xce1212, opacity: 1, transparent: false } );
    rollOverMaterial2 = new THREE.MeshBasicMaterial( {color: 0x000000, opacity: 1, transparent: false } );
    let initial_voxel_array = [];
    // roll-over helpers
    // for (i = 0; i < 20; i++) {
    //     const new_mesh_sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 50, 50), rollOverMaterial);
        
    //     initial_voxel_array.push(new_mesh_sphere);
    //     initial_voxel_array[i].position.set(Math.random() * 300, 0, i);
    //     //scene.add();
    // }
    // let firstarray = generateScaffold();
    // console.log(firstarray);
    // for (i = 0; i < firstarray.length; i++) {
    //     //console.log(firstarray[i]);
    //     scene.add(firstarray[i]);
        
    // }

    const curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        600, 400,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

    const points = curve.getPoints( 7249 );
    const geometry2 = new THREE.BufferGeometry().setFromPoints( points );

    const material = new THREE.LineBasicMaterial( { color : 0x000000 } );

    // Create the final object to add to the scene
    const ellipse = new THREE.Line( geometry2, material );
    const sphereArr = plotScaffoldPoints(points);
    //scene.add(ellipse);

    // for (i = 0; i < sphereArr.length; i++) {
    //     scene.add(sphereArr[i]);
    // }

    feedbackControlModel(points)
    // floating effect
    // let time = 0;
    // for (i = 0; time < 10000; i++) {
    //     if (i >= sphereArr.length) {
    //         i = 0;
    //     }
    //     sphereArr[i].position.set(sphereArr[i].position.x + 1, sphereArr[i].position.y - 1, sphereArr[i].position.z - 1)
    //     time += 1;
    // }
    //const rollOverGeo = new THREE.SphereGeometry( 10, 50, 50 );
    //rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    //scene.add( rollOverMesh );

    // cubes

    sphereGeo = new THREE.SphereGeometry( 10, 50, 50 );
    cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x000000});//, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );

    // grid

    const gridHelper = new THREE.GridHelper( 1500, 40 );
    scene.add( gridHelper );

    //

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const geometry = new THREE.PlaneGeometry( 1000, 1000);
    geometry.rotateX( - Math.PI / 2 );

    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );

    objects.push( plane );

    // lights

    const ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: synthesizer} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //document.addEventListener( 'mousemove', onDocumentMouseMove );
    //document.addEventListener( 'mousedown', onDocumentMouseDown );
    //document.addEventListener( 'keydown', onDocumentKeyDown );
    //document.addEventListener( 'keyup', onDocumentKeyUp );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

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

    if ( intersects.length > 0 ) {

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

    renderer.render( scene, camera );

}


// function generateScaffold() {
//     let position_array = [];
//     for (i = 0; i < 1000; i++) {
//         const voxel = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 50), rollOverMaterial);
//         voxel.position.set(-200+(i/5+Math.random()*30), 0, -(i/3+Math.random()*50));
//         position_array.push(voxel);
//     }

//     for (i = 0; i < 1000; i++) {
//         const lastVoxel = position_array[position_array.length - 1];
//         const voxel = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 50), rollOverMaterial2);
//         voxel.position.set(lastVoxel.position.x + (i/5+Math.random()*30), 0, lastVoxel.position.z);
//         position_array.push(voxel);
//     }
//     return position_array;
// }

// function plotScaffoldPoints(arr, material=rollOverMaterial) {
//     console.log(arr);
//     let sphereArr = [];
//     for (i = 0; i < arr.length; i += 1) {
//         const voxel = new THREE.Mesh(new THREE.SphereGeometry(1.5, 50, 50), material);
//         //console.log("dicks");
//         voxel.position.set(arr[i].x, arr[i].y, arr[i].z);
//         //console.log(arr[0].x);
//         sphereArr.push(voxel);
//     }
//     return sphereArr;
// }


// function feedbackControlModel(arr, desiredShape=Shape.CUBE) {
//     let firstPoint = arr[0];
//     let sides = ["up", "west", "east", "left", "up2", "up3"];
//     for (side = 0; side < sides.length; side++){
//         let startArr = arr.slice(0+1208*side, 1208+1208*side);
//         let endArr;
        
//         if (desiredShape === Shape.CUBE) {
//             endArr = generateCubePlane(firstPoint, 50, "short", sides[side]);
//             firstPoint = endArr[endArr.length - 1];
//             let newPoint = plotScaffoldPoints(endArr, rollOverMaterial2);

//             for (i = 0; i < newPoint.length; i++) {
//                 scene.add(newPoint[i]);
//             }
//         }
//     }
// }

function generateCubePlane(startPoint, length=50, mode="short", side) {
    
    //50nm = 1000 pixels
    //10nm = 200pixels
    const desLength = 250*1.5;
    const desWidth = -50*1.5;

    let platePoints = [];
    for (j = 0; j < 6; j++){
        let lastCoordinateX;
        let lastCoordinateY;
        let lastCoordinateZ;

        if (platePoints.length != 0) {
            lastCoordinateX = platePoints[platePoints.length - 1].x;
            lastCoordinateY = platePoints[platePoints.length - 1].y;
            lastCoordinateZ = platePoints[platePoints.length - 1].z;
        } else {
            lastCoordinateX = startPoint.x;
            lastCoordinateY = startPoint.y;
            lastCoordinateZ = startPoint.z;
        }

        // for loop for long plates

        if (side == "up") {

            for (i = 0; i < 148; i++) {
                if (j % 2 == 0) {
                    platePoints[i+j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY+i*desLength/147, lastCoordinateZ);
                } else {
                    platePoints[i+j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY-i*desLength/147, lastCoordinateZ);
                }
            }
        } else if (side == "west") {

            for (i = 0; i < 148; i++) {
                if (j % 2 == 0) {
                    platePoints[i+j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY, lastCoordinateZ-i*desLength/147);
                } else {
                    platePoints[i+j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY, lastCoordinateZ+i*desLength/147);
                }
            }
        } else if (side == "east") {
            if (j < 5) {
                for (i = 1; i < 26; i++) {
                    platePoints[i -1 + j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY-i*desWidth/25, lastCoordinateZ);
                }
            }
        } else if (side == "left") {
            if (j < 5) {
                for (i = 1; i < 26; i++) {
                    platePoints[i -1 + j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY+i*desWidth/25, lastCoordinateZ);
                }
            }
        } else if (side == "up2") {
            if (j < 5) {
                for (i = 1; i < 26; i++) {
                    platePoints[i -1 + j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY-i*desWidth/25, lastCoordinateZ);
                }
            }
        } else if (side == "up3"){
            for (i = 0; i < 148; i++) {
                if (j % 2 == 0) {
                    platePoints[i+j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY+i*desLength/147, lastCoordinateZ);
                } else {
                    platePoints[i+j*172] = new THREE.Vector3(lastCoordinateX, lastCoordinateY-i*desLength/147, lastCoordinateZ);
                }
            }
        }


        // for loop for short plates
        if (side == "up") {
            if (j < 5) {
                let straightLineEndpointX = platePoints[platePoints.length - 1].x;
                let straightLineEndpointY = platePoints[platePoints.length - 1].y;
                let straightLineEndpointZ = platePoints[platePoints.length - 1].z;
                let lastLength = platePoints.length;
                for (i = 1; i < 26; i++) {
                    platePoints[lastLength + i - 1] = new THREE.Vector3(straightLineEndpointX+i*desWidth/25, straightLineEndpointY, straightLineEndpointZ);
                }
            }
        } else if (side == "west") {
            if (j < 5) {
                let straightLineEndpointX = platePoints[platePoints.length - 1].x;
                let straightLineEndpointY = platePoints[platePoints.length - 1].y;
                let straightLineEndpointZ = platePoints[platePoints.length - 1].z;

                let lastLength = platePoints.length;
                for (i = 1; i < 26; i++) {
                    platePoints[lastLength + i - 1] = new THREE.Vector3(straightLineEndpointX-i*desWidth/25, straightLineEndpointY, straightLineEndpointZ);
                }
            }
        } else if (side == "east") {
            if (j < 5) {
                let straightLineEndpointX = platePoints[platePoints.length - 1].x;
                let straightLineEndpointY = platePoints[platePoints.length - 1].y;
                let straightLineEndpointZ = platePoints[platePoints.length - 1].z;
                let lastLength = platePoints.length;

                for (i = 0; i < 148; i++) {
                    if (j % 2 == 0) {
                        platePoints[lastLength + i] = new THREE.Vector3(straightLineEndpointX, straightLineEndpointY, straightLineEndpointZ-i*desLength/147);
                    } else {
                        platePoints[lastLength + i] = new THREE.Vector3(straightLineEndpointX, straightLineEndpointY, straightLineEndpointZ+i*desLength/147);
                    }
                }
            }
            camera.position.set( 1200, 1200, 1300 );
            camera.lookAt( 0, 90, 0 );
        } else if (side == "left") {
            if (j < 5) {
                let straightLineEndpointX = platePoints[platePoints.length - 1].x;
                let straightLineEndpointY = platePoints[platePoints.length - 1].y;
                let straightLineEndpointZ = platePoints[platePoints.length - 1].z;
                let lastLength = platePoints.length;

                for (i = 0; i < 148; i++) {
                    if (j % 2 == 0) {
                        platePoints[lastLength + i] = new THREE.Vector3(straightLineEndpointX-i*desLength/147, straightLineEndpointY, straightLineEndpointZ);
                    } else {
                        platePoints[lastLength + i] = new THREE.Vector3(straightLineEndpointX+i*desLength/147, straightLineEndpointY, straightLineEndpointZ);
                    }
                }
            }
        } else if (side == "up2") {
            if (j < 5) {
                let straightLineEndpointX = platePoints[platePoints.length - 1].x;
                let straightLineEndpointY = platePoints[platePoints.length - 1].y;
                let straightLineEndpointZ = platePoints[platePoints.length - 1].z;
                let lastLength = platePoints.length;

                for (i = 0; i < 148; i++) {
                    if (j % 2 == 0) {
                        platePoints[lastLength + i] = new THREE.Vector3(straightLineEndpointX, straightLineEndpointY, straightLineEndpointZ+i*desLength/147);
                    } else {
                        platePoints[lastLength + i] = new THREE.Vector3(straightLineEndpointX, straightLineEndpointY, straightLineEndpointZ-i*desLength/147);
                    }
                }
            }
        } else if (side == "up3") {
            if (j < 5) {
                let straightLineEndpointX = platePoints[platePoints.length - 1].x;
                let straightLineEndpointY = platePoints[platePoints.length - 1].y;
                let straightLineEndpointZ = platePoints[platePoints.length - 1].z;

                let lastLength = platePoints.length;
                for (i = 1; i < 26; i++) {
                    platePoints[lastLength + i - 1] = new THREE.Vector3(straightLineEndpointX, straightLineEndpointY, straightLineEndpointZ+i*desWidth/25);
                }
            }
        }
    }

    //console.log(platePoints);
    return platePoints;
}