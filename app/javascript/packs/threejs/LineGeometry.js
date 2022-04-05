import { LineSegmentsGeometry } from "./LineSegmentsGeometry.js";

class LineGeometry extends LineSegmentsGeometry {
  constructor() {
    super();
    this.type = "LineGeometry";
  }

  setPositions(array) {
    const points = this.setMeta(array);
    super.setPositions(points);
    return this;
  }

  setColors(array) {
    const colors = this.setMeta(array);
    super.setColors(colors);
    return this;
  }

  setMeta(array) {
    let length = array.length - 3;
    let meta = new Float32Array(2 * length);

    for (let i = 0; i < length; i += 3) {
      meta[2 * i] = array[i];
      meta[2 * i + 1] = array[i + 1];
      meta[2 * i + 2] = array[i + 2];

      meta[2 * i + 3] = array[i + 3];
      meta[2 * i + 4] = array[i + 4];
      meta[2 * i + 5] = array[i + 5];
    }
    return meta;
  }

  fromLine(line) {
    let geometry = line.geometry;

    if (geometry.isGeometry) {
      console.error(
        "THREE.LineGeometry no longer supports Geometry. Use THREE.BufferGeometry instead."
      );
      return;
    } else if (geometry.isBufferGeometry) {
      this.setPositions(geometry.attributes.position.array);
    }
    return this;
  }
}

LineGeometry.prototype.isLineGeometry = true;

export { LineGeometry };
