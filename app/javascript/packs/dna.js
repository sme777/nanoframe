import { Base } from "./nucleotide";
import { Scaffolds } from "./scaffolds";
import { ScaffoldType } from "./scaffolds";
import { Voxel } from "./voxel";

export class DNA {

    //static scaffolds = [];

    constructor(length, random=true, scaffold=null) {
        this.length = length;
        this.random = random;
        this.sequence = [];
        this.positions = [];
        this.bases = [Base.A, Base.C, Base.G, Base.T];
        this.scaffold = scaffold;
        this.generate();
        this.position(this.sequence);
    }

    generate() {
        if (this.random) {
            for (let i = 0; i < this.length; i++) {
                const seed = Math.floor(Math.random() * 4);
                this.sequence.push(this.bases[seed]);
            }
        } else {
            switch (this.scaffold) {
                case ScaffoldType.Virus:
                    this.sequence = Scaffolds.virus;
                    break;
                case ScaffoldType.Bacteria:
                    this.sequence = Scaffolds.bacteria;
                    break;
                default:
                    // dummy array made of all adenines
                    this.sequence = dummyScaffold();
            }
        }
    }

    position(array) {
        const breakpoint = Math.ceil(this.length * 0.4);
        for (let i = 0; i < breakpoint; i++) {
            let voxel;
            if (i == 0) {
                voxel = new Voxel(0, 0, 0);
            } else {
                let dx = this.positions[i].x + Math.random();
                let dy = this.positions[i].y + Math.random();
                let dz = this.positions[i].z + Math.random();
                validateVoxel(dx, dy, dz);
                voxel = new Voxel( + dx,  + dy,  + dz);
            }

            this.positions.push(voxel);
        }


    }

    dummyScaffold() {
        let arr = [];
        for (let i = 0; i < this.length; i++) {
            arr.push(this.bases[0]);
        }
        return arr;
    }

    getSequence() {
        return this.sequence;
    }


}