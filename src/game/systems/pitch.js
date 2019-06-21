import * as THREE from 'three';

const Pitch = entities => {
	const projectile = entities[Object.keys(entities).find(x => entities[x].projectile && entities[x].pitch && entities[x].physics && entities[x].model)]
	
	if (projectile) {
		const isMovingDownwards = projectile.physics.velocity.y < 0;
		const isMovingHorizontally = projectile.physics.velocity.z !== 0 || projectile.physics.velocity.x !== 0;

		if (isMovingDownwards && isMovingHorizontally)
			projectile.model.rotation.x += 0.04;
		else
			projectile.model.rotation.x *= 0.9;
	}

	return entities;
}

export default Pitch;