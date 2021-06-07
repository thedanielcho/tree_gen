import { Bone } from "three";

const createBones = (sizing) => {
  const segmentHeight = sizing.segmentHeight;
  const segmentCount = sizing.segmentCount;
  const width = sizing.width
  const height = segmentHeight * segmentCount;
  const halfHeight = height * 0.5;

  let bones = [];
  let prevBone = new Bone();
  bones.push(prevBone);
  prevBone.position.y = -halfHeight;
  
  for(let i = 0; i < segmentCount; i++){
    let bone = new Bone();
    bone.position.y = segmentHeight;
    bones.push(bone);
    prevBone.add(bone);
    prevBone = bone;
  }

  return bones;
}

export default createBones;