import * as THREE from 'three';

const Spring = entities => {
  const springKeys = Object.keys(entities).filter(
    x => entities[x].spring && entities[x].physics
  );

  springKeys.forEach(s => {
    const { spring: { k, length, anchor, subtract }, physics: { position, forces } } = entities[s];

    const spring = subtract ? subtract(position, anchor) : new THREE.Vector3().subVectors(position, anchor);
    const d = spring.length();
    const stretch = d - length;

    spring.normalize();
    spring.multiplyScalar(-1 * k * stretch);

    forces.add(spring);
  })

  return entities;
}

export default Spring;