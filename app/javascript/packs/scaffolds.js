import { Base } from "./nucleotide";

export class Scaffolds {
    static virus = [];
    static bacteria = [];
}

export const ScaffoldType = Object.freeze({
    Virus: Symbol("virus"),
    Bacteria: Symbol("bacteria")
});