import createBones from "./create_bones";
import createCylinder from "./create_cylinder";
import createMesh from "./create_mesh";
import Leaf from "./leaf";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import "core-js/stable";
import "regenerator-runtime/runtime";
import * as THREE from 'three';

class Branch {
  constructor(sizing, branchFolder, requestRender, color, leafColor){
    this.sizing = sizing;
    // this.branchFolder = branchFolder;
    this.folder = [];
    this.params = {
      lean: 0,
      twist: false,
      straight: false,
      width: 1,
      height: 1,
      basePos: 0,
      color: color,
      rotateY: (THREE.Math.radToDeg(1) % 360),
      rotateX: (THREE.Math.radToDeg(1) % 360),
      rotateZ: (THREE.Math.radToDeg(1) % 360),
      leafColor: leafColor
    };
    this.mesh = this.setupBranchMesh();
    this.bones = this.mesh.skeleton.bones;
    this.requestRender = requestRender;
    this.leaves = [];
    this.setupLeaves()
    // this.setupBranchFolder();
  }

  setupBranchMesh(){
    const branchGeo = createCylinder(this.sizing);
    const bones = createBones(this.sizing);
    const mesh = createMesh(branchGeo, bones, this.folder, this.requestRender, this.params.color);
    return mesh
  }

  setupBranchRotation(x,y,z){
    this.params.rotateX = (THREE.Math.radToDeg(x) % 360);
    this.params.rotateY = (THREE.Math.radToDeg(y) % 360);
    this.params.rotateZ = (THREE.Math.radToDeg(z) % 360);
  }

  setupBranchFolder(folder){
    this.folder = folder;
    folder.add(this.params, "lean", -0.5, 0.5).onChange(this.setLean.bind(this));
    folder.add(this.params, "twist", true, false).onChange(this.rotateY.bind(this));
    folder.add(this.params, "straight", true, false).onChange(this.unrotateY.bind(this))
    folder.add(this.params, "width", 0.8, 1).onChange(this.changeWidth.bind(this));
    folder.add(this.params, "height", 0.5, 1.5).onChange(this.changeHeight.bind(this));
    folder.add(this.params, "rotateY", 0, 360).onChange(this.rotationY.bind(this));
    folder.add(this.params, "rotateX", 0, 360).onChange(this.rotationX.bind(this));
    folder.add(this.params, "rotateZ", 0, 360).onChange(this.rotationZ.bind(this));
  }

  rotationY(){
    let bone = this.bones[0];
    bone.rotation.y = THREE.Math.degToRad(this.params.rotateY);
    this.requestRender();
  }

  rotationX(){
    let bone = this.bones[0];
    bone.rotation.x = THREE.Math.degToRad(this.params.rotateX);
    this.requestRender();
  }

  rotationZ(){
    let bone = this.bones[0];
    bone.rotation.z = THREE.Math.degToRad(this.params.rotateZ);
    this.requestRender();
  }

  setLean(){
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i === 0){
        bone.rotation.z = bone.rotation.z
      } else if(i > this.bones.length-4){
        bone.rotation.z = -this.params.lean;
        bone.position.x = this.params.lean * 3;
      } else if(i === this.bones.length-4){
        bone.rotation.z = 0;
      } else {
        bone.rotation.z = this.params.lean;
        bone.position.x = -this.params.lean * 3;
      }
    }
    this.requestRender();
  }

  rotateY(){
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i <= 1){
        bone.rotation.y = 0
      } else{
        bone.rotation.y = (Math.random() * (0 - 2)).toFixed(4)
      }
    }
    this.params.twist = false
    this.requestRender();
  }

  unrotateY(){
    for(let i = 0; i < this.bones.length; i++){
      const bone = this.bones[i];
      bone.rotation.y = 0;
    }
    this.params.straight = false;
    this.requestRender();
  }

  changeWidth(){
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i === 0){
      } else {
        bone.scale.x = this.params.width;
        bone.scale.z = this.params.width;
      }
    }
    this.requestRender();
  }

  changeHeight(){
    const bone = this.bones[0];
    bone.scale.y = this.params.height;
    this.requestRender();
  }

  createLeaf(long){

  }

  async setupLeaves(){
    const loader = new GLTFLoader();
    for(let i = 0; i < 50; i++){
      let boneNum = Math.floor(Math.random() * ((this.bones.length - 1) - 1 + 1 ) + 1)
      let bone = this.bones[boneNum];
      let path = 'src/models/leaf-long.glb';
      if(boneNum === this.bones.length - 1){
        path = 'src/models/leaf.glb'
      }
      let file = await loader.loadAsync('src/models/leaf.glb')
      let leafMesh = file.scenes[0].children[2];
      leafMesh.scale.set(7,7,7);
      leafMesh.material = new THREE.MeshToonMaterial();
      leafMesh.material.color.set(this.params.leafColor)
      let max = bone.position.y;
      let min = this.bones[1].position.y;
      leafMesh.position.y = boneNum === this.bones.length - 1 ? 0 : Math.random() * (9 - 1) + 1;
      // leafMesh.position.x = bone.position.x;
      // leafMesh.position.z = bone.position.z;
      leafMesh.rotation.x = Math.random() * (6 - 1) + 1;
      leafMesh.rotation.y = Math.random() * (6 - 1) + 1;
      leafMesh.rotation.z = Math.random() * (6 - 1) + 1;
      bone.add(leafMesh)
      this.leaves.push(leafMesh);
      this.requestRender()
    }
    

    // let file = await loader.loadAsync('src/models/leaf-long.glb')
    // let leafMesh = file.scenes[0].children[2];
    // leafMesh.scale.set(7,7,7);
    // leafMesh.material = new THREE.MeshToonMaterial();
    // leafMesh.material.color.set(0xd96443)
    // 
    // leafMesh.position.y = Math.random() * (9 - 1) + 1;
    // // leafMesh.position.x = bone.position.x;
    // // leafMesh.position.z = bone.position.z;
    // leafMesh.rotation.x = Math.floor(Math.random() * (6 - 1) + 1);
    // leafMesh.rotation.y = Math.floor(Math.random() * (6 - 1) + 1);
    // leafMesh.rotation.z = Math.floor(Math.random() * (2 - 1) + 1);
    // bone.add(leafMesh)

    this.requestRender()
  }

}

export default Branch;