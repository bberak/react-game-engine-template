import * as THREE from 'three';

export default ({ scene, x = 0, y = 0, z = 0, width = 0.3, breadth = 0.3, height = 0.3, yaw = 0, roll = 0, pitch = 0, scale = 1, color = 0x22BCE6, mass = 2, forces = new THREE.Vector3() }) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const edges = new THREE.EdgesGeometry(geometry);
	const material = new THREE.LineBasicMaterial({ color, linewidth: 4 });
	const cube = new THREE.LineSegments(edges, material);

	cube.translateX(x);
	cube.translateY(y);
	cube.translateZ(z);
	cube.rotateY(yaw);
	cube.rotateX(pitch);
	cube.rotateZ(roll);
	cube.scale.x = scale;
	cube.scale.y = scale;
	cube.scale.z = scale;

	scene.add(cube);

	return {
		model: cube,
		gravity: true,
		removable: frustum => !frustum.intersectsObject(cube),
		rotation: {
			roll(e) {
				return e.physics.velocity.z * -8;
			},
			yaw(e) {
				return e.physics.velocity.y * -8;
			},
			pitch(e) {
				return e.physics.velocity.x * -8;
			}
		},
		physics: {
			mass,
			forces,
			acceleration: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			position: cube.position
		}
	};
};