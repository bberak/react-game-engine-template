import * as THREE from "three";
import { add } from "../utils/three";
import { sound } from "../utils";
import Physics from "./base/physics";

export default ({
	parent,
	world,
	dynamic = true,
	x = 0,
	y = 0,
	z = 0,
	width = 1.1,
	breadth = 1.1,
	height = 1.1,
	scale = 1,
	color = 0x00e6ff,
}) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const material = new THREE.MeshStandardMaterial({ color });
	const box = new THREE.Mesh(geometry, material);

	box.position.x = x;
	box.position.y = y;
	box.position.z = z;
	box.scale.x = scale;
	box.scale.y = scale;
	box.scale.z = scale;

	add(parent, box);

	const crash = sound("./assets/audio/crash-01.wav", 16 * 40);

	return {
		model: box,
		physics: Physics({
			bodies: [
				{
					shape: "btBoxShape",
					size: {
						x: width * scale * 0.5,
						y: height * scale * 0.5,
						z: breadth * scale * 0.5,
					},
					position: { x, y, z },
					mass: 0.15,
					collisionGroup: 1,
					collisionMask: 1
				},
			],
			beginContact: (self, other, force, entities, { gamepadController }) => {
				crash();

				const camera = entities.camera;

				if (camera) camera.shake();

				if (gamepadController)
					gamepadController.vibrate({
						duration: 300,
						strongMagnitude: 0.3,
					});
			}
		}),
		removable: (frustum, self) => !frustum.intersectsObject(self.model),
	};
};
