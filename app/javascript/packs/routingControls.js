import * as dat from "dat.gui";

const gui = new dat.GUI({
  autoPlace: false,
});

const guiTag = document.querySelector(".datGUIRouting");
if (guiTag.value == undefined) {
  guiTag.append(gui.domElement);
  guiTag.value = "added";
}

const context = Object.freeze({
  planeMode: Symbol("plane"),
  objectMode: Symbol("object"),
});
let switchContext = context.planeMode;

export const viewParams = {
  scaffold_color: 0xff0000,
  staple_color: 0xffff00,
  switchView: () => {
    if (switchContext == context.objectMode) {
      cubeGroup.position.z = 2000;
      currPlane.position.set(0, 0, 0);
      camera = prevCamera;
      controls = new OrbitControls(camera, renderer.domElement);
      // controls.enableRotate = false
      switchContext = context.planeMode;
      camera.position.y = initialCameraHeightPosition;
      scene.add(camera2);
    } else {
      controls.enableRotate = true;
      currPlane.position.set(0, 0, 2000);
      cubeGroup.position.z = 0;
      prevCamera = camera.clone();
      switchContext = context.objectMode;
      camera.position.y = 40;
      scene.remove(camera2);
    }
  },
};

export const selectionParams = {
  strand: () => {
    isRaycastMode = !isRaycastMode;
    console.log("strand selected");
  },

  crossover: () => {
    isRaycastMode = !isRaycastMode;
  },
  loopout: () => {
    isRaycastMode = !isRaycastMode;
  },
};

export const fivePrimeParams = {
  strand: () => {
    isRaycastMode = !isRaycastMode;
  },
  domain: () => {
    isRaycastMode = !isRaycastMode;
  },
};

export const threePrimeParams = {
  strand: () => {
    isRaycastMode = !isRaycastMode;
  },
  domain: () => {
    isRaycastMode = !isRaycastMode;
  },
};

export const otherParams = {
  pencil: () => {
    // isRaycastMode = true
  },

  split: () => {},

  insertion: () => {},

  deletion: () => {},
};

export function getContext() {
  return context;
}

export function getSwitchContext() {
  return switchContext;
}

export function setSwitchContext(ct) {
  switchContext = ct;
}

const viewFolder = gui.addFolder("view");
viewFolder
  .addColor(viewParams, "scaffold_color")
  .name("scaffold color")
  .onChange(() => {
    material.color.setHex(viewParams.scaffold_color);
  });
viewFolder.addColor(viewParams, "staple_color").name("staple color");
viewFolder.add(viewParams, "switchView").name("switch view");
viewFolder.closed = false;
const selectionFolder = gui.addFolder("selection");
selectionFolder.add(selectionParams, "strand");

selectionFolder.add(selectionParams, "crossover");
selectionFolder.add(selectionParams, "loopout");
selectionFolder.closed = false;

const fivePrimeFolder = selectionFolder.addFolder("5'");
const threePrimeFolder = selectionFolder.addFolder("3'");
fivePrimeFolder.add(fivePrimeParams, "strand");
fivePrimeFolder.add(fivePrimeParams, "domain");

threePrimeFolder.add(threePrimeParams, "strand");
threePrimeFolder.add(threePrimeParams, "domain");

const editFolder = gui.addFolder("edit");
editFolder.add(otherParams, "pencil");
editFolder.add(otherParams, "split");
editFolder.add(otherParams, "insertion");
editFolder.add(otherParams, "deletion");
editFolder.closed = false;
