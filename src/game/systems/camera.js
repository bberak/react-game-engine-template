import { rotateAroundPoint } from "../utils/three";

const Camera = ({
  yawSpeed = 0.01,
  pitchSpeed = 0.01,
  zoomSpeed = 0.02
} = {}) => {
  return (entities, { keyboardController }) => {
    const camera = entities.camera;

    if (camera && keyboardController) {
      const { w, a, s, d, space, control } = keyboardController;

      //-- Yaw and pitch rotation
      if (w || a || s || d) {
        rotateAroundPoint(camera, camera.target, {
          y: (a ? 1 : d ? -1 : 0) * yawSpeed,
          x: (w ? 1 : s ? -1 : 0) * pitchSpeed
        });
        camera.lookAt(camera.target);
      }
      
      //-- Zooming (pinching)
      if (space || control) {
        const zoomFactor = (space ? 1 : control ? -1 : 0) * zoomSpeed;

        camera.zoom += zoomFactor;
        camera.updateProjectionMatrix();
      }
    }

    return entities;
  };
};

export default Camera;
