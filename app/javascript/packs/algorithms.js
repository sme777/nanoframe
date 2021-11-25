import { RGB_PVRTC_2BPPV1_Format } from "three"

export function findStrongestConnectedComponents(edges, ratio, dims) {
    const edgesLength = edges.length
    let maxStrength = -Infinity
    let edgeStart = -1
    let finalRatio = -1
    let finalArray = []
    ratio = Math.floor(edges.length * ratio)
    // const ratio = Math.floor(edges.length / 3)
    let subarray
    let subarrayStrength
    for (let j = ratio; j < edges.length; j++) {
        for (let i = 0; i < edges.length; i++) {
            subarray = findSubArray(edges, i, j)
            // console.log(subarray)
            subarrayStrength = findSubArrayStrength(subarray, dims)
            // console.log(subarrayStrength)
            if (subarrayStrength > maxStrength) {
                maxStrength = subarrayStrength
                edgeStart = i
                finalRatio = j
                finalArray = subarray
            }
        }
    }
    const remainingArray = findSubArray(edges, (edgeStart + finalArray.length - 1) % edgesLength, edgesLength - finalArray.length)
    return [finalArray, remainingArray, edgeStart, (edgeStart + finalArray.length- 1) % edgesLength]
    
}

function findSubArray(edges, start, length) {
    let count = 0
    let modIndex
    let subarray = []
    for (let i = start; count < length + 1; i++, count++) {
        modIndex = i % edges.length
        subarray.push(edges[modIndex])
    }
    return subarray
}


function findSubArrayStrength(subarray, dims) {
    const sI = subarray.length
    let coveredPlanes = {}
    // let pI
    // let eI
    let plane
    for (let i = 0; i < subarray.length-1; i++) {
        plane = findPlaneNumber(subarray[i], subarray[i+1], dims)
        if (coveredPlanes[plane] == undefined) {
            coveredPlanes[plane] = 1
        } else {
            coveredPlanes[plane] += 1
        }
    }
    let first, second, third
    const values = Object.values(coveredPlanes)
    first = Math.max(...values)
    values.splice(values.indexOf(first), 1)
    second = Math.max(...values)
    values.splice(values.indexOf(second), 1)
    third = Math.max(...values)
    return (first + second + third) / sI 
    
    
}
/* 
    front -> 0
    back -> 1
    top -> 2
    bottom -> 3
    left -> 4
    right -> 5
*/
function findPlaneNumber(v1, v2, dims) {
    if (v1.z == 0 && v2.z == 0) {
        return 0
    } else if (Math.abs(v1.z) == -dims[2] && Math.abs(v2.z) == -dims[2]) {
        return 1
    } else if (v1.y == dims[1] && v2.y == dims[1]) {
        return 2
    } else if (v1.y == 0 && v2.y == 0) {
        return 3
    } else if (v1.x == 0 && v2.x == 0) {
        return 4
    } else {
        return 5
    }
    // temp scale for routing colors
}
