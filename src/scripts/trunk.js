import * as THREE from 'three';
import createCylinder from './create_cylinder';
import createBones from './create_bones';
import createMesh from './create_mesh';
import {GUI} from 'dat.gui';
import Branch from './branch';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


class Trunk {
  constructor(sizing, gui, requestRender){
    this.sizing = sizing;
    this.gui = gui;
    this.folder = gui.addFolder('Trunk');
    this.branchFolder = gui.addFolder(`Branches`);
    this.mesh = this.setupTrunkMesh()
    this.bones = this.mesh.skeleton.bones;
    this.requestRender = requestRender;
    this.params = {
      lean: 0.0,
      twist: false,
      straight: false,
      width: 1,
      height: 1,
      basePos: 0,
      color: 0x58433d,
      leafColor: 0x34822d,
      branchNum: 20.0,
      branches : {},
      random: false
    };
    this.branchSizing = {
      width: Math.floor(sizing.width / 4),
      segmentHeight: Math.floor(sizing.segmentHeight/1.5), 
      segmentCount: Math.floor(sizing.segmentCount/1.5),
      height: Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5),
      halfHeight: (Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5)) / 2,
    }
    this.branches = [];
    this.initialBranchPos = [];
    this.branchesFolders = [];
    this.leaves = [];
    this.setupTrunkFolder();
    this.setupBranches();
    this.setupLeaves();
  }

  setupTrunkMesh(){
    const trunkGeo = createCylinder(this.sizing);
    const bones = createBones(this.sizing);
    let mesh = createMesh(trunkGeo, bones, this.folder, this.requestRender, 0x58433d);
    return mesh  
  }

  setupTrunkFolder(){
    this.folder.addColor(this.params, 'color').onChange(this.changeColor.bind(this));
    this.folder.add(this.params, "lean", -0.7, 0.7).onChange(this.setLean.bind(this));
    this.folder.add(this.params, "twist", true, false).onChange(this.rotateY.bind(this));
    this.folder.add(this.params, "straight", true, false).onChange(this.unrotateY.bind(this))
    this.folder.add(this.params, "width", 0.8, 1).onChange(this.changeWidth.bind(this));
    this.folder.add(this.params, "height", 0.8, 1.2).onChange(this.changeHeight.bind(this));
    // this.folder.open();
    this.folder.addColor(this.params, 'leafColor').onChange(this.changeLeafColor.bind(this));
    this.folder.add(this.params, "random", true, false).onChange(this.randomize.bind(this));
  }

  randomize(){
    this.rotateY();
    this.params.lean = (Math.random() * (0.7 - (-0.7)) + (-0.5));
    this.params.width = Math.random() * (1 - 0.8) + 0.8;
    this.params.height = Math.random() * (1.2 - 0.8) + 0.8;
    this.params.branchNum = Math.ceil(Math.random() * (20 - 1) + 1);
    this.changeBranchNum();
    this.setLean();
    this.changeWidth();
    this.changeHeight();
    this.branches.forEach(branch => {
      branch.rotateY();
      branch.params.lean = Math.random() * (0.5 - (-0.5)) + (-0.5)
      branch.params.width = Math.random() * (1 - 0.8) + 0.8
      branch.params.height = Math.random() * (1 - 0.8) + 0.8;
      branch.params.rotateX = (THREE.Math.radToDeg(Math.random() * (6 - 1) + 1) % 360);
      branch.params.rotateZ = (THREE.Math.radToDeg(Math.random() * (6 - 1) + 1) % 360);
      branch.setLean();
      branch.changeWidth();
      branch.changeHeight();
      branch.folder.updateDisplay();
      branch.rotationX();
      branch.rotationZ();
    })
    this.params.random = false;
    this.folder.updateDisplay();
    this.branchFolder.updateDisplay();
    this.requestRender();
  }
  
  changeLeafColor(){
    this.branches.forEach(branch => {
      branch.leaves.forEach(leaf => {
        leaf.material.color.set(this.params.leafColor)
      })
    })
    this.leaves.forEach(leaf => {
      leaf.material.color.set(this.params.leafColor)
    })
    this.requestRender()
  }

  changeColor(){
    this.mesh.material.color.set(this.params.color);
    this.branches.forEach(branch => {
      branch.mesh.material.color.set(this.params.color)
    })
    this.requestRender()
  }

  setLean(){
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i === 0){
        bone.rotation.z = 0
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

  setupBranches(){
    this.setupBranchesFolder()
    for(let i = this.branches.length; i < this.params.branchNum; i++){
      let branch = new Branch(this.branchSizing, this.branchFolder, this.requestRender, this.params.color, this.params.leafColor);
      this.connectBranch(branch);
    }
  }

  setupBranchesFolder(){
    this.branchFolder.add(this.params, "branchNum", 0, 20).onChange(this.changeBranchNum.bind(this));
    for(let i = 1; i < this.bones.length - 2; i++){
      this.branchesFolders.push(this.branchFolder.addFolder('row ' + i))
    }
  }

  changeBranchNum(){
    
    if(this.branches.length <= Math.floor(this.params.branchNum)){
      while(this.branches.length < Math.floor(this.params.branchNum)){
        let branch = new Branch(this.branchSizing, this.branchFolder, this.requestRender, this.params.color, this.params.leafColor)
        this.connectBranch(branch);
      }
    } else if(this.branches.length > Math.floor(this.params.branchNum)){
      while(this.branches.length > Math.floor(this.params.branchNum)){
        let branch = this.branches.pop();
        let branchPos = this.initialBranchPos.pop();
        this.branchesFolders[branchPos[1]-1].removeFolder(branch.folder);
        this.bones[branchPos[1]].remove(branch.bones[0])
        this.mesh.remove(branch.mesh);
      }
    }
    this.requestRender();
  }

  connectBranch(branch){
    let anglesX = [-2.5, 2.5];
    let anglesZ = [-2, 2];
    let y;
    let x;
    let z;
    let different = false;
    while(!different){
      y = Math.floor(Math.random() * ((this.bones.length - 3) - 1 + 1 ) + 1);
      x = anglesZ[Math.floor(Math.random() * anglesZ.length)];
      z = anglesX[Math.floor(Math.random() * anglesX.length)];
      if (!this.initialBranchPos.some((sub) => {
        return (sub[1] == y && sub[2] == z && sub[0] == x);
      })){
        different = true;
        this.initialBranchPos.push([x,y,z]);
      } else{
      }
    }
    branch.bones[0].position.x = this.bones[y].position.x;
    branch.bones[0].position.y = this.bones[y].position.y;
    branch.bones[0].position.z = this.bones[y].position.z;
    branch.bones[0].rotation.x = x;
    branch.bones[0].rotation.z = z;
    branch.bones[0].rotation.y = 0;
    this.bones[y].add(branch.bones[0]);
    this.branches.push(branch);
    if(y === 0){
    }
    let rowFolder = this.branchesFolders[y-1];
    if(!rowFolder){
    }
    // let i = 
    branch.setupBranchRotation(x,0,z);
    let folder = rowFolder.addFolder('Branch ' + y + "," + x + "," + z);
    branch.setupBranchFolder(folder)


    this.mesh.add(branch.mesh);
  }
  
  async setupLeaves(){
    const loader = new GLTFLoader();
    for(let i = 0; i < 15; i++){
      let bone = this.bones[this.bones.length - 1];
      let path = 'src/models/leaf-long.glb';
      let file = await loader.loadAsync('src/models/leaf.glb')
      let leafMesh = file.scenes[0].children[2];
      leafMesh.scale.set(7,7,7);
      leafMesh.material = new THREE.MeshToonMaterial();
      leafMesh.material.color.set(this.params.leafColor)
      let max = bone.position.y;
      let min = this.bones[1].position.y;
      leafMesh.position.y = Math.random() * (1 - (-5)) + (-5);
      leafMesh.rotation.x = Math.random() * (6 - 1) + 1;
      leafMesh.rotation.y = Math.random() * (6 - 1) + 1;
      leafMesh.rotation.z = Math.random() * (6 - 1) + 1;
      bone.add(leafMesh);
      this.leaves.push(leafMesh);
      this.requestRender()
    }
  }

}

export default Trunk;