import Camera from "./camera";
import Particles from "./particles";
import Removal from "./removal";
import Rotation from "./rotation";
import Timeline from "./timeline";
import HUD from "./hud";
import GamepadController from "./gamepad-controller";
import KeyController from "./key-controller";
import MouseController from "./mouse-controller";
import Physics from "./physics";
import Spawn from "./spawn";
import Audio from "./audio";

export default [
	GamepadController(),
	KeyController(),
	MouseController(),
	Camera({ pitchSpeed: -0.02, yawSpeed: 0.02 }),
	Audio(),
	Particles,
	Removal,
	Rotation,
	Timeline,
	Spawn,
	Physics,
	HUD
];
