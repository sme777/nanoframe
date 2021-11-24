import * as THREE from 'three'

export class DNA {


    constructor(length) {
        this.length = length
        this.positions = []
        // this.bases = [Base.A, Base.C, Base.G, Base.T]
        this.bases = ["A", "C", "G", "T"]
        this.position()
        
    }

    generate(random, scaffold) {
        this.sequence = random ? this.generateRandom() : this.generateFromFile(scaffold)
    }

    generateRandom() {
        let arr = []
        for (let i = 0; i < this.length; i++) {
            const seed = Math.floor(Math.random() * 4)
            arr.push(this.bases[seed])
        }
        return arr
    }

    generateFromFile(scaffold) {
        let arr = []
        for (let i = 0; i < scaffold.length; i++) {
            if (scaffold[i] === "A") {
                arr.push("A")
            } else if (scaffold[i] === "T") {
                arr.push("T")
            } else if (scaffold[i] === "G") {
                arr.push("G")
            } else if (scaffold[i] === "C") {
                arr.push("C")
            }
        }
        return arr
    }

    position() {
        
        let curve = this.getCurve()

        while (this.intersects(curve.getPoints(this.length))) {
            curve = this.getCurve()
        }
        this.positions = curve.getPoints(this.length - 1)
    }

    parsePositions(arr=this.positions) {
        let serial = []
        for (let i = 0; i < arr.length; i++) {
            let voxel = this.positions[i]
            serial.push(voxel.x)
            serial.push(voxel.y)
            serial.push(voxel.z)
        }
        return serial
    }

    getCurve() {
        const ratio = 100
        const initialX =  (Math.random()-0.5) * ratio
        const initialY = 0
        const initialZ = (Math.random()-0.5) * ratio

        const curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( initialX, initialY, initialZ ),
            new THREE.Vector3( (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio ),
            new THREE.Vector3( 0, (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio ),
            new THREE.Vector3( (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio ),
            new THREE.Vector3( (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio, 0 ),
            new THREE.Vector3( (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio ),
            //new THREE.Vector3( (Math.random()-0.5) * 2500, (Math.random()-0.5) * 2500, (Math.random()-0.5) * 2500 ),
            new THREE.Vector3( 0, (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio ),
            //new THREE.Vector3( (Math.random()-0.5) * 2500, (Math.random()-0.5) * 2500, (Math.random()-0.5) * 2500 ),
            new THREE.Vector3( (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio, 0 ),
            new THREE.Vector3( (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio, (Math.random()-0.5) * ratio ),
            new THREE.Vector3( initialX, initialY, initialZ )
        ] );

        return curve;
    }

    intersects(points) {
        for (let i = 0; i < this.length; i++) {
            let curr = points[i];
            for (let j = 0; j < this.length; j++) {
                if (i == j) {
                    continue
                } else {
                    let next = points[j]
                    let distance = Math.sqrt( Math.pow((curr.x-next.x), 2) + Math.pow((curr.y-next.y), 2) + Math.pow((curr.z - next.z), 2))
                    if (distance < 0.01) {
                        return true
                    }
                }
            }
        }
        return false
    }



    dummyScaffold() {
        let arr = [];
        for (let i = 0; i < this.length; i++) {
            arr.push(this.bases[0])
        }
        return arr;
    }

    getSequence() {
        return this.sequence
    }


}