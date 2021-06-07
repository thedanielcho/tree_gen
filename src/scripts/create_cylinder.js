import { CylinderGeometry, Float32BufferAttribute, Uint16BufferAttribute, Vector3 } from 'three';

//sizing is segment height and segment count and width
const createCylinder = (sizing) => {
  const segmentHeight = sizing.segmentHeight;
  const segmentCount = sizing.segmentCount;
  const width = sizing.width
  const height = sizing.height;
  const halfHeight = sizing.halfHeight;

  // debugger
  const geometry = new CylinderGeometry(
    Math.floor(width / 2),
    width,
    height,
    8,
    segmentCount * 3,
    false,
  );

  const position = geometry.attributes.position;
  const vertex = new Vector3();

  const skinIndices = [];
  const skinWeights = [];

  for(let i = 0; i < position.count; i++){
    vertex.fromBufferAttribute(position, i)
    const y = vertex.y + halfHeight;
    const skinIndex = Math.floor(y / segmentHeight);
    const skinWeight = (y % segmentHeight) / segmentHeight;

    skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));

  return geometry;
  
}

export default createCylinder;