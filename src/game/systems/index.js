import Camera from "./camera";
import Particles from "./particles";
import Removal from "./removal";
import Rotation from "./rotation";
import Timeline from "./timeline";
import HUD from "./hud";
import GamepadController from "./gamepad-controller";
import KeyboardController from "./keyboard-controller";
import MouseController from "./mouse-controller";
import Physics from "./physics";
import Spawn from "./spawn";

export default [
	GamepadController(),
	KeyboardController(),
	MouseController(),
	Camera({ pitchSpeed: -0.02, yawSpeed: 0.02 }),
	Particles,
	Removal,
	Rotation,
	Timeline,
	Spawn,
	Physics,
	HUD
];
