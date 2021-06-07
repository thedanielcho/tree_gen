import { EdgesGeometry, FlatShading, LineBasicMaterial, LineSegments, MeshToonMaterial, Scene, Skeleton, SkeletonHelper, SkinnedMesh } from "three"
import {GUI} from 'dat.gui';

const createMesh = (geometry, bones, folder, requestRender) => {
  const material = new MeshToonMaterial({
    color: 0x58433d,
    flatShading: true
  })

  const mesh = new SkinnedMesh(geometry, material);
  const skeleton = new Skeleton(bones);


  // var geo = new EdgesGeometry( mesh.geometry ); // or WireframeGeometry
  // var mat = new LineBasicMaterial( { color: 0xffffff } );
  // var wireframe = new LineSegments( geo, mat );
  // mesh.add( wireframe );

  mesh.add(bones[0]);
  mesh.bind(skeleton);


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

    folder.addColor(new ColorGUIHelper(material, 'color'), 'value')
        .name('color')
        .onChange(requestRender);
    folder.open();

    return mesh;
}

export default createMesh;