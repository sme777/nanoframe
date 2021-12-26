import * as THREE from 'three'

/**
 * 
 * @param {*} vectors 
 * @returns 
 */
export function normalize(vectors, wsl, hsl, dsl) {
    for (let i = 0; i < vectors.length; i++) {
        vectors[i].x *= wsl
        vectors[i].y *= hsl
        vectors[i].z *= dsl
    }
    return vectors
}

/**
 * 
 * @returns 
 */
export function mergeSets(planeRoutings) {
    let arr = []
    for (let i = 0; i < planeRoutings.length; i++) {
        for (let j = 0; j < planeRoutings[i].sets.length; j++)
            arr.push(planeRoutings[i].sets[j])
    }
    return arr
}

/**
 * 
 * @param {*} start 
 * @param {*} end 
 * @returns 
 */
export function getCurvePoints(start, end) {
    let positions = []
    let colors = []
    const divisions = 96
    const point = new THREE.Vector3()
    const spline = new THREE.CatmullRomCurve3([new THREE.Vector3(start[0], start[1], start[2]), new THREE.Vector3(end[0], end[1], end[2])])
    for (let i = 0, l = divisions; i < l; i++) {
        const t = i / l
        spline.getPoint(t, point)
        positions.push(point.x + (Math.random() - 0.5), point.y + (Math.random() - 0.5), point.z + (Math.random() - 0.5))
        colors.push(t, 0.5, t)
    }

    return [positions, colors]
}


/**
 * 
 * @param {*} v 
 * @returns 
 */
export function reverseArray(v) {
    let arr = []
    for (let i = v.length - 1; i > -1; i--) {
        arr.push(v[i])
    }
    return arr
}


/**
 * 
 * @param {*} vectors 
 * @param {*} v 
 * @returns 
 */
export function includesVector(vectors, v) {
    for (let i = 0; i < vectors.length; i++) {
        if (v.x == vectors[i].x && v.y == vectors[i].y && v.z == vectors[i].z) {
            return true
        }
    }
    return false
}

/**
 * 
 * @param {*} v1 
 * @param {*} v2 
 * @returns 
 */
export function equalsVector(v1, v2) {
    if (v1 == undefined || v2 == undefined) return false
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v2.z)
}

/**
 * 
 * @param {*} vertex 
 * @returns 
 */
export function vectorize(vertex) {
    return new THREE.Vector3(vertex.x, vertex.y, vertex.z)
}