export class Edge {
  // sequence is the portion of the scaffold from which strands will be generated
  // length is the the length of the edge
  // side is the side of the cube which is needed for B-type Refractions
  constructor(start, end, sequence, length, outgoer) {
    this.start = start;
    this.end = end;
    this.sequence = sequence;
    this.strandLength = length;
    this.outgoer = outgoer;
    this.next = null;
    this.prev = null;
    this.front = sequence.slice(0, length / 2);
    this.back = sequence.slice(length / 2);
    // this.reflection = this.computeReflection()
    // this.refraction = this.computeRefraction()
    // this.extensions = this.computeExtensions()
  }

  computeReflection() {
    const index = Math.floor(this.strandLength / 3);
    let subsequence;
    if (index > 25) {
      subsequence = this.sequence.slice(-25);
      this.sequence = this.sequence.slice(0, -25);
    } else if (index < 18) {
      subsequence = this.sequence.slice(-18);
      this.sequence = this.sequence.slice(0, -18);
    } else {
      subsequence = this.sequence.slice(-index);
      this.sequence = this.sequence.slice(0, -index);
    }
    return subsequence;
  }

  computeRefraction() {
    const endIndex = Math.floor(this.strandLength / 3);
    const startIndex = Math.floor((2 * this.strandLength) / 3);
    let subsequence;
    if (endIndex > 25) {
      subsequence = this.sequence.slice(0, 25);
      this.sequence = this.sequence.slice(25);
    } else if (startIndex < 18) {
      subsequence = this.sequence.slice(0, startIndex);
      this.sequence = this.sequence.slice(startIndex);
    } else {
      subsequence = this.sequence.slice(0, endIndex);
      this.sequence = this.sequence.slice(endIndex);
    }
    return subsequence;
  }

  computeExtensions() {
    const extensionLength = this.strandLength.length;
    const numOfStrands = Math.floor(extensionLength, 24);
    let stapleArr = [];
    let subsequence;
    for (let i = 0; i < numOfStrands; i++) {
      if (i == numOfStrands - 1) {
        stapleArr.push(this.sequence);
      } else {
        subsequence = this.sequence.slice(0, 24);
        this.sequence = this.sequence.slice(24);
        stapleArr.push(subsequence);
      }
    }
    return stapleArr;
  }
  set v1(x) {
    this.start = x;
  }

  get v1() {
    return this.start;
  }

  set v2(x) {
    this.end = x;
  }

  get v2() {
    return this.end;
  }
}
