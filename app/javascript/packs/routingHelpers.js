import * as THREE from 'three'

// returns a cube group object
export function makeCubeGroup(dimensions, segments) {
    const cubeGroup = new THREE.Group()
    const width = dimensions[0]
    const height = dimensions[1]
    const depth = dimensions[2]

    let widthLength = 1

    // for (let j = 0; j < 2; j++) {
    //     const gridHelper = new THREE.GridHelper(width, segments, 0xD3D3D3, 0xD3D3D3)
    //     j % 2 == 1 ? gridHelper.position.set(0, width/2, 0) : gridHelper.position.set(0, -width/2, 0)
    //     cubeGroup.add(gridHelper)
    // }
    
    for (let i = 1; i < segments ; i++) {
        const g1 = createGrid({height: width / 2, width: widthLength, linesHeight: Math.floor(depth / 0.34), linesWidth: 3, color: 0x000000})
        const g2 = createGrid({height: widthLength, width: height / 2, linesHeight: 3, linesWidth: Math.floor(width / 0.34), color: 0x000000})
        const g3 = createGrid({height: width / 2, width: widthLength, linesHeight: Math.floor(depth / 0.34), linesWidth: 3, color: 0x000000})
        const g4 = createGrid({height: widthLength, width: height / 2, linesHeight: 3, linesWidth: Math.floor(width / 0.34), color: 0x000000})
        g1.position.set(0, -width/2 + (i * height / segments), depth /2 )
        // g2.position.set(-width/2 + (i * width / segments), 0, depth /2 )
    
        g3.position.set(0, -width/2 + (i * height / segments), -depth /2 )
        // g4.position.set(-width/2 + (i * width / segments), 0, -depth /2 )
    
        cubeGroup.add(g1)
        cubeGroup.add(g2)
        cubeGroup.add(g3)
        cubeGroup.add(g4)    
 
    }
    
    
    // for (let j = 0; j < 2; j++) {
    //     const gridHelper = new THREE.GridHelper(height, segments, 0xD3D3D3, 0xD3D3D3)
    //     gridHelper.geometry.rotateZ( Math.PI / 2 );
    //     j % 2 == 1 ? gridHelper.position.set(height / 2, 0, 0) : gridHelper.position.set(-height / 2, 0, 0) 
    //     cubeGroup.add(gridHelper)
    // }
    
    // for (let i = 1; i < segments ; i++) {
    //     const g1 = createGrid({height: width / 2, width: widthLength, linesHeight: Math.floor(height / 0.34), linesWidth: 3, color: 0x000000}, Math.PI / 2)
    //     const g2 = createGrid({height: widthLength, width: depth / 2, linesHeight: 3, linesWidth: Math.floor(height / 0.34), color: 0x000000},  Math.PI / 2)
    //     const g3 = createGrid({height: width / 2, width: widthLength, linesHeight: Math.floor(height / 0.34), linesWidth: 3, color: 0x000000},  Math.PI / 2)
    //     const g4 = createGrid({height: widthLength, width: depth / 2, linesHeight: 3, linesWidth: Math.floor(height / 0.34), color: 0x000000},  Math.PI / 2)
    //     // g2.geometry.rotateX(Math.PI / 2) , 0, 0,  Math.PI / 2
    //     g1.position.set(0, height /2, -depth/2 + (i * depth / segments))
    //     g2.position.set(-height/2 + (i * width / segments), height /2 , 0)
    //     g3.position.set(0, - height /2, -depth/2 + (i * depth / segments) )
    //     g4.position.set(-height/2 + (i * width / segments), - height /2 , 0)
    
        
    //     cubeGroup.add(g1)
    //     cubeGroup.add(g2)
    //     cubeGroup.add(g3)
    //     cubeGroup.add(g4)    
    
    // }
    
    // // for (let j = 0; j < 2; j++) {
    // //     const gridHelper = new THREE.GridHelper(depth, segments, 0xD3D3D3, 0xD3D3D3)
    // //     gridHelper.geometry.rotateX( Math.PI / 2 );
    // //     j % 2 == 1 ? gridHelper.position.set(0, 0, depth /2 ) : gridHelper.position.set(0, 0, -depth / 2) 
    // //     cubeGroup.add(gridHelper)
    
    // // }
    
    // for (let i = 1; i < segments ; i++) {
    //     const g1 = createGrid({height: height / 2, width: widthLength, linesHeight: Math.floor(depth / 0.34), linesWidth: 3, color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    //     const g2 = createGrid({height: widthLength, width: depth / 2, linesHeight: 3, linesWidth: Math.floor(depth / 0.34), color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    //     const g3 = createGrid({height: height / 2, width: widthLength, linesHeight: Math.floor(depth / 0.34), linesWidth: 3, color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    //     const g4 = createGrid({height: widthLength, width: depth / 2, linesHeight: 3, linesWidth: Math.floor(depth / 0.34), color: 0x000000}, Math.PI / 2, 0, Math.PI / 2)
    //     g1.position.set(width /2, 0, -depth/2 + (i * depth / segments))
    //     g2.position.set(width /2 , -height/2 + (i * height / segments),  0)
    //     g3.position.set(- width /2, 0, -depth/2 + (i * depth / segments))
    //     g4.position.set(- width /2 , -height/2 + (i * height / segments),  0)
    
    //     cubeGroup.add(g1)
    //     cubeGroup.add(g2)
    //     cubeGroup.add(g3)
    //     cubeGroup.add(g4)   
    // }
    // neeed to change for rectangles
    const geometry = new THREE.BoxGeometry( width, height, depth)
    const edges = new THREE.EdgesGeometry( geometry )
    const mesh = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({ color: 0xD3D3D3 }))
    cubeGroup.add(mesh)

    return cubeGroup
}

