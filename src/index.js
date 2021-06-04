import * as THREE from 'three';
import { Bone } from 'three';
import createCylinder from './scripts/create_cylinder';
import createBones from './scripts/create_bones';
import createMesh from './scripts/create_mesh';

function main() {
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 30, 30);
  // camera.up.set(0, 0, 0);
  camera.lookAt(0, 10, 0);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8f97a6);

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  
  const segmentHeight = 5;
  const segmentCount = 5;
  const height = segmentHeight * segmentCount;
  const halfHeight = height * 0.5;
  
  const sizing = {
    width: 10,
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight,
  };
  
  const cylinder = createCylinder(sizing);
  const bones = createBones(sizing);
  let trunkMesh = createMesh(cylinder, bones);
  debugger

  // const geometry = new THREE.CylinderGeometry(5, 5, 50, 10, 15, false);
  // const position = geometry.attributes.position;
  // const vertex = new THREE.Vector3();
  // debugger
  // const skinIndices = [];
  // const skinWeights = [];
  
  // for (let i = 0; i < position.count; i ++){
  //   vertex.fromBufferAttribute(position, i);

  //   const y = (vertex.y + sizing.halfHeight);

  //   const skinIndex = Math.floor(y / sizing.segmentHeight);
  //   const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

  //   skinIndices.push( skinIndex, skinIndex + 1, 0, 0);
  //   skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  // }

  // geometry.setAttribute( 'skinIndex', new THREE.Uint16BufferAttribute( skinIndices, 4 ) );
  // geometry.setAttribute( 'skinWeight', new THREE.Float32BufferAttribute( skinWeights, 4 ) );

  // let bones = [];

  // let prevBone = new Bone();
  // bones.push(prevBone);
  // prevBone.position.y = sizing.halfHeight;

  // for(let i = 0; i < sizing.segmentCount; i++){
  //   let bone = new Bone();
  //   bone.position.y = sizing.segmentHeight;
  //   bones.push(bone);
  //   prevBone.add(bone);
  //   prevBone = bone;
  // }

  // const material = new THREE.MeshPhongMaterial({emissive: 0x156289});

  // const mesh = new THREE.SkinnedMesh( geometry, material );
  // const skeleton = new THREE.Skeleton( bones );

  // const rootBone = skeleton.bones[ 0 ];
  // mesh.add( rootBone );

  // mesh.bind( skeleton );

  // trunkMesh.position.set(0,25,0);

  scene.add(trunkMesh);


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();