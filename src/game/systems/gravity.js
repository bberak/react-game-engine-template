import * as THREE from "three";

const g = new THREE.Vector3(0, -0.01, 0);

const Gravity = entities => {
	const keys = Object.keys(entities).filter(
		x => entities[x].physics && entities[x].gravity
	);

	keys.forEach(x => {
		entities[x].physics.forces.add(
			entities[x].gravity.isVector3 ? entities[x].gravity : g
		);
	});

	return entities;
};

export default Gravity;
