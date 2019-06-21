import Controls from "./controls";
import Removal from "./removal"
import Timeline from "./timeline"
import Spring from "./spring"
import Gravity from "./gravity"
import Motion from "./motion"
import Collisions from "./collisions"
import Rotation from "./rotation"
import Obstacles from "./obstacles"
import Damage from "./damage"
import Streak from "./streak"
import CameraShake from "./cameraShake"
import Particles from "./particles"
import { throttle, controller } from "../utils";

export default [
  throttle(Removal, 300, entities => entities),
  controller(Controls),
  Spring,
  controller(Timeline),
  Gravity,
  Motion,
  Rotation,
  throttle(Obstacles, 300, entities => entities),
  Damage,
  Collisions,
  Streak,
  controller(Particles),
  controller(CameraShake)
];