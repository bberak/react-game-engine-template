import * as THREE from "three";
import { promisifyLoader, firstMesh } from "../utils/three";
import { clamp } from "../utils";
import GLTFLoader from "../utils/three/gltfLoader";
import Fighter from "../../assets/models/fighter.glb";
import Particles from "./particles";

export default async ({ scene, x = 0, z = 0, y = 4.5 }) => {
	const side = 0.75 * 1.1;
	const hitBox = new THREE.Box3();
	const loader = promisifyLoader(new GLTFLoader());
	const gltf = await loader.load(Fighter);
	const plane = firstMesh(gltf.scene);
	const model = new THREE.Group();

	//plane.rotation.x = -Math.PI * 0.5;
	//plane.rotation.z = Math.PI * 0.5;

	model.add(plane);
	model.translateX(x);
	model.translateY(y);
	model.translateZ(z);
	model.rotation.reorder("YXZ");
	//model.scale.set(0.00514, 0.00514, 0.00514);
	model.scale.set(0.5, 0.5, 0.5);

	scene.add(model);

	return {
		model,
		timelines: {
			animation: {
				while: true,
				update: (_1, _2, _3, { controller }) => {
					if (controller.left)
						plane.morphTargetInfluences[0] = clamp(
							plane.morphTargetInfluences[0] + 0.03,
							0,
							1
						);
					else
						plane.morphTargetInfluences[0] = clamp(
							plane.morphTargetInfluences[0] - 0.03,
							0,
							1
						);

					if (controller.right)
						plane.morphTargetInfluences[1] = clamp(
							plane.morphTargetInfluences[1] + 0.03,
							0,
							1
						);
					else
						plane.morphTargetInfluences[1] = clamp(
							plane.morphTargetInfluences[1] - 0.03,
							0,
							1
						);

					if (controller.accelerate) {
						plane.morphTargetInfluences[2] = clamp(
							plane.morphTargetInfluences[2] - 0.03,
							0,
							1
						);
						plane.morphTargetInfluences[4] = clamp(
							plane.morphTargetInfluences[4] - 0.03,
							0,
							1
						);
					} else {
						plane.morphTargetInfluences[2] = clamp(
							plane.morphTargetInfluences[2] + 0.03,
							0,
							1
						);
						plane.morphTargetInfluences[4] = clamp(
							plane.morphTargetInfluences[4] + 0.03,
							0,
							1
						);
					}
				}
			}
		},
		removable: false,
		damage: {
			amount: 9999
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
		player: true,
		physics: {
			mass: 2.5,
			maxSpeed: 0.5,
			forces: new THREE.Vector3(),
			acceleration: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			position: model.position,
			damping: 0.118
		},
		particles: {
			engine: await Particles({
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
					offset: new THREE.Vector3()
				},
				spawnOptions: {
					spawnRate: 200,
					timeScale: 1
				},
				beforeSpawn(
					self,
					entities,
					{ options, spawnOptions, tick },
					{ controller }
				) {
					options.offset.set(-1.3, 0.7, 0);
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

					if (controller.accelerate)
						spawnOptions.spawnRate = Math.min(
							spawnOptions.spawnRate * 1.1,
							15000
						);
					else
						spawnOptions.spawnRate = Math.max(
							spawnOptions.spawnRate * 0.9,
							200
						);

					if (
						controller.accelerate &&
						!controller.previous.accelerate
					)
						options.size = 70;
					else options.size = Math.max(options.size * 0.9, 5);
				}
			})
		}
	};
};
