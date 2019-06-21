import * as THREE from "three";
import { promisifyLoader } from "../utils/three";
import GLTFLoader from "../utils/three/gltfLoader";
import Bomber from "../../assets/models/bomber.glb";
import Particles from "./particles";

export default async ({ scene, x = 0, z = 0, y = 4.5 }) => {
	const side = 0.75 * 1.1;
	const hitBox = new THREE.Box3();
	const loader = promisifyLoader(new GLTFLoader());
	const gltf = await loader.load(Bomber);
	const model = new THREE.Group();

	gltf.scene.rotation.y = Math.PI;

	model.add(gltf.scene);
	model.translateX(x);
	model.translateY(y);
	model.translateZ(z);
	model.rotation.reorder("YXZ");
	model.scale.set(0.3, 0.2, 0.3);

	scene.add(model);

	const thrust = new THREE.Vector3(0, 0, -0.1);

	return {
		model,
		damage: {
			amount: 9999
		},
		rotation: {
			yaw: (self) => {
				return -Math.atan2(self.physics.velocity.z, self.physics.velocity.x)
			}
		},
		collisions: {
			bounds() {
				hitBox.setFromObject(model);
				return hitBox;
			},
			sweepRadius: side,
			predicate: other => other.platform,
			hit(self, other) {
				self.physics.forces.add(
					self.physics.velocity.clone().multiplyScalar(-2)
				);
			},
			notify: true
		},
		gravity: false,
		timelines: {
			move: {
				while: () => true,
				update(self) {
					self.physics.forces.add(thrust);
				}
			}
		},
		physics: {
			mass: 2.5,
			maxSpeed: 0.1,
			forces: new THREE.Vector3(),
			acceleration: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			position: model.position,
			damping: 0.118
		},
		particles: {
			engines: await Particles({
				scene,
				options: {
					position: new THREE.Vector3(),
					positionRandomness: 0.3,
					velocity: new THREE.Vector3(),
					velocityRandomness: 0.0,
					color: 0xffffff,
					colorRandomness: 0.2,
					turbulence: 0.1,
					lifetime: 10,
					size: 5,
					sizeRandomness: 1,
					offset: new THREE.Vector3(),
					engines: [-3, -1.5, 1.5, 3],
					engineIndex: 0
				},
				spawnOptions: {
					spawnRate: 400,
					timeScale: 1
				},
				beforeSpawn(self, entities, { options, spawnOptions, tick }) {
					options.offset.set(
						-0.5,
						0,
						options.engines[options.engineIndex]
					);
					options.offset.applyEuler(self.model.rotation);

					options.position.x =
						self.model.position.x + options.offset.x;
					options.position.y =
						self.model.position.y + options.offset.y;
					options.position.z =
						self.model.position.z + options.offset.z;

					options.velocity.x = self.physics.velocity.x * -0.05;
					options.velocity.y = self.physics.velocity.y * -0.05;
					options.velocity.z = self.physics.velocity.z * -0.05;

					options.engineIndex++;

					if (options.engineIndex >= options.engines.length)
						options.engineIndex = 0;
				}
			})
		}
	};
};
