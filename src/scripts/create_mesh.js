import { EdgesGeometry, FlatShading, LineBasicMaterial, LineSegments, MeshToonMaterial, Scene, Skeleton, SkeletonHelper, SkinnedMesh } from "three"
import {GUI} from 'dat.gui';

const createMesh = (geometry, bones, folder, requestRender, color) => {
  const material = new MeshToonMaterial({
    color: color,
  })

  const mesh = new SkinnedMesh(geometry, material);
  const skeleton = new Skeleton(bones);


  // var geo = new EdgesGeometry( mesh.geometry ); // or WireframeGeometry
  // var mat = new LineBasicMaterial( { color: 0xffffff } );
  // var wireframe = new LineSegments( geo, mat );
  // mesh.add( wireframe );

  mesh.add(bones[0]);
  mesh.bind(skeleton);

  return mesh;
}

export default createMesh;