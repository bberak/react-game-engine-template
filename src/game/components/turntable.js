import * as THREE from "three";
import { add, rotateAroundPoint } from "../utils/three";
import Physics, { Body } from "./base/physics";

export default ({ parent, items = [], x = 0, y = 0, z = 0, radius = 4, height = 0.2, color = 0xdddddd, segments = 32, opacity = 1, scale = 1 }) => {

	const geometry = new THREE.CylinderGeometry(radius, radius + radius * 0.1, height, segments);
	const material = new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, flatShading: true });
	const cylinder = new THREE.Mesh(geometry, material);

	cylinder.position.x = x;
	cylinder.position.y = y;
	cylinder.position.z = z;

	items.forEach((item, idx) => {
		item.model.position.z = radius - 1;
		rotateAroundPoint(item.model, cylinder.position, { y: ((Math.PI * 2) / items.length) * idx })
		add(cylinder, item);
	})
	
	add(parent, cylinder);

	//-- Using the Body constructor gives you a unique id
	//-- which is useful for creating joints and other constraints
	//-- and probably also compound bodies (but I haven't tried that yet)
	const body = Body({
		shape: "btCylinderShape",
		size: {
			x: radius * scale,
			y: height * scale * 0.5,
			z: radius * scale,
		},
		position: { x, y, z },
		mass: 0.1,
		linearFactor: { x: 0, y: 0, z: 0 },
		angularFactor: { x: 0, y: 1, z: 0 },
		localInertia: { x: 0.01, y: 0.01, z: 0.01 },
		friction: 0.01,
		restitution: 2,
		angularDamping: 0.3,
		rollingFriction: 0.01,
		collisionGroup: 1,
		collisionMask: 1,
		angularSleepingThreshold: 0
	})

	return {
		model: cylinder,
		turntable: true,
		physics: Physics({
			bodies: [body]
		}),
		timelines: {
			swipe: {
				while: true,
				update(self, entities, timeline, { gamepadController }) {
					if (gamepadController.rightTrigger)
						self.physics.applyTorque(self.physics.bodies[0], { x: 0, y: gamepadController.rightTrigger, z: 0 })
					else if (gamepadController.leftTrigger)
						self.physics.applyTorque(self.physics.bodies[0], { x: 0, y: -gamepadController.leftTrigger, z: 0 })
				}
			}
		}
	}
};