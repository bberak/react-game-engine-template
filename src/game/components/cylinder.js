import * as THREE from "three";
import { add } from "../utils/three";
import Physics from "./base/physics";

export default ({
	parent,
	world,
	dynamic = true,
	x = 0,
	y = 0,
	z = 0,
	radius = 0.5,
	height = 1.1,
	segments = 32,
	scale = 1,
	color = 0x0fe61f,
	opacity = 1,
}) => {
	const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
	const material = new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity, flatShading: true });
	const cylinder = new THREE.Mesh(geometry, material);

	cylinder.position.x = x;
	cylinder.position.y = y;
	cylinder.position.z = z;
	cylinder.scale.x = scale;
	cylinder.scale.y = scale;
	cylinder.scale.z = scale;

	add(parent, cylinder);

	return {
		model: cylinder,
		physics: Physics({
			bodies: [
				{
					shape: "btCylinderShape",
					size: {
						x: radius * scale,
						y: height * scale * 0.5,
						z: radius * scale,
					},
					position: { x, y, z },
					mass: 0.15
				},
			],
			beginContact: (self, other) => {
				if (other.turntable)
					material.color.set(0xff0000);
			},
			endContact: (self, other) => { 
				if (other.turntable)
					material.color.set(color);
			}
		}),
		removable: (frustum, self) => !frustum.intersectsObject(self.model)
	};
};
