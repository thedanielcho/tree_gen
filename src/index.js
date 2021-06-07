import * as THREE from 'three';
import { Bone, SkeletonHelper } from 'three';
import createCylinder from './scripts/create_cylinder';
import createBones from './scripts/create_bones';
import createMesh from './scripts/create_mesh';
import setupDatGui from './scripts/setupfolders';
import oc from 'three-orbit-controls';
import {GUI} from 'dat.gui';
import setupTrunkFolders from './scripts/setup_trunk_folder';

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
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, -4);
    scene.add(light);
  }
  
  //***setting up trunk
  const gui = new GUI();
  const trunkFolder = gui.addFolder(`Trunk`);

  const segmentHeight = 14;
  const segmentCount = 7;
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
  let trunkMesh = createMesh(cylinder, bones, trunkFolder, requestRenderIfNotRequested);

  //***set up branches


  
  // let skeletonHelper = new SkeletonHelper(trunkMesh);
  // skeletonHelper.material.linewidth = 2;
  // scene.add(skeletonHelper)

  setupTrunkFolders(trunkMesh, trunkFolder, requestRenderIfNotRequested);

  trunkMesh.scale.multiplyScalar(1);
  scene.add(trunkMesh);

  // let folder = gui.addFolder("test");
  // folder.addColor(new ColorGUIHelper(material, 'color'), 'value')



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
  // requestAnimationFrame(render);

}

main();