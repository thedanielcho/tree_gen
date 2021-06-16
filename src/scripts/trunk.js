import * as THREE from 'three';
import createCylinder from './create_cylinder';
import createBones from './create_bones';
import createMesh from './create_mesh';
import {GUI} from 'dat.gui';
import Branch from './branch';

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
      lean: 0,
      rotate: false,
      straight: false,
      width: 1,
      height: 1,
      basePos: 0,
      color: 0x58433d,
      branchNum: 20.0
    };
    debugger
    this.branchSizing = {
      width: Math.floor(sizing.width / 3),
      segmentHeight: Math.floor(sizing.segmentHeight/1.5), 
      segmentCount: Math.floor(sizing.segmentCount/1.5),
      height: Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5),
      halfHeight: (Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5)) / 2,
    }
    this.branches = [];
    this.initialBranchPos = [];
    this.setupTrunkFolder();
    this.setupBranches();
  }

  setupTrunkMesh(){
    const trunkGeo = createCylinder(this.sizing);
    const bones = createBones(this.sizing);
    let mesh = createMesh(trunkGeo, bones, this.folder, this.requestRender);
    return mesh  
  }

  setupTrunkFolder(){
    this.folder.addColor(this.params, 'color').onChange(this.changeColor.bind(this));
    this.folder.add(this.params, "lean", -0.5, 0.5).onChange(this.setLean.bind(this));
    this.folder.add(this.params, "rotate", true, false).onChange(this.rotateY.bind(this));
    this.folder.add(this.params, "straight", true, false).onChange(this.unrotateY.bind(this))
    this.folder.add(this.params, "width", 0.8, 1).onChange(this.changeWidth.bind(this));
    this.folder.add(this.params, "height", 0.8, 1.2).onChange(this.changeHeight.bind(this));
    this.folder.open();
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
      if(i === 0){``
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
    debugger
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i <= 1){
        bone.rotation.y = 0
      } else{
        bone.rotation.y = (Math.random() * (0 - 2)).toFixed(4)
      }
    }
    this.params.rotate = false
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
      let branch = new Branch(this.branchSizing, this.branchFolder, this.requestRender, (i + 1));
      this.connectBranch(branch);
    }
  }

  setupBranchesFolder(){
    this.branchFolder.add(this.params, "branchNum", 0, 20).onChange(this.changeBranchNum.bind(this));
  }

  changeBranchNum(){
    
    if(this.branches.length <= Math.floor(this.params.branchNum)){
      while(this.branches.length < Math.floor(this.params.branchNum)){
        debugger
        let branch = new Branch(this.branchSizing, this.branchFolder, this.requestRender, (this.branches.length + 1))
        this.connectBranch(branch);
      }
    } else if(this.branches.length > Math.floor(this.params.branchNum)){
      while(this.branches.length > Math.floor(this.params.branchNum)){
        debugger
        let branch = this.branches.pop();
        this.initialBranchPos.pop();
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
        // debugger
        return (sub[1] == y && sub[2] == z && sub[0] == x);
      })){
        // debugger
        different = true;
        this.initialBranchPos.push([x,y,z]);
      } else{
        // debugger
      }
    }
    branch.bones[0].position.x = this.bones[y].position.x;
    branch.bones[0].position.y = this.bones[y].position.y;
    branch.bones[0].position.z = this.bones[y].position.z;
    branch.bones[0].rotation.x = x;
    branch.bones[0].rotation.z = z;
    this.bones[y].add(branch.bones[0]);
    this.branches.push(branch);
    // debugger
    this.mesh.add(branch.mesh);
  }

}

export default Trunk;