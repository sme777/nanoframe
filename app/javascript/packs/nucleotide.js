export class Nucleotide {
    constructor(rightBase, leftBase) {
        this.rightBase = rightBase;
        this.leftBase = leftBase;
    }
}

export const Base = Object.freeze({
    A: Symbol("adenine"),
    T: Symbol("thymine"),
    G: Symbol("guanine"),
    C: Symbol("cystosine")
});


