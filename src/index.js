import * as THREE from 'three';
import { Bone, SkeletonHelper } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import createCylinder from './scripts/create_cylinder';
import createBones from './scripts/create_bones';
import createMesh from './scripts/create_mesh';
import setupDatGui from './scripts/setupfolders';
import oc from 'three-orbit-controls';
import {GUI} from 'dat.gui';
import setupTrunkFolders from './scripts/setup_trunk_folder';
import Trunk from './scripts/trunk';

function main() {
  const canvas = document.querySelector('#canvas');
  const renderer = new THREE.WebGLRenderer({canvas});

  //***camera
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, -100);
  // camera.up.set(0, 0, 0);
  camera.lookAt(0, 10, 0);

  const OrbitControls = oc(THREE)
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0,0,0);
  controls.update();
  // controls.enableDamping = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8f97a6);

  //***light
  let light;
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, -4);
    scene.add(light);
  }
  
  let planeGeo = new THREE.PlaneGeometry( 10000, 10000 );
  let material = new THREE.MeshToonMaterial({
    color: 0x6a9367,
    side: THREE.DoubleSide
  })
  let plane = new THREE.Mesh( planeGeo, material );

  plane.rotateX(THREE.Math.degToRad(90))
  scene.add(plane)

  let params = {
    bgColor: 0x8f97a6,
    lightColor: 0xFFFFFF,
    groundColor: 0x6a9367
  }
  
  //***setting up trunk
  const gui = new GUI();

  const bgFolder = gui.addFolder('Background');
  bgFolder.addColor(params, 'bgColor').onChange(changeBackgroundColor)
  bgFolder.addColor(params, "lightColor").onChange(changeLightColor)
  bgFolder.addColor(params, "groundColor").onChange(changeGroundColor);
  
  function changeBackgroundColor(){
    scene.background = new THREE.Color(params.bgColor)
    requestRenderIfNotRequested();
  }

  function changeLightColor(){
    light.color = new THREE.Color(params.lightColor);
    requestRenderIfNotRequested();
  }

  function changeGroundColor(){
    plane.material.color = new THREE.Color(params.groundColor);
    requestRenderIfNotRequested();
  }

  const segmentHeight = 14;
  const segmentCount = 7;
  const height = segmentHeight * segmentCount;
  const halfHeight = height * 0.5;
  
  const sizing = {
    width: 10,
    topWidth: 1,
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight,
  };

  const trunk = new Trunk(sizing, gui,requestRenderIfNotRequested);
  
  //***set up branches

  function setupBranch(sizing, folder, requestRender, trunkMesh){
    
    let branchSizing = {
      width: Math.floor(sizing.width / 2.5),
      segmentHeight: Math.floor(sizing.segmentHeight/1.5), 
      segmentCount: Math.floor(sizing.segmentCount/1.5),
      height: Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5),
      halfHeight: (Math.floor(sizing.segmentHeight/1.5) * Math.floor(sizing.segmentCount/1.5)) / 2,
    }
    let branchGeo = createCylinder(branchSizing);
    let branchBones = createBones(branchSizing);
    let branchMesh = createMesh(branchGeo, branchBones, folder, requestRender);
    return branchMesh;
  }

  let branches = [];


  

  // branches.push(setupBranch(sizing, branchFolder, requestRenderIfNotRequested))
  // branches.forEach(branch => {
  //   trunkMesh.add(branch);
  // })
  // let branchMesh = setupBranch(sizing, branchFolder, requestRenderIfNotRequested);
  // trunk.mesh.skeleton.bones[3].add(branchMesh.skeleton.bones[0]);
  // branchMesh.skeleton.bones[0].position.x = trunk.mesh.skeleton.bones[3].position.x;
  // branchMesh.skeleton.bones[0].position.y = trunk.mesh.skeleton.bones[3].position.y + 5;
  // branchMesh.skeleton.bones[0].position.z = trunk.mesh.skeleton.bones[3].position.z;
  // branchMesh.skeleton.bones[0].rotation.z = 0.5;
  // trunk.mesh.add(branchMesh)

  // let branchMesh2 = setupBranch(sizing, branchFolder, requestRenderIfNotRequested);
  // trunk.mesh.skeleton.bones[3].add(branchMesh2.skeleton.bones[0]);
  // branchMesh2.skeleton.bones[0].position.x = trunk.mesh.skeleton.bones[3].position.x;
  // branchMesh2.skeleton.bones[0].position.y = trunk.mesh.skeleton.bones[3].position.y + 5;
  // branchMesh2.skeleton.bones[0].position.z = trunk.mesh.skeleton.bones[3].position.z;
  // // branchMesh2.skeleton.bones[0].rotation.x = 1;
  // branchMesh2.skeleton.bones[0].rotation.z = 2.5;
  // trunk.mesh.add(branchMesh2)


  //ADD THESE BACK IN
  trunk.mesh.scale.multiplyScalar(1);
  scene.add(trunk.mesh);
  plane.position.y = trunk.bones[0].position.y;

  // let folder = gui.addFolder("test");
  // folder.addColor(new ColorGUIHelper(material, 'color'), 'value')

  // const loader = new GLTFLoader();
  // loader.load('src/models/leaf.glb', function (gltf) {
  //   let leaf = gltf.scene.children[2];
  //   leaf.scale.set(10,10,10);
  //   leaf.position.set(20,0,0);
  //   leaf.rotation.z = 15;
  //   scene.add(leaf)
  //   leaf.material = new THREE.MeshToonMaterial()
  //   leaf.material.color.set(0x34822d)
  // }, undefined, function (error) {
  //   console.error(error)
  // });

  // loader.load('src/models/leaf-long.glb', function (gltf) {
  //   let leaf = gltf.scene.children[2];
  //   leaf.scale.set(10,10,10);
  //   leaf.position.set(20,0,0);
  //   leaf.rotation.z = 0;
  //   scene.add(leaf)
  //   leaf.material = new THREE.MeshToonMaterial()
  //   leaf.material.color.set(0x34822d)
  // }, undefined, function (error) {
  //   console.error(error)
  // });



  //***rendering
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

  let renderRequested = false;

  function render() {
    // time *= 0.001;
    renderRequested = false;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    // requestAnimationFrame(render);
  }

  render();

  function requestRenderIfNotRequested() {
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }
  
  // controls.addEventListener('change', render);
  // window.addEventListener('resize', render);
  controls.addEventListener('change', requestRenderIfNotRequested);
  window.addEventListener('resize', requestRenderIfNotRequested);

  function displayInstructions(){
    const ul = document.querySelector('.instructions');
    if(ul.classList.contains("display")){
      ul.classList.remove("display")
      button.classList.remove("display")
    } else{
      ul.classList.add("display")
      button.classList.add("display")
    }
  }

  const button = document.querySelector('.instructions-button');
  button.addEventListener('click', displayInstructions);
  const x = document.querySelector(".x");
  x.addEventListener("click", displayInstructions)
  // requestAnimationFrame(render);

}

main();