// returns an array of plane groups
export function makePlanes(dimension, segments) {
    let planeArray = []
    for (let i = 0; i < 6; i++) {
        const group = new THREE.Group()
        const grid = new THREE.GridHelper(dimension, segments, 0xD3D3D3, 0xD3D3D3)
        // console.log(grid.geometry)
        for (let j = 1; j < segments; j++) {
            const g1 = createGrid({height: dimension / 2, width: 1, linesHeight: Math.floor(dimension / 0.34), linesWidth: 3, color: 0x000000}, Math.PI / 2)
            const g2 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: Math.floor(dimension / 0.34), color: 0x000000}, Math.PI / 2)
            // const g3 = createGrid({height: dimension / 2, width: 1, linesHeight: Math.floor(dimension / 0.34), linesWidth: 3, color: 0x000000})
            // const g4 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: Math.floor(dimension / 0.34), color: 0x000000})
            // g1.position.set(0, 0, 0)
            g1.position.set(0, 0 , -dimension/2 + (j * dimension / segments))
            g2.position.set(-dimension/2 + (j * dimension / segments), 0, 0)

            // g3.position.set(0, -dimension/2 + (i * dimension / segments), - dimension /2 )
            // g4.position.set(-dimension/2 + (i * dimension / segments), 0, - dimension /2 )
        
            group.add(g1)
            group.add(g2)
            // cubeGroup.add(g3)
            // cubeGroup.add(g4)    
        }
        // const g1 = createGrid({height: dimension / 2, width: 1, linesHeight: Math.floor(dimension / 0.34), linesWidth: 3, color: 0x000000})
        // const g2 = createGrid({height: 1, width: dimension / 2, linesHeight: 3, linesWidth: Math.floor(dimension / 0.34), color: 0x000000})
        // g1.position.set(dimension /2, 0, -dimension/2 + (i * dimension / segments))
        // g2.position.set(dimension /2 , -dimension/2 + (i * dimension / segments),  0)
        group.add(grid)
        // group.add(g1)
        // group.add(g2)
        planeArray.push(group)
    }
    return planeArray
}

export function makeRoutings(planeRoutings) {
    let routings = []
    for (let i = 0; i < 6; i++) {

    }
    return routings
}

// neighbors of planes
export function planeNeighbors(planes) { 
    return {
        "front": {
            "up": ["top", planes[1], 1],
            "right": ["right", planes[2], 2],
            "down": ["bottom", planes[3], 3],
            "left": ["left", planes[4], 4]
        },
        
        "right": {
            "up": ["top", planes[1], 1],
            "right": ["back", planes[5], 5],
            "down": ["bottom", planes[0], 0],
            "left": ["front", planes[3], 3]
        },

        "left": {
            "up": ["top", planes[1], 1],
            "right": ["front", planes[0], 0],
            "down": ["bottom", planes[3], 3],
            "left": ["back", planes[5], 5]
        },

        "back": {
            "up": ["top", planes[1], 1],
            "right": ["left", planes[4], 4],
            "down": ["bottom", planes[3], 3],
            "left": ["right", planes[2], 2]
        },

        "top": {
            "up": ["back", planes[5], 5],
            "right": ["right", planes[2], 2],
            "down": ["front", planes[0], 0],
            "left": ["left", planes[4], 4]
        },

        "bottom": {
            "up": ["front", planes[0], 0],
            "right": ["right", planes[2], 2],
            "down": ["back", planes[5], 5],
            "left": ["left", planes[4], 4]
        }
    }
}

export function planeStringToNum() {
    return {
        "S1": 0,
        "S2": 1,
        "S3": 2,
        "S4": 3,
        "S5": 4,
        "S6": 5
    }
}

function createGrid(opts, rotationX=0, rotationY=0, rotationZ=0) {
    const config = opts || {
        height: 30,
        width: 30,
        linesHeight: 10,
        linesWidth: 10,
        color: 0xB0B0B0
    }

    const material = new THREE.LineBasicMaterial({
        color: config.color,
        opacity: 1
    })
    const positions = new Float32Array(config.width * config.linesWidth  + config.height * config.linesHeight )
    const colors = new Float32Array(config.width * config.linesWidth  + config.height * config.linesHeight )
    const gridObject = new THREE.Object3D(),
    gridGeo = new THREE.BufferGeometry(),
    stepw = 2 * config.width / config.linesWidth,
    steph = 2 * config.height / config.linesHeight
    // width
    // let count = 0
    let j = 0

    for (let i = -config.width; i <= config.width; i += stepw) {
        positions[j] = -config.height
        colors[j] = 176
        positions[j+1] = i
        colors[j+1] = 176
        positions[j+2] = 0
        colors[j+2] = 176
        // j += 3
        positions[j+3] = config.height
        colors[j+3] = 176
        positions[j+4] = i
        colors[j+4] = 176
        positions[j+5] = 0
        colors[j+5] = 176 
        j += 6
    
    }
    //height
    for (let i = -config.height; i <= config.height; i += steph) {
        positions[j] = i
        colors[j] = 176
        positions[j+1] = -config.width
        colors[j+1] = 176
        positions[j+2] = 0
        colors[j+2] = 176
        // j += 3
        positions[j+3] = i
        colors[j+3] = 176
        positions[j+4] = config.width
        colors[j+4] = 176
        positions[j+5] = 0
        colors[j+5] = 176 
        j += 6
    }
    // console.log(positions)
    gridGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    gridGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    gridGeo.computeBoundingBox()
    gridGeo.rotateX(rotationX)
    gridGeo.rotateY(rotationY)
    gridGeo.rotateZ(rotationZ)

    var line = new THREE.LineSegments(gridGeo, material);
    gridObject.add(line);

    return gridObject;
}

