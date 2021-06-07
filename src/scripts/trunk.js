import * as THREE from 'three';
import createCylinder from './create_cylinder';
import createBones from './create_bones';
import createMesh from './create_mesh';
import {GUI} from 'dat.gui';

class Trunk {
  constructor(sizing, gui, requestRender){
    this.sizing = sizing;
    this.gui = gui;
    this.folder = gui.addFolder('Trunk');
    this.mesh = this.setupTrunkMesh()
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
    this.setupTrunkFolder();
  }

  setupTrunkMesh(){
    const trunkGeo = createCylinder(this.sizing);
    debugger
    const bones = createBones(this.sizing);
    debugger
    let mesh = createMesh(trunkGeo, bones, this.folder, this.requestRender);
    return mesh  
  }

  setupTrunkFolder(){
    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }
    debugger
    this.folder.addColor(this.params, 'color').onChange(this.changeColor.bind(this));
    this.folder.add(this.params, "lean", -0.5, 0.5).onChange(this.setLean.bind(this));
    this.folder.add(this.params, "rotation", true, false).onChange(this.rotateY.bind(this));
    this.folder.add(this.params, "width", 0.8, 1).onChange(this.changeWidth.bind(this));
    this.folder.add(this.params, "height", 0.8, 1.2).onChange(this.changeHeight.bind(this));
    this.folder.open();
  }
  
  changeColor(){
    this.mesh.material.color.set(this.params.color)
    this.requestRender()
  }

  setLean(){
    for(let i = 0; i< this.bones.length; i++){
      const bone = this.bones[i];
      if(i === 0){
        bone.rotation.z = 0
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

export default Trunk;