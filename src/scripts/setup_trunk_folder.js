const setupTrunkFolders = (mesh, folder, requestRender) => {

  const bones = mesh.skeleton.bones;
  let params = {
    lean: 0,
    rotation: false,
    width: 1,
    height: 1,
    basePos: 0
  };
  debugger
  folder.add(params, "lean", -0.5, 0.5).onChange(setLean.bind(this));
  folder.add(params, "rotation", true, false).onChange(rotateY.bind(this));
  folder.add(params, "width", 0.8, 1).onChange(changeWidth.bind(this));
  folder.add(params, "height", 0.8, 1.2).onChange(changeHeight.bind(this));

  function setLean(){
    for(let i = 0; i< bones.length; i++){
      // debugger
      const bone = bones[i];
      
      if(i === 0){
        bone.rotation.z = 0
      } else if(i > bones.length-4){
        debugger
        bone.rotation.z = -params.lean;
        bone.position.x = params.lean * 3;
      } else if(i === bones.length-4){
        bone.rotation.z = 0;
      } else {
        bone.rotation.z = params.lean;
        bone.position.x = -params.lean * 3;
      }
    }
    requestRender();
  }

  function rotateY(){
    for(let i = 0; i< bones.length; i++){
      // debugger
      const bone = bones[i];
      if(i <= 1){
        bone.rotation.y = 0
      } else if(params.rotation) {
        bone.rotation.y = (Math.random() * (0 - 2)).toFixed(4)
      } else {
        bone.rotation.y = 0
      }
    }
    requestRender();
  }

  function changeWidth(){
    for(let i = 0; i< bones.length; i++){
      // debugger
      const bone = bones[i];
      if(i === 0){
      } else {
        bone.scale.x = params.width;
        // bone.scale.y = params.width;
        bone.scale.z = params.width;
      }
    }
    requestRender();
  }

  function changeHeight(){
    const bone = bones[0];
    bone.scale.y = params.height;
    // requestRender();
    // for(let i = 0; i< bones.length; i++){
    //   // debugger
    //   const bone = bones[i];
    //   if(i === 0){
    //     debugger
    //     params.basePos = bone.position.y;
    //   } else {
    //     debugger
    //     bone.scale.y = params.height;
    //     // bone.position.y = 14  + params.height;
    //   }
    // }
    requestRender();
  }
}

export default setupTrunkFolders;