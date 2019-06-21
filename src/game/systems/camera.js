import * as THREE from 'three';
import { find } from "../utils";

const adjustPosition = (camera, target) => {
  const distance = Math.abs(camera.position.z - target.z);

  if (distance > (camera.distanceFromTarget || 1))
    camera.position.z -= distance * 0.125;
}

const Camera = entities => {
  const camera = entities.camera
  const player = find(entities, x => x.model && x.player);
  const target = player.model.position.clone();

  adjustPosition(camera, target);

  return entities
}

export default Camera;