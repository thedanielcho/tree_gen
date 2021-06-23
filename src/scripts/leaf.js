import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three';
import "core-js/stable";
import "regenerator-runtime/runtime";

class Leaf {
  constructor(loader, requestRender){
    this.mesh = [];
    this.requestRender = requestRender;
    this.params = {
      color: 0x34822d
    }
    this.loader = loader;

  }


  async setupLeafMesh(long){
    // debugger
    let path = 'src/models/leaf.glb'
    if(long){
      path = 'src/models/leaf-long.glb'
    }
    let file = await this.loader.loadAsync(path)
    let mesh = file.scenes[0].children[2];
    mesh.scale.set(7,7,7);
    mesh.material = new THREE.MeshToonMaterial();
    mesh.material.color.set(this.params.color)
    return mesh
  }

}

export default Leaf;