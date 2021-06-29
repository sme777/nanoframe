import { Nucleotide } from "./nucleotide";


let nucleotides = [];

function loader(shape, height, width, length, scaffold_length) {
    generate(scaffold_length);
    if (shape == Shape.CUBE) {
        synthesizeCube(height, width, length);
    } else if (shape == Shape.PRISM) {
        synthesizePrism(he)
    }
}

function generate(scaffold_length) {
    for (i = 0; i < scaffold_length; i++) {
        let random_base = Math.random();
        let random_side = Math.random();
        let nucleotide;
        if (random_base > 0.5) {
            if (random_side > 0.5) {
                nucleotide = new Nucleotide(Base.A, Base.T);
            } else {
                nucleotide = new Nucleotide(Base.T, Base.A);
            }
        } else {
            if (random_side > 0.5) {
                nucleotide = new Nucleotide(Base.G, Base.C);
            } else {
                nucleotide = new Nucleotide(Base.C, Base.G);
            }
        }
        nucleotides.push(nucleotide);
    }
}

const Base = Object.freeze({
    A: Symbol("adenine"),
    T: Symbol("thymine"),
    G: Symbol("guanine"),
    C: Symbol("cystosine")
});

const Shape = Object.freeze({
    CUBE:         Symbol("cube"),
    SPHERE:       Symbol("sphere"),
    CYLINDER:     Symbol("cylinder"),
    CONE:         Symbol("cone"),
    POLYHEDRON:   Symbol("polyhedron"),
    TETRAHEDRON:  Symbol("tetrahedron"),
    OCTAHEDRON:   Symbol("octahedron"),
    ICOSAHEDRON:  Symbol("icosahedron"),
    DODECAHEDRON: Symbol("dodecahedron") 
});