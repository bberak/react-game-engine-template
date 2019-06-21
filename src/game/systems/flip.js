import * as THREE from 'three';

const Flip = entities => {
	const projectile = entities[Object.keys(entities).find(x => entities[x].projectile && entities[x].flip && entities[x].physics && entities[x].model)]
	
	if (projectile) {
		const isMovingHorizontally = projectile.physics.velocity.z !== 0 || projectile.physics.velocity.x !== 0;
		
		if (isMovingHorizontally)
			projectile.model.rotation.x += projectile.physics.velocity.length() * 1.42;
		else
			projectile.model.rotation.x = 0;
	}

	return entities;
}

export default Flip;