import * as THREE from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

export function GenerateStaple(edges, color, width=0.5, isStaple=false) {
    const resolution = new THREE.Vector2( window.innerWidth, window.innerHeight )

    let arrowGroup = new THREE.Group()

    let tipPosition = edges[edges.length - 1].v1
    let basePosition = edges[0].v2

    arrowGroup.add(getArrowTail(basePosition))
    

    let lineMaterial = new MeshLineMaterial()
    lineMaterial.color = new THREE.Color(color)
    lineMaterial.lineWidth = width
    lineMaterial.resolution = resolution
    lineMaterial.side = THREE.DoubleSide
    let line = new MeshLine()
    let points = []
    let distance
    let dir
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i]
        let start = edge.v2
        let end = edge.v1
        let vector
        if (start.x - end.x != 0) {
            distance = end.x - start.x
            dir = "x"
        } else {
            distance = end.z - start.z
            dir = "z"
        }
        
        for (let j = 0; Math.abs(j) < Math.abs(distance); ) {
            
            if (dir == "x") {
                vector = new THREE.Vector3(start.x + j, start.y, start.z)
                // if (isStaple && i + 1 < edges.length) {
                //     vector = adjustStaplePositions(findDirectionalChange(edge, edges[i+1]), [edge, edges[i+1]])
                // }
                points.push(vector)
            } else {
                vector = new THREE.Vector3(start.x, start.y, start.z + j)
                // if (isStaple && i + 1 < edges.length) {
                //     vector = adjustStaplePositions(findDirectionalChange(edge, edges[i+1]), [edge, edges[i+1]])
                //     i += 1
                // }
                points.push(vector)
            }

            if (distance < 0) {
                j -= 0.1
            } else {
                j += 0.1
            }
        }
    }
    line.setPoints(points)
    let mesh = new THREE.Mesh(line, lineMaterial)
    arrowGroup.add(mesh)
    arrowGroup.add(getArrowHead(tipPosition, dir, distance))
    return arrowGroup

}

function getArrowHead(tipPosition, dir, distance) {
    let arrowHeadGeometry = new THREE.BufferGeometry()

    let arrowHeadPosition
    
    // cons
    if (dir == "x" && distance < 0) {
        arrowHeadPosition = [tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z - 0.4, tipPosition.x - 0.8 + 0.4, tipPosition.y + 0.01, tipPosition.z]
    } else if (dir == "x" && distance > 0) {
        arrowHeadPosition = [tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z - 0.4, tipPosition.x + 0.8 - 0.4, tipPosition.y + 0.01, tipPosition.z]
    } else if (dir == "z" && distance < 0) {
        arrowHeadPosition = [tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x - 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x, tipPosition.y + 0.01, tipPosition.z - 0.8 + 0.4]
    } else {
        arrowHeadPosition = [tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x - 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x, tipPosition.y + 0.01, tipPosition.z + 0.8 - 0.4]
    }
    arrowHeadGeometry.setAttribute('position', new THREE.Float32BufferAttribute(arrowHeadPosition, 3))
    let arrowHeadMeaterial = new THREE.MeshBasicMaterial({
        color: 0x000000
     })
    let arrowHeadMesh = new THREE.Mesh(arrowHeadGeometry, arrowHeadMeaterial)
    return arrowHeadMesh
}


function getArrowTail(basePosition) {
    const arrowTailGeometry = new THREE.PlaneGeometry( 0.75, 0.75 )
    const arrowTailMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} )
    const arrowTailMesh = new THREE.Mesh( arrowTailGeometry, arrowTailMaterial )
    arrowTailMesh.position.set(basePosition.x, basePosition.y + 0.01, basePosition.z)
    arrowTailMesh.rotateX(Math.PI/2)
    return arrowTailMesh
}

function adjustStaplePositions(changes, arr) {
    const [xCh1, zCh1, xCh2, zCh2] = changes
    let start1 = arr[0]
    let end1 = arr[1]
    let end2 = arr[2]

    if (xCh1 > 0 && zCh2 > 0) {
        end1.z += 0.5
        start1.z += 0.5
        end2.x -= 0.5
        end1.x -= 0.5
    } else if (xCh1 > 0 && zCh2 < 0) {
        start1.z -= 0.5
        end1.z -= 0.5
        end1.x -= 0.5
        end2.x -= 0.5
    } else if (xCh1 < 0 && zCh2 > 0) {
        start1.z += 0.5
        end1.z += 0.5
        end1.x += 0.5
        end2.x += 0.5
    } else if (xCh1 < 0 && zCh2 < 0) {
        start1.z -= 0.5
        end1.z -= 0.5
        end1.x += 0.5
        end2.x += 0.5
    } else if (zCh1 > 0 && xCh2 < 0) {
        start1.x -= 0.5
        end1.x -= 0.5
        end1.z -= 0.5
        end2.z -= 0.5
    } else if (zCh1 > 0 && xCh2 > 0) {
        start1.x += 0.5
        end1.x += 0.5
        end1.z -= 0.5
        end2.z -= 0.5
    } else if (zCh1 < 0 && xCh2 > 0) {
        end1.x += 0.5
        start1.x += 0.5
        end2.z += 0.5
        end1.z += 0.5
    } else if (zCh1 < 0 && xCh2 < 0) {
        end1.x -= 0.5
        start1.x -= 0.5
        end2.z += 0.5
        end1.z += 0.5
    } else if (xCh1 > 0) {
        start1.z -= 0.5
        end1.z -= 0.5
    } else if (xCh1 < 0) {
        start1.z += 0.5
        end1.z += 0.5
    } else if (zCh1 > 0) {
        start1.x += 0.5
        end1.x += 0.5
    } else if (zCh1 < 0) {
        start1.x += 0.5
        end1.x += 0.5
    } else if (xCh2 > 0) {
        start1.z += 0.5
        end1.z += 0.5
    } else if (xCh2 < 0) {
        start1.z -= 0.5
        end1.z -= 0.5
    } else if (zCh2 > 0) {
        start1.x += 0.5
        end1.x += 0.5
    } else if (zCh2 < 0) {
        start1.x -= 0.5
        end1.x -= 0.5
    }
    return [start1, end1, end2]
}

function findDirectionalChange(e1, e2) {

    const xCh1 = e1.v2.x - e2.v1.x
    const zCh1 = e1.v2.z - e2.v1.z
    const xCh2 = e1.v1.x - e1.v2.x
    const zCh2 = e1.v1.z - e1.v2.z

    return [xCh1, zCh1, xCh2, zCh2]
}

