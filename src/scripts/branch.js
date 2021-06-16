import createBones from "./create_bones";
import createCylinder from "./create_cylinder";
import createMesh from "./create_mesh";

class Branch {
  constructor(sizing, branchFolder, requestRender, i){
    this.sizing = sizing;
    this.branchFolder = branchFolder;
    this.folder = branchFolder.addFolder('Branch ' + i);
    this.mesh = this.setupBranchMesh();
    this.bones = this.mesh.skeleton.bones;
    this.requestRender = requestRender;
    this.params = {
      lean: 0,
      rotation: false,
      width: 1,
      height: 1,
      basePos: 0,
      color: 0x58433d
    };
    this.setupBranchFolder();
  }

  setupBranchMesh(){
    const branchGeo = createCylinder(this.sizing);
    const bones = createBones(this.sizing);
    const mesh = createMesh(branchGeo, bones, this.folder, this.requestRender);
    return mesh
  }

  setupBranchFolder(folder){
    this.folder.add(this.params, "lean", -0.5, 0.5).onChange(this.setLean.bind(this));
    this.folder.add(this.params, "rotation", true, false).onChange(this.rotateY.bind(this));
    this.folder.add(this.params, "width", 0.8, 1).onChange(this.changeWidth.bind(this));
    this.folder.add(this.params, "height", 0.5, 1.5).onChange(this.changeHeight.bind(this));
  }

  setLean(){
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i === 0){
        bone.rotation.z = bone.rotation.z
      } else if(i > this.bones.length-4){
        debugger
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
      } else if(this.params.rotation) {
        bone.rotation.y = (Math.random() * (0 - 2)).toFixed(4)
      } else {
        bone.rotation.y = 0
      }
    }
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

}

export default Branch;