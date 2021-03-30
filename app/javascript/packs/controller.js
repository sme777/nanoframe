import Voxel from "packs/voxel";

// Enums
const Shape = Object.freeze({
    CUBE:   Symbol("cube"),
    SPHERE:  Symbol("sphere"),
    PRISM: Symbol("prism"),
    TETRAHEDRON: Symbol("tetrahedron") 
});

const Type = Object.freeze({
    DNA: Symbol("dna"),
    RNA: Symbol("rna"),
    ENZYME: Symbol("enzyme")
})

class Controller{
    constructor(type, shape) {
        this.type = type;
        this.shape = shape;
    }
    generateScaffold() {
        if (this.type === Type.DNA) {
            this.generateDNAScaffold();
        } else if (this.type === Type.RNA) {
            this.generateRNAScaffold();
        } else {
            this.generateENZYMEScaffold();
        }
    }

    generateDNAScaffold() {
        
    }
    
    generateRNAScaffold() {

    }
    
    generateENZYMEScaffold() {

    }

}

const x = new Controller(Type.DNA, Shape.CUBE);
x.generateScaffold();

