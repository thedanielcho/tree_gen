import * as THREE from 'three';
import createCylinder from './create_cylinder';
import createBones from './create_bones';
import createMesh from './create_mesh';
import {GUI} from 'dat.gui';
import Branch from './branch';

class Row {
  constructor(folder, bone, requestRender){
    this.folder = folder;
    this.bone = bone;
    this.requestRender = this.requestRender;
    this.params = {
      branchNum = 4
    }
    
  }



}