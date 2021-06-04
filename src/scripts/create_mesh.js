import { EdgesGeometry, FlatShading, LineBasicMaterial, LineSegments, MeshToonMaterial, Scene, Skeleton, SkeletonHelper, SkinnedMesh } from "three"

const createMesh = (geometry, bones) => {
  const material = new MeshToonMaterial({
    color: 0x58433d,
    flatShading: true
  })

  const mesh = new SkinnedMesh(geometry, material);
  const skeleton = new Skeleton(bones);

  var geo = new EdgesGeometry( mesh.geometry ); // or WireframeGeometry
  var mat = new LineBasicMaterial( { color: 0xffffff } );
  var wireframe = new LineSegments( geo, mat );
  mesh.add( wireframe );

  mesh.add(bones[0]);
  mesh.bind(skeleton);

  let skeletonHelper = new SkeletonHelper(mesh);
  skeletonHelper.material.linewidth = 2;

  return mesh;
}

export default createMesh;