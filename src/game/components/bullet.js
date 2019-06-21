import * as THREE from 'three';
import Bullet from "../../assets/textures/bullet-01.png";
import { remap, randomInt } from "../utils"

const BulletTexture = new THREE.TextureLoader().load(Bullet);

export default ({ scene, x, y, z, forces = new THREE.Vector3(), frames = { total: 8, flash: [0, 2], flight: [3, 4], impact: [5, 6], shrapnel: [7, 7]  } }) => {
	
	const spriteSheet = BulletTexture.clone();

	spriteSheet.needsUpdate = true;
	spriteSheet.repeat.set(1 / frames.total, 1);

	const spriteMaterial = new THREE.SpriteMaterial({ map: spriteSheet, color: 0xffffff });
	const sprite = new THREE.Sprite(spriteMaterial);

	sprite.position.x = x + remap(Math.random(), 0, 1, -0.15, 0.15);
	sprite.position.y = y;
	sprite.position.z = z - Math.random() * 0.05;

	const sphere = new THREE.Sphere();

	sphere.isSphere = true;

	scene.add(sprite);

	return {
		model: sprite,
		removable: frustum => !frustum.intersectsSprite(sprite),
		rotation: (e) => -Math.atan2(e.physics.velocity.z, e.physics.velocity.x),
		damage: {
			amount: 20
		},
		gravity: new THREE.Vector3(0, -0.0015, 0),
		timelines: {
			flash: {
				payload: { },
				while: (_1, _2, { payload }) => !payload.done,
				update: (_1, _2, { payload }) => {
					payload.done = true
					spriteSheet.offset.x = randomInt(...frames.flash) / frames.total;
				},
				complete: () => {
					spriteSheet.offset.x = randomInt(...frames.flight) / frames.total;
				}
			}
		},
		collisions: {			
			bounds() {
				sphere.set(sprite.position, 0.25);
				return sphere;
			},
			sweepRadius: 1,
			predicate: other => other.platform,
			hit(self) {
				self.collisions = null;
				self.rotation = null;
				self.model.material.rotation = -Math.atan2(self.physics.velocity.z, self.physics.velocity.x);
				self.physics.velocity.set(0, 0, 0);
				self.timelines.impact = {
					payload: { },
					while: (_1, _2, { payload }) => !payload.done,
					update(_1, _2, { payload }) {
						payload.done = true
						spriteSheet.offset.x = randomInt(...frames.impact) / frames.total;
					},
					complete: () => {
						spriteSheet.offset.x = randomInt(...frames.shrapnel) / frames.total;
					}	
				}
			},
			notify: true
		},
		physics: {
			mass: 0.2,
			maxSpeed: 1.5,
			forces,
			acceleration: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			position: sprite.position,
			damping: 0.0015
		},
	};
};
