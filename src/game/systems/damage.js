import * as THREE from 'three';
import { remove, id, remap } from "../utils";
import { Shrapnel } from "../components";

const next = (id => () => id("explosion"))(id(1))

const explode = (entities, target, force) => {
	const scene = entities.scene;

	for (let i = 0; i < 9; i++) {
		const x = target.physics.position.x + remap(Math.random(), 0, 1, -0.2, 0.2)
		const y = target.physics.position.y + remap(Math.random(), 0, 1, -0.3, 0.3)
		const z = target.physics.position.z + remap(Math.random(), 0, 1, -0.25, 0.25)
		const mass = 2 * Math.random();
		const fx = force.x + remap(Math.random(), 0, 1, -0.04, 0.08)
		const fy = force.y + remap(Math.random(), 0, 1, -0.01, 0.4)
		const fz = force.z + remap(Math.random(), 0, 1, -0.04, 0.08)
		const forces = new THREE.Vector3(fx, fy, fz);
		const width = remap(mass, 0, 2, 0.2, 0.6);
		const height = width;
		const breadth = width;
		entities[next()] = Shrapnel({ scene, x , y, z, mass, forces, height, width, breadth, color: target.destructible.color })
	}

	return entities;
}

const Damage = (entities, { events, defer }) => {
	const collision = events.find(x => x.type === "collision");

	if (collision) {
		const damageTarget = collision.entities.find(
			x => x.damage && x.damage.health
		);
		const damagerGiver = collision.entities.find(
			x => x.damage && x.damage.amount
		);

		damageTarget.damage.health -= damagerGiver.damage.amount;

		if (damageTarget.damage.hit)
			damageTarget.damage.hit(damageTarget, damagerGiver);

		if (damageTarget.damage.health <= 0) {
			const index = collision.entities.indexOf(damageTarget);
			const damageTargetKey = collision.keys[index];


			if (damageTarget.damage.explodes)
				explode(entities, damageTarget, collision.force);

			remove(entities, damageTargetKey);
		}
	}

	return entities;
};

export default Damage;
