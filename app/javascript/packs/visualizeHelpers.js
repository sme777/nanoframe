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