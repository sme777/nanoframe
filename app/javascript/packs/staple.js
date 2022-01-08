import * as THREE from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'


export function GenerateStaple(edges, color, width=0.5) {
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
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i]
        let start = edge.v2
        let end = edge.v1
        let distance
        let dir
        if (start.x - end.x != 0) {
            distance = end.x - start.x
            dir = "x"
        } else {
            distance = end.z - start.z
            dir = "z"
        }
        for (let j = 0; Math.abs(j) < Math.abs(distance); ) {
            if (dir == "x") {
                points.push(new THREE.Vector3(start.x + j, start.y, start.z))
            } else {
                points.push(new THREE.Vector3(start.x, start.y, start.z + j))
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
    const arrowHeadPosition = [tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z + 0.4, tipPosition.x + 0.4, tipPosition.y + 0.01, tipPosition.z - 0.4, tipPosition.x - 0.8 + 0.4, tipPosition.y + 0.01, tipPosition.z]
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

