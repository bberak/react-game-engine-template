import * as THREE from 'three';
import { remap, positive, negative } from "../utils";
import _ from "lodash";
import * as Easing from '@popmotion/easing';

const two_pi = 2 * Math.PI
const elastic = Easing.cubicBezier(0.77, 1.59, 0.85, 0.97);

export const oscillate = ({ range = [-1, 1], direction = new THREE.Vector3(1, 0, 0), start = null, curve = Easing.linear, speed = 0.005 } = {}) => {
	return platform => {
		const getPosition = _.once(() => platform.model.position.clone())
		const getMinimum = _.once(() => new THREE.Vector3().addVectors(getPosition(), direction.normalize().clone().multiplyScalar(range[0])))
		const getMaximum = _.once(() => new THREE.Vector3().addVectors(getPosition(), direction.normalize().clone().multiplyScalar(range[1])))

		curve = Easing.reversed(curve);

		platform.timelines.oscillate = {
			start: start ? new Date().getTime() + start : start,
			args: { progress: 0.5, inc: speed },
			while: true,
			update: (e, _, { args }) => {
				const val = curve(args.progress)
				const min = getMinimum();
				const max = getMaximum();
				
				const x = remap(val, 0, 1, min.x, max.x)
				const y = remap(val, 0, 1, min.y, max.y)
				const z = remap(val, 0, 1, min.z, max.z)

				e.model.position.set(x, y, z)

				if (e.spring)
					e.spring.anchor.set(x, y, z)

				args.progress += args.inc

				if (args.progress > 1) args.inc = negative(args.inc)	
				if (args.progress < 0)	args.inc = positive(args.inc)
			}
		}

		return platform;
	}
}

export const move = ({ dx = 0, dy = 0, dz = 0, start = null, duration = 1000, curve = elastic } = {}) => {
	return platform => {
		const getPosition = _.once(() => platform.model.position.clone())
		const getAnchor = _.once(() => platform.spring.anchor.clone())

		platform.timelines.move = {
			start: start ? new Date().getTime() + start : start,
			duration,
			update(e, _, percent) {
				const val = curve(percent)
				const initial = getPosition();

				const x = remap(val, 0, 1, 0, dx)
				const y = remap(val, 0, 1, 0, dy)
				const z = remap(val, 0, 1, 0, dz)

				e.model.position.x = initial.x + x
				e.model.position.y = initial.y + y
				e.model.position.z = initial.z + z

				if (e.spring){
					const initial = getAnchor();

					e.spring.anchor.x = initial.x + x
					e.spring.anchor.y = initial.y + y
					e.spring.anchor.z = initial.z + z
				}
			}
		}

		return platform;
	}
}

export const scale = ({ start = null, duration = 1000, from = 0.0001, to = 1, curve = elastic } = {}) => {
	return platform => {
		platform.timelines.scale = {
			start: start ? new Date().getTime() + start : start,
			duration,
			update(e, _, percent) {
				const val = remap(curve(percent), 0, 1, from, to)
				e.model.scale.set(val, val, val)
			},
			complete(e) {
				e.model.scale.set(to, to, to)
			}
		}

		return platform
	}
} 

export const rotate = ({ start = 0, duration = 1000, from = 0, to = 1, curve = elastic } = {}) => {
	return platform => {
		platform.timelines.rotate = {
			start: start ? new Date().getTime() + start : start,
			duration,
			update(e, _, percent) {
				const revolutions = remap(curve(percent), 0, 1, from, to)
				e.model.rotation.y = two_pi * revolutions
			},
			complete(e) {
				e.model.rotation.y = two_pi * to
			}
		}

		return platform
	}
}

export default ({ scene, x = 0, y = 0, z = 0, width = 1.1, breadth = 1.1, height = 0.55, yaw = 0, scale = 1, color = 0x22BCE6 }) => {
	const geometry = new THREE.BoxGeometry(width, height, breadth);
	const edges = new THREE.EdgesGeometry(geometry);
	const material = new THREE.LineBasicMaterial({ color, linewidth: 4 });
	const cube = new THREE.LineSegments(edges, material);

	cube.translateX(x);
	cube.translateY(y);
	cube.translateZ(z);
	cube.rotateY(yaw);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.scale.x = scale;
	cube.scale.y = scale;
	cube.scale.z = scale;

	const hitBox = new THREE.Box3()

	scene.add(cube);

	return {
		model: cube,
		platform: true,
		damage: {
			health: 100,
			explodes: true,
		},
		timelines: { },
		removable: frustum => !frustum.intersectsObject(cube),
		destructible: {
			color
		},
		collisions: {			
			bounds() {
				hitBox.setFromObject(cube);
				return hitBox;
			},
			hit(self, other, force) {
				self.physics.forces.add(force);
			}
		},
		physics: {
			mass: 2,
			forces: new THREE.Vector3(),
			acceleration: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			position: cube.position,
			damping: 0.8
		}
	};
